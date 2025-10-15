# TestPTFL

Ce dépôt contient la fondation du projet Lumina, une plateforme SaaS multi-locataire pour portfolios d'artistes. Il est organisé en monorepo Turborepo avec plusieurs applications Next.js et une API NestJS, en plus de bibliothèques partagées.

## Structure du monorepo

```
apps/
  web-marketing/      -> Landing marketing Next.js + Chakra UI
  app-backoffice/     -> Back-office Next.js pour la gestion multi-artistes
  web-artist/         -> Rendu public multi-tenant des portfolios Next.js
  api-server/         -> API NestJS connectée à Prisma/Supabase
packages/
  ui/                 -> Composants React mutualisés
  shared/             -> Types et utilitaires communs
  config/             -> Gestion de la configuration applicative
```

## Démarrer

1. Installez PNPM et les dépendances :
   ```bash
   pnpm install
   ```
2. Lancez les environnements de développement :
   ```bash
   pnpm dev
   ```

Reportez-vous à la [documentation produit](docs/product-architecture.md) pour la vision complète, l'architecture détaillée et la roadmap d'implémentation.
