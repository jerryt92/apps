from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from ipaddress import ip_address
from pathlib import Path
import socket
import subprocess


SITE_ROOT = Path(__file__).resolve().parent
PORT = 8765


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = Path(self.translate_path(self.path)).resolve()
        if not path.is_relative_to(SITE_ROOT) or any(
            part.startswith(".") for part in path.relative_to(SITE_ROOT).parts
        ):
            self.send_error(HTTPStatus.NOT_FOUND)
            return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(HTTPStatus.NOT_FOUND)
        return None

    def send_error(self, code, message=None, explain=None):
        if code != HTTPStatus.NOT_FOUND:
            return super().send_error(code, message, explain)

        try:
            page = (SITE_ROOT / "404.html").read_bytes()
        except OSError:
            return super().send_error(code, message, explain)

        self.send_response(code)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(page)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(page)


class DualStackHTTPServer(ThreadingHTTPServer):
    address_family = socket.AF_INET6

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


def lan_urls(port, include_ipv6):
    try:
        interfaces = subprocess.check_output(["/sbin/ifconfig", "-a"], text=True)
    except (OSError, subprocess.CalledProcessError):
        return []

    urls = {}
    for line in interfaces.splitlines():
        fields = line.split()
        if not fields or fields[0] not in ("inet", "inet6"):
            continue
        address = ip_address(fields[1].split("%", 1)[0])
        if address.is_loopback or address.is_unspecified:
            continue
        if address.version == 6 and (not include_ipv6 or address.is_link_local):
            continue
        host = f"[{address}]" if address.version == 6 else str(address)
        urls[host] = f"http://{host}:{port}/"
    return list(urls.values())


def main():
    handler = partial(PreviewHandler, directory=SITE_ROOT)
    include_ipv6 = socket.has_dualstack_ipv6()
    server_class = DualStackHTTPServer if include_ipv6 else ThreadingHTTPServer
    host = "::" if include_ipv6 else "0.0.0.0"
    with server_class((host, PORT), handler) as server:
        print(f"Local: http://localhost:{PORT}/", flush=True)
        for url in lan_urls(PORT, include_ipv6):
            print(f"LAN:   {url}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
