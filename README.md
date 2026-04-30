<p align="center">
  <a href="https://crafterstation.com" target="_blank">
    <img src="https://raw.githubusercontent.com/Railly/crafter-station/main/public/logo.png" height="64">
  </a>
  <br />
  <h1 align="center">css-bash-vote</h1>
</p>

<div align="center">

[![Built with Crafter Station](https://img.shields.io/badge/built%20with-Crafter%20Station-orange)](https://crafterstation.com)
[![Discord](https://img.shields.io/discord/856971667393609759?logo=discord)](https://discord.gg/NRDWrGnxTU)
[![Twitter](https://img.shields.io/twitter/follow/crafterstation)](https://twitter.com/crafterstation)

</div>

## About

Community-driven blind A/B benchmark where Crafter Station members vote on which AI agent generated better CSS.

## Tech Stack

- **Framework**: Astro 5
- **Styling**: Tailwind CSS
- **Linting**: Biome
- **Runtime**: Bun
- **Auth**: Clerk
- **DB**: Neon (Postgres) + Drizzle ORM
- **Deploy**: Vercel

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Environment Variables

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL=postgresql://...
```

## DB Setup

```bash
bun drizzle-kit push
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun lint` | Run Biome linter |
| `bun format` | Format code with Biome |

## Deployment

Deployed on [Vercel](https://vercel.com) at css-bash-vote.crafter.run

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT
