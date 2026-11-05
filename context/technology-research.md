# Phase 1 — Recherche technique (Talum)

Périmètre : vitrine + estimateur + PDF serveur + e-mail transactionnel + assistant à règles + contenu éditable + tests + CI/CD.
Méthode : versions relevées sur le registre npm et la documentation officielle le **2026-11-05** ; aucune installation exécutée.
Contrainte : tout choix respecte `context/project.md` (Next.js App Router, TypeScript strict, Tailwind, RHF + Zod, react-pdf, Resend, Vercel/Docker).

## 1. Comparatif et recommandations

| Sujet | Recommandation | Version exacte | Justification courte | Source | Risque / piège |
|---|---|---|---|---|---|
| Socle applicatif | Next.js App Router + React | `next 16.4.5`, `react 19.3.1`, `react-dom 19.3.1` | 16.x = LTS actif ; RSC, Server Actions, Turbopack par défaut | https://nextjs.org/blog/next-16 | `params`/`cookies` async, `middleware.ts` → `proxy.ts`, `next lint` supprimé |
| Langage | TypeScript strict, épinglé 6.0.3 | `typescript 6.0.3` | TS 7.0.2 (port Go) n'expose pas l'API compilateur requise par typescript-eslint (`<6.1.0`) | https://www.npmjs.com/package/typescript-eslint | Ne pas suivre le tag `latest` (7.0.2) : casse le lint |
| Styles | Tailwind CSS 4 en CSS-first, tokens `@theme` | `tailwindcss 4.3.4`, `@tailwindcss/postcss 4.3.4` | Plus de `tailwind.config.js` ; tokens partagés avec le design system | https://tailwindcss.com/blog/tailwindcss-v4 | Dark mode = `@custom-variant dark` explicite ; pas de plugin legacy |
| Composants accessibles | Base UI (`@base-ui/react`) + primitives maison | `@base-ui/react 1.9.0` | Successeur Radix maintenu par la même équipe ; ARIA/WCAG, non stylé donc compatible « très carré » | https://base-ui.com/react/overview/quick-start | `CSPProvider` ne couvre pas les attributs `style=""` |
| Formulaires | React Hook Form + Zod + resolvers, schémas partagés | `react-hook-form 7.91.0`, `zod 4.6.7`, `@hookform/resolvers 7.0.3` | Une seule source de vérité client/serveur, validation dans les Server Actions | https://react-hook-form.com/docs/useform | Zod 4 : API `error` (plus `message`) ; schémas dans un module neutre |
| Contenu | JSON typé + Zod comme socle ; MDX seulement pour les études de cas longues | `@next/mdx 16.4.5` (+ `@mdx-js/loader 3.1.1`) | Données validées au build, pas de dépendance CMS ; MDX officiel si besoin rédactionnel | https://nextjs.org/docs/app/guides/mdx | JSON = rebuild pour publier ; `next-mdx-remote` archivé (avr. 2026) |
| PDF serveur | `@react-pdf/renderer`, `renderToBuffer` en Route Handler | `@react-pdf/renderer 4.9.0` | Rendu React → PDF sans navigateur headless ; polices embarquées, sortie buffer | https://react-pdf.org/node | Polices TTF/WOFF uniquement (pas de variable) ; tracer les fichiers de police |
| E-mail | Resend + composants React Email | `resend 6.37.0` | SDK TypeScript, rendu React, clés d'idempotence, SPF/DKIM documentés | https://resend.com/docs/send-with-nextjs | Vérifier le domaine + DMARC ; expédier depuis un sous-domaine |
| Rate limiting | Interface maison + adaptateur Upstash (dev : mémoire) | `@upstash/ratelimit 2.2.0`, `@upstash/redis 1.41.0` | HTTP, portable Vercel **et** Docker ; fenêtre glissante | https://upstash.com/docs/redis/sdks/ratelimit-ts/overview | Dépendance externe ; `@vercel/firewall` reste spécifique Vercel |
| i18n | next-intl, FR seul, `localePrefix: 'as-needed'` | `next-intl 4.14.9` | RSC-first, messages typés, hreflang `x-default` automatique, prêt EN | https://next-intl.dev/docs/routing | Ajoute un segment de routing ; à poser maintenant, coûteux après coup |
| Tests unitaires | Vitest + Testing Library + jsdom | `vitest 5.1.0`, `@testing-library/react 16.3.3`, `jsdom 30.1.3` | Rapide, ESM/TS natif, Node 24 supporté ; moteur de prix testé isolément | https://vitest.dev/guide/ | Vitest 5 exige Node `^22.12 \|\| ^24 \|\| >=26` |
| Tests E2E | Playwright + axe | `@playwright/test 1.64.1`, `@axe-core/playwright 4.14.0` | 3 parcours critiques + scans a11y ; artefacts en CI | https://playwright.dev/docs/ci | `workers: 1` en CI ; installer les navigateurs avec `--with-deps` |
| Lint / format | ESLint 10 flat config + `eslint-config-next` + Prettier | `eslint 10.14.0`, `eslint-config-next 16.4.5`, `prettier 3.9.10` | Support Next 16 et ESLint 10 ; séparation lint/format | https://nextjs.org/docs/app/api-reference/config/eslint | Flat config obligatoire ; Biome non retenu (écosystème Next) |
| Sécurité | En-têtes statiques par défaut ; CSP à nonce uniquement sur les routes dynamiques | — (natif Next) | HSTS, `frame-ancestors`, `nosniff` ; CSRF Server Actions vérifié via `Origin`/`Host` | https://nextjs.org/docs/app/guides/content-security-policy | Nonce ⇒ rendu dynamique (cache ISR perdu) ; sinon accepter `unsafe-inline` sur `style-src-attr` |
| Déploiement | Vercel par défaut ; Docker via `output: 'standalone'` | `next 16.4.5` | Un seul codebase, deux cibles ; `.next/standalone` + `.next/static` + `public` | https://nextjs.org/docs/app/guides/self-hosting | Cache ISR local par instance en Docker ; limite 250 Mo par fonction Vercel |
| CI/CD | GitHub Actions : lint → typecheck → tests → build → E2E | `checkout 7.0.1`, `setup-node 7.1.0`, `cache 6.1.0`, `upload-artifact 7.0.2` | Pipeline court, cache npm, rapport Playwright archivé | https://github.com/actions/checkout/releases | Node 24 en primaire ; pas de secrets dans les `pull_request` de forks |

**Recommandation d'ensemble** — socle Next.js 16.4.5 / React 19.3.1 / TypeScript 6.0.3 ; vitrine en rendu statique + ISR, estimateur et contact en Server Actions ; PDF en Route Handler Node (`runtime = 'nodejs'`) ; e-mail via Resend. Alternatives écartées : Pages Router (hors stack), Next 15 (maintenance), TypeScript 7 (lint cassé), Radix + shadcn tels quels (style à démonter), MDX-first (dépendances mortes), `@vercel/firewall` (non portable).

## 2. Écarts par rapport au brief

- **Radix UI → Base UI** : Radix reste maintenu (`1.8.1`), mais Base UI est le successeur actif de la même équipe ; « ou équivalent » couvre ce choix. Radix reste le repli si un composant manque.
- **MDX → JSON typé + Zod** : `next-mdx-remote` est archivé depuis avril 2026 et Contentlayer est dormant depuis 2023. Le socle JSON évite une dépendance morte ; `@next/mdx` (officiel) reste disponible pour de la prose longue.
- **TypeScript 7.0.2 écarté** : c'est le tag `latest`, mais typescript-eslint 8.72.1 déclare `typescript >=4.8.4 <6.1.0`. On épingle `6.0.3` jusqu'à la publication du support TS 7.
- **`next lint` supprimé dans Next 16** : scripts `lint` = `eslint .`, configuration flat (`defineConfig([...nextVitals, globalIgnores(...)])`).
- **Nouveaux défauts Next 16 à trancher en Phase 1** : Turbopack par défaut (build), `params`/`searchParams` async, `proxy.ts` (runtime Node), `qualities: [75]`, `minimumCacheTTL` 4 h, `cacheComponents`.
- **PDF sous Node 24** : react-pdf 4.9.0 ne documente que Node 18/20/21 ; le rendu est testé en local et en CI sur Node 24 avant de figer la version.
- **i18n absent du brief initial** : « français d'abord, prêt pour l'anglais » impose `next-intl` dès le routing, pas une traduction rétroactive.
- **Rate limiting** : `@vercel/firewall` (1.2.6) n'existe que sur Vercel ; l'abstraction + adaptateur garantit la parité Docker.

## 3. Cinq décisions à arbitrer (client + architecte)

1. **Hébergement : Vercel ou Docker ?**
   - A. Vercel seul — DX et CDN immédiats, mais verrouillage (firewall, cache, limites 250 Mo).
   - B. Docker seul — portable et souverain, mais cache ISR et observabilité à opérer.
   - **Reco** : un codebase, Vercel en cible primaire, `output: 'standalone'` maintenu et testé en CI (build Docker). Décision requise avant la Phase 2 (formes `next.config`).

2. **Contenu : JSON + Zod ou MDX ?**
   - A. JSON typé + Zod — validation, zéro dépendance, adapté aux champs listés dans le brief.
   - B. MDX pour tout — rédaction riche, mais build plus lourd et validation faible.
   - **Reco** : A comme socle, B uniquement pour les études de cas via `@next/mdx`. Impact : le client publie par commit, sauf ajout ultérieur d'un CMS (hors périmètre).

3. **i18n : maintenant ou plus tard ?**
   - A. `next-intl` maintenant, FR seul (`as-needed`) — coût faible, dette évitée.
   - B. Plus tard — URLs et layout à refactorer, hreflang à rétrofitter.
   - **Reco** : A. Impact : segment de locale optionnel, messages externalisés dès la Phase 2.

4. **CSP : nonce strict ou en-têtes statiques ?**
   - A. Nonce dans `proxy.ts` — CSP maximal, mais rendu dynamique et cache ISR dégradé.
   - B. CSP statique (`unsafe-inline` sur `style-src-attr`) — pages cacheables, protection légèrement moindre.
   - **Reco** : B par défaut ; A uniquement sur les routes sensibles (contact, estimateur) si le besoin est démontré. Impact : Lighthouse et cache préservés.

5. **Primitives UI : Base UI, Radix ou shadcn/ui ?**
   - A. Base UI — composants non stylés, alignés sur la direction « très carré ».
   - B. Radix — mature, écosystème large, mais style shadcn par défaut à démonter.
   - **Reco** : A, avec Radix en repli ponctuel ; shadcn utilisé comme référence de code (copier/coller), jamais comme dépendance runtime.

## 4. Paquets épinglés pour la Phase 2

```jsonc
// dependencies
"next": "16.4.5",
"react": "19.3.1",
"react-dom": "19.3.1",
"tailwindcss": "4.3.4",
"@tailwindcss/postcss": "4.3.4",
"@base-ui/react": "1.9.0",
"react-hook-form": "7.91.0",
"@hookform/resolvers": "7.0.3",
"zod": "4.6.7",
"@react-pdf/renderer": "4.9.0",
"resend": "6.37.0",
"@react-email/components": "1.0.12",
"@upstash/ratelimit": "2.2.0",
"@upstash/redis": "1.41.0",
"next-intl": "4.14.9",
"next-themes": "0.4.6"
```

```jsonc
// devDependencies
"typescript": "6.0.3",
"@types/node": "24.19.2",         // aligner sur la LTS Node 24
"@types/react": "19.3.0",
"@types/react-dom": "19.3.0",
"eslint": "10.14.0",
"eslint-config-next": "16.4.5",
"prettier": "3.9.10",
"vitest": "5.1.0",
"@vitejs/plugin-react": "6.2.1",
"jsdom": "30.1.3",
"@testing-library/react": "16.3.3",
"@testing-library/jest-dom": "7.0.1",
"@playwright/test": "1.64.1",
"@axe-core/playwright": "4.14.0",
"@next/mdx": "16.4.5"             // seulement si MDX retenu
```

## 5. Risques et limites

- **react-pdf / Vercel** : les polices doivent être incluses via `outputFileTracingIncludes` par route, sinon `ENOENT` en production.
- **Base UI + CSP** : les attributs `style` inline générés imposent `style-src-attr 'unsafe-inline'` ou un positionnement 100 % CSS.
- **Upstash** : ajoute une dépendance réseau sur le chemin critique du formulaire ; prévoir un adaptateur mémoire pour les tests et un timeout court.
- **Cache Components** : activé par défaut sur les nouveaux projets 16.4 ; sémantique de cache modifiée — à décider explicitement, sinon régressions ISR silencieuses.
- **Chaîne TS 7** : rester en 6.0.3 tant que typescript-eslint ne publie pas `>=6.1.0` ; surveiller à chaque montée de version.
- **RGPD / mesure d'audience** : Vercel Analytics et Speed Insights déposent des identifiants ; les charger après consentement ou retenir une mesure sans cookie.

## 6. Décision de mise en œuvre — Phase 2

- **Préfixe de langue** : `localePrefix: 'always'` pour le socle initial. Le test de production de `as-needed` avec Next.js 16.4.5 a provoqué une boucle de redirection sur `/`; le préfixe explicite `/fr` et `/en` a été vérifié en HTTP. Revoir ce choix si une version ultérieure corrige le comportement.
- **Hébergement** : configuration `output: 'standalone'`, déploiement compatible Docker ; Vercel reste possible sur le même build.
- **Sécurité** : premiers en-têtes HTTP défensifs ajoutés ; CSP et protections spécifiques aux formulaires restent dans la phase sécurité dédiée.
