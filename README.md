# jerryt92‘s Apps

Static bilingual app collection for PhotoTransfer, MapLab and PhotoAssistant.

## Local preview

Run `python3 serve.py` from this directory and open `http://localhost:8765/`. On a device connected to the same network, use one of the printed LAN URLs. Press Ctrl+C to stop the server.

## Routes

- `/` — app collection
- `/photo-transfer/`, `/photo-transfer/support/`, `/photo-transfer/privacy/`
- `/maplab/`, `/maplab/support/`, `/maplab/privacy/`
- `/photo-assistant/`, `/photo-assistant/support/`, `/photo-assistant/privacy/`

The PhotoTransfer site is in its own folder, with separate styles and assets. Language preference is shared across all pages in this site.

The site is intended for GitHub Pages with `apps.jerryt92.top` configured as its custom domain.

MapLab has an independent responsive stylesheet, light/dark icon assets and real iPhone 17 Pro Max (iOS 27.0) screenshots captured with DeviceHub, plus a screenshot comparison toggle. It shares the existing language preference. MapLab App Store listing: https://apps.apple.com/cn/app/id6832565759. Download links appear in the MapLab hero, closing section and collection card.

The PhotoTransfer page leads with import/export, Live Activities, Live Photos, transfer results, and duplicate skipping. Its eight App Store marketing screenshots are copied from `PhotoTransfer/AppStoreMarketing/screenshots/iphone-6.5/` and resized to 720px-wide JPEGs for the web; the photo map is included as the final feature shot.

PhotoAssistant reuses the MapLab stylesheet with a warm raspberry palette drawn from its pinwheel icon, a transparent pinwheel logo and real iPhone screenshots (timeline, photo map, media info, batch selection) resized to 644px-wide PNGs. The hero has a timeline/map screenshot toggle. PhotoAssistant App Store listing: https://apps.apple.com/cn/app/id6833397139. Download links appear in the hero, closing section, and collection card. Marketing source: `PhotoAssistant/AppStoreMarketing/marketing-zh.png`.
