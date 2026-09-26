# Storyfolk

Storyfolk is a browser-based character creator for shaping a fictional character's identity, traits, portrait, description, and resemblance to well-known screen characters.

## Development

```bash
npm ci
npm run dev
```

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the static site whenever `main` changes. The app stores character data in the browser and does not require an application server or database.

To test the Pages build locally:

```bash
PAGES_BASE_PATH=/storyfolk/ npm run build:pages
```
