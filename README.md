# Talum

Site vitrine et outils d'accompagnement pour Talum. L'interface démarre en français et prépare le routage pour l'anglais.

## Prérequis

- Node.js 24 LTS
- npm 10 ou ultérieur

## Démarrer en local

```bash
npm ci
npm run dev
```

Le site est accessible sur <http://localhost:3000>. Les routes sont `/fr` en français et `/en` en anglais ; `/` redirige vers le français.

## Vérifications

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Modifier les tarifs de l'estimateur

Tous les montants, jours et coefficients de l'estimateur vivent dans `src/lib/pricing/config.ts`. Aucun composant ne contient de prix en dur.

- Une valeur `null` signifie « donnée client non fournie ». Le moteur renvoie alors `status: "pending-config"` et l'interface n'affiche aucun prix.
- Pour activer l'estimateur, renseigner les `dailyRate`, `baseDays`, `features[].days`, `constraints[].days`, `fees[].amount`, les `complexityFactors`, les `urgencyFactors`, `riskMarginRate` et `rangeSpread`.
- Choisir `vat.regime` :
  - `"franchise"` avec `rate: 0` (TVA non applicable, art. 293 B du CGI) ;
  - `"standard"` avec `rate: 0.2` (TVA à 20 %).
- `npm test` vérifie le moteur avec une configuration de test (`src/lib/pricing/__tests__/fixtures.ts`). Les tarifs réels ne doivent jamais servir de fixture.
- Le moteur est pur (`src/lib/pricing/engine.ts`) : aucune dépendance à React, aucune lecture d'environnement, aucune horloge. Chaque ligne produite porte un `ruleId` et les facteurs appliqués.

Pour valider une modification de tarifs : renseigner la config, lancer `npm test`, puis vérifier l'affichage sur `/fr/estimate`.

## Docker

```bash
docker build -t talum-site .
docker run --rm -p 3000:3000 talum-site
```

## Configuration

Copier `.env.example` vers `.env.local` pour définir les variables d'environnement.

### Réception des demandes de contact par e-mail

Le formulaire envoie les coordonnées et le message au destinataire configuré avec Resend. Sans ces variables, l’API refuse l’envoi et n’affiche pas de faux succès.

1. Créer un compte Resend et une clé API.
2. Vérifier un domaine d’envoi dans Resend. L’adresse `CONTACT_FROM_EMAIL` doit utiliser ce domaine ; une adresse personnelle Gmail ne peut pas servir d’expéditeur.
3. Renseigner les variables suivantes dans `.env.local` pour le développement local :

```env
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=votre-adresse-personnelle@example.com
CONTACT_FROM_EMAIL=Talum <contact@votre-domaine.com>
```

En production, ajouter ces mêmes variables dans les paramètres d’environnement de l’hébergeur, sans publier ni partager la clé API. La réponse du formulaire peut alors être envoyée directement à votre adresse personnelle ; répondre au courriel reçu répondra au demandeur.

## Structure

- `src/app/[locale]` : routes localisées et layout
- `src/components` : composants partagés
- `src/i18n` : configuration du routage et des messages
- `src/lib/pricing` : moteur de calcul pur, configuration typée et tests
- `src/messages` : textes français et anglais

Les contenus et données encore inconnus sont réservés aux phases suivantes ; aucun chiffre métier ni tarif n'est inventé.
