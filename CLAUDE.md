# AppBase-Front-Web - Claude Reference

## Development Commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build` (Automatically configures `.htaccess` for the environment)
- Run unit tests: `npm run test:unit`
- Run E2E tests: `npm run test:e2e`
- Lint code: `npm run lint`

## Environment Configuration
- `VITE_BASE_PATH`: Set the routing base path.
  - Development/Laragon: `/` (Set in `.env`)
  - GitHub Pages: `/AppBase-Front-SPA/` (Set in GitHub Action)

## Hosting & Deployment
- For details on how to set up Laragon or GitHub Pages, see [HOSTING_GUIDE.md](HOSTING_GUIDE.md).
- **Important**: Laragon should point to the `/dist` folder as `DocumentRoot`.

## Technical Notes
- **Routing**: Single Page Application routing is handled via Apache ModRewrite in `.htaccess`.
- **CORS**: Ensure `ALLOWED_ORIGINS` in the backend includes the frontend domain.
- **SSO**: Auth flow requires visual parity and SSO redirect logic.
