# Ottfree

A movie and series streaming website.

## Features

- **Browse Movies**: Explore a vast collection of movies sorted by genre, release date, or popularity.
- **Search Functionality**: Easily find movies by title, director, or cast.
- **Recommendation Engine**: Get personalized movie recommendations based on your preferences and viewing history.
- **Responsive Design**: Enjoy a seamless experience across devices with our responsive web design.
- **Ad Placements**: Configure ad code from environment variables without editing source files.

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Render](https://render.com/) / [Koyeb](https://www.koyeb.com/) – Docker deployments
- [TMDb](https://www.themoviedb.org/) - movie database
- [Vidsrc.to](https://vidsrc.to/) - streaming links

## Local Development

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Create an environment file: `cp .env.example .env`.
5. Add your TMDb token to `NEXT_PUBLIC_TMDB_TOKEN`.
6. Start the development server: `npm run dev`.

## Environment variables

Copy `.env.example` and configure these production values in your hosting provider:

- `NEXT_PUBLIC_APP_URL`: Your public site URL, for example `https://movieasia.onrender.com`.
- `NEXT_PUBLIC_TMDB_TOKEN`: TMDb API bearer token used for movie data.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`: Admin login configuration.
- `NEXT_PUBLIC_VIDEO_SANDBOX_ENABLED`: Set to `true` (default) to block iframe popups and top-page redirects. Viewers can temporarily turn it off from the player if a provider needs compatibility mode.
- `NEXT_PUBLIC_ADS_HEAD_CODE`: Optional provider-wide ad script/config. Add JavaScript only, without wrapping `<script>` tags.
- `NEXT_PUBLIC_AD_TOP_BANNER_CODE`: Home page top banner ad unit markup.
- `NEXT_PUBLIC_AD_NATIVE_DISCOVERY_CODE`: Home page native/discovery ad unit markup.
- `NEXT_PUBLIC_AD_WATCH_TOP_CODE`: Watch page top banner ad unit markup.
- `NEXT_PUBLIC_AD_WATCH_VAST_CODE`: Watch page VAST/video demand ad unit markup.

Leave ad unit variables blank to keep the built-in placeholder boxes visible.

## Deploying to Render

1. Push this repository to GitHub.
2. In Render, create a new **Blueprint** from the repository. Render will read `render.yaml`.
3. Fill in the secret environment variables prompted by the blueprint.
4. Set `NEXT_PUBLIC_APP_URL` to the Render service URL after the first deploy if you do not have a custom domain yet.

Render uses the Dockerfile, listens on its required port (`10000`), and checks
`/api/health` for service health. The health endpoint remains available while
maintenance mode is enabled, so it will not cause an otherwise healthy service
to be marked unavailable.

## Deploying to Koyeb

1. Push this repository to GitHub.
2. In Koyeb, create an app from the repository and use the included `koyeb.yaml` service definition, or choose Dockerfile deployment manually.
3. Add the environment variables from `.env.example` in Koyeb service settings.
4. Set `NEXT_PUBLIC_APP_URL` to your Koyeb app URL or custom domain.

Koyeb builds the Dockerfile, exposes port `3000`, and uses `/api/health` for health checks.

## Admin credentials

Admin login is configured only with server-side environment variables. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in your local `.env` file or deployment provider. Do not commit real production credentials.

The login endpoint uses a POST/redirect/GET flow, so a successful sign-in always
lands on the dashboard instead of replaying the form submission. If login fails
on Render, confirm that both `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set on
the **web service** and redeploy after changing them.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/improvement`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/improvement`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- The Movie Database (TMDb) for providing the movie data through their API.
- Vidsrc.to for providing the movie streaming links.

---
