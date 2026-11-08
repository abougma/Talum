# Taloom — Direction de design & design system (Phase 1)

Direction « très carré » : grille 12 colonnes, angles à 0, filets 1 px, blanc dominant, hiérarchie typographique nette. L'accent est rare : lien, focus, état actif, donnée clé. Aucun contenu client inventé : les chiffres, certifications et coordonnées restent `[À COMPLÉTER]`.

## 1. Palette

### Trois accents possibles

| # | Nom | Hex | Ressenti | Secteurs / cibles |
|---|-----|-----|----------|-------------------|
| A | Bleu encre | `#1F4FD8` | Fiable, précis, institutionnel, calme | TPE/PME, écoles, secteur public, finance, startups B2B |
| B | Vert profond | `#1F6B4F` | Stable, durable, humain, mesuré | Associations, éducation, RSE, santé, économie sociale |
| C | Ocre brûlé | `#A6431E` | Chaleureux, artisanal, affirmé, ancré | Culture, tourisme, PME familiales, marque Lille–Abidjan |

**Recommandation : A — Bleu encre `#1F4FD8`.** Il porte la confiance et la rigueur attendues par les TPE/PME et les écoles, reste lisible à 6,63:1 sur blanc, fonctionne en clair comme en sombre, et se distingue du bleu « corporate » pur par une légère désaturation. Il n'entre pas en concurrence avec les captures de projets et évite le cliché « Afrique = terre cuite ». B est la meilleure alternative si le client veut sortir du bleu ; C est réservé à une marque plus éditoriale.

### Échelles accent et neutres

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#EEF3FF` | `#DCE6FE` | `#C0D2FD` | `#94B4FB` | `#608EF7` | `#3A6DF0` | `#1F4FD8` | `#1A3FAF` | `#193688` | `#182F6B` | `#101E45` |

Neutres **froids**, très légèrement bleutés : cohérence avec l'accent, neutralité des captures, absence de dominante jaune en sombre. Un gris chaud adoucirait la page mais tirerait vers l'éditorial, quand la direction demande de la précision.

| 0 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FFFFFF` | `#F7F8F9` | `#EFF1F3` | `#E2E5E9` | `#CBD1D8` | `#9AA3AE` | `#6B7480` | `#4D5560` | `#363D47` | `#232830` | `#12151A` | `#0B0D11` |

### Sémantiques (clair / sombre)

| Rôle | Texte clair | Fond clair | Texte sombre | Fond sombre |
|------|-------------|------------|--------------|-------------|
| Succès | `#1E7A46` | `#EAF6EF` | `#5FD08A` | `#0F2A1C` |
| Erreur | `#B42318` | `#FEF3F2` | `#FF8A80` | `#2A1210` |
| Attention | `#8A5A00` | `#FDF6E7` | `#F5B544` | `#2A1E08` |
| Info | = accent `#1F4FD8` | `#EEF3FF` | = accent `#94B4FB` | `#101E45` |

### Contrastes AA vérifiés

| Combinaison | Clair | Sombre |
|-------------|-------|--------|
| Texte principal sur fond | `#12151A` / `#FFFFFF` — **18,29:1** | `#EFF1F3` / `#0B0D11` — **17,17:1** |
| Texte secondaire sur fond | `#4D5560` / `#FFFFFF` — **7,54:1** | `#9AA3AE` / `#0B0D11` — **7,62:1** |
| Texte discret sur fond | `#6B7480` / `#FFFFFF` — **4,74:1** | `#8A929E` / `#0B0D11` — **6,19:1** |
| Accent sur fond | `#1F4FD8` / `#FFFFFF` — **6,63:1** | `#94B4FB` / `#0B0D11` — **9,43:1** |
| Accent sur surface | `#1F4FD8` / `#F7F8F9` — **6,23:1** | `#94B4FB` / `#12151A` — **8,56:1** |
| Texte sur accent plein | `#FFFFFF` / `#1F4FD8` — **6,63:1** | `#0B0D11` / `#94B4FB` — **9,43:1** |
| Bordure de champ (non-texte) | `#6B7480` / `#FFFFFF` — **4,74:1** | `#6B7480` / `#12151A` — **3,86:1** |
| Succès / Erreur | **5,35:1** / **6,57:1** | **10,07:1** / **8,52:1** |
| Sélection douce | `#1A3FAF` / `#EEF3FF` — **7,96:1** | `#C0D2FD` / `#101E45` — **10,73:1** |

## 2. Typographie

| Duo | Titres | Texte | Raison |
|-----|--------|-------|--------|
| **A (recommandé)** | **Archivo** (500/600/700) | **IBM Plex Sans** (400/500/600) | Grotesque solide, terminaisons carrées, excellent en gras ; Plex Sans est humaniste, très lisible, avec chiffres tabulaires pour les devis. Deux familles Google Fonts, variables, `next/font/google`, subset latin. |
| B | Space Grotesk (500/600/700) | Inter (400/500/600) | Plus « startup » : titres techniques et singuliers, Inter très neutre. Risque : plus générique et moins sobre que A. |

**Recommandation : A.** Charger Archivo en `display: swap`, `weight: ["500","600","700"]`, Plex Sans en `["400","500","600"]`. Le code et les schémas utilisent la pile système monospace (`ui-monospace, SFMono-Regular, Menlo, monospace`), sans troisième téléchargement.

| Rôle | Taille / interligne | Tracking | Usage |
|------|---------------------|----------|-------|
| Display | 4,5 rem / 1,0 — fluide `clamp(2,75rem, 6vw, 4,5rem)` | −0,03 em | H1 d'accueil uniquement |
| H1 | 3 rem / 1,05 | −0,025 em | Titre de page |
| H2 | 2,25 rem / 1,1 | −0,02 em | Section |
| H3 | 1,5 rem / 1,2 | −0,015 em | Sous-section, carte |
| H4 | 1,125 rem / 1,35 | −0,005 em | Libellé fort, étape |
| Body L | 1,125 rem / 1,6 | 0 | Chapô, intro |
| Body | 1 rem / 1,65 | 0 | Prose, formulaires |
| Small | 0,875 rem / 1,5 | 0,005 em | Légendes, aide, méta |
| Caption | 0,75 rem / 1,4 | 0,08 em, majuscules | Surtitre, numéro de section (≤ 3 mots) |

Règles : 3 niveaux de titre maximum par section ; casse de phrase pour tous les titres ; pas d'italique décoratif ; mesure 60–72 caractères ; chiffres en `font-variant-numeric: tabular-nums` dans les tableaux et l'estimateur ; jamais de texte justifié.

## 3. Grille et espacement

| Breakpoint | Marge | Gouttière | Colonnes | Contenu max |
|------------|-------|-----------|----------|-------------|
| 360 | 20 px | 16 px | 12 (blocs sur 3 unités) | 320 px |
| 480 | 24 px | 16 px | 12 (blocs sur 2 unités) | 432 px |
| 768 | 32 px | 24 px | 12 | 704 px |
| 1024 | 40 px | 24 px | 12 | 944 px |
| 1280 | 48 px | 32 px | 12 | 1184 px |
| 1440 | 64 px | 32 px | 12 | 1312 px |

Échelle d'espacement (base 4 px) : `4, 8, 12, 16, 24, 32, 48, 64, 96, 128` ; pas de valeurs hors échelle. Rythme vertical : 64/96 px mobile, 96/128 px desktop ; 24/32 px titre-contenu. Sous 768 px, la grille reste 12 colonnes mais les blocs s'alignent sur 4 colonnes logiques (multiples de 3).

Largeurs : pleine 1312 px ; prose 8 col / 68 ch ≈ 720 px ; formulaire 6 col / 640 px ; étroit 4 col / 480 px. Hero : contenu sur 8 col, preuve sur 4 col.

Filets : **1 px uniquement**. `--border` (`#E2E5E9` / `#232830`) pour séparateurs de sections, lignes de tableau et encadrés ; `--border-strong` (`#6B7480`) pour champs et limites interactives ; `--accent` 1 px pour l'onglet/étape active ; 2 px d'accent tolérés pour la barre de progression seulement. Aucun filet vertical décoratif, sauf séparateurs de colonnes de tableau sur desktop.

## 4. Composants

- **Skip link** — « Aller au contenu », hors écran, visible au focus, 44 px, cible `#main`.
- **Header / nav** — logo, 4 liens, CTA devis ; 80 px desktop / 64 px mobile, filet bas 1 px, pas de blur. Lien courant : filet bas 1 px accent + libellé accent + `aria-current="page"`. `<header><nav aria-label="Principale">`.
- **Menu mobile** — bouton 44×44 `aria-expanded` / `aria-controls`, panneau plein écran, fond `inert`, focus piégé, `Esc` ferme et rend le focus au bouton. Pas de drawer animé en transform lourd.
- **Lien** — texte + soulignement 1 px ; hover accent-700 ; focus = anneau ; lien externe avec `rel="noopener"` et mention visuelle/lecteur d'écran.
- **Bouton** — primaire (accent plein, texte `--on-accent`), secondaire (bordure 1 px, fond transparent), ghost (texte seul, filet au hover). Tailles 32/40/48 px, cibles ≥ 44 px sur mobile. États : hover, active, disabled (`aria-disabled`), loading (`aria-busy`, libellé conservé), focus 2 px accent + offset 2 px. Jamais d'ombre.
- **Champs (input, textarea, select)** — label visible, `*` + `aria-required`, aide en small, bordure 1 px `--border-strong`, hauteur 44 px, `autocomplete` explicite ; textarea redimensionnable verticalement ; select natif stylé (ou Radix), chevron 16 px. Focus : bordure 2 px accent, pas de glow ; erreur : bordure erreur + message lié.
- **Checkbox / radio** — carré 18 px, angles 0, `fieldset`/`legend` pour les groupes ; clic sur le label ; espace coche ; erreur de groupe annoncée une fois.
- **Message d'erreur** — texte small erreur, icône 16 px, `id` référencé par `aria-describedby` ; résumé en tête de formulaire `role="alert"` au submit ; une erreur inline en `aria-live="polite"`.
- **Filtres & pagination** — chips bordure 1 px, hauteur 36 px (44 px mobile), `aria-pressed`, actif = fond accent doux + filet accent ; compteur et « Tout » ; résultats annoncés en `aria-live="polite"` ; état vide avec réinitialisation ; pagination seulement au-delà de 12 éléments.
- **Carte** — service : numéro, titre, description, lien ; réalisation : capture 4:3 avec filet 1 px, titre, client/année, résultat chiffré `[À COMPLÉTER]`, expertise ; résultat : libellé, chiffre, contexte. Toute la carte est cliquable via un seul lien, focus visible sur la carte.
- **Filet / section header** — numéro caption, H2, filet 1 px, éventuel lien « tout voir » aligné à droite ; pas de centrage.
- **Table de devis** — `<table>` avec `<caption>` (lecteur d'écran), en-têtes `scope="col"`, chiffres à droite et tabulaires, lignes séparées 1 px, total en bas avec filet 1 px en couleur forte. Mobile : cartes empilées avec libellé/valeur.
- **Stepper / progress** — 5 étapes nommées, `role="progressbar"` avec `aria-valuenow`/`min`/`max`, étape courante `aria-current="step"` ; annonce du changement d'étape ; boutons Précédent/Continuer.
- **Callout d'hypothèses** — filet gauche 1 px accent ou attention, fond surface, titre H4, liste ; `role="note"` si informatif.
- **Footer** — 4 colonnes (marque, navigation, coordonnées, mentions), filet haut fort, liens secondaires, langue, année dynamique.
- **Bloc code / architecture** — fond surface, filet 1 px, `overflow-x: auto`, pas de coloration criarde ; schéma SVG inline, traits 1 px, une seule couleur d'accent pour le chemin principal, labels Plex Sans 12–14 px.
- **Download PDF** — bouton secondaire avec icône 18 px, mention du format et du poids (`PDF · [XX] Ko`), état loading, `aria-busy`, lien de secours si échec.

## 5. Tokens

| Famille | Tokens | Clair | Sombre |
|---------|--------|-------|--------|
| Fond | `--bg` / `--surface` | `#FFFFFF` / `#F7F8F9` | `#0B0D11` / `#12151A` |
| Texte | `--text` / `--text-secondary` / `--text-muted` | `#12151A` / `#4D5560` / `#6B7480` | `#EFF1F3` / `#9AA3AE` / `#8A929E` |
| Accent | `--accent` / `--accent-hover` / `--accent-subtle` / `--on-accent` / `--on-accent-subtle` | `#1F4FD8` / `#1A3FAF` / `#EEF3FF` / `#FFFFFF` / `#1A3FAF` | `#94B4FB` / `#C0D2FD` / `#101E45` / `#0B0D11` / `#C0D2FD` |
| Sémantique | `--success` / `--error` / `--warning` / `--info` (+ `-subtle`) | cf. §1 | cf. §1 |
| Bordures | `--border` / `--border-strong` / `--border-width` / `--radius` | `#E2E5E9` / `#6B7480` / `1px` / `0` | `#232830` / `#6B7480` / `1px` / `0` |
| Focus | `--focus` / `--focus-width` / `--focus-offset` | `#1F4FD8` / `2px` / `2px` | `#94B4FB` / `2px` / `2px` |
| Typo | `--font-display` / `--font-body` / `--font-mono` / tailles §2 | Archivo / IBM Plex Sans / système | idem |
| Espace | `--space-1…32` | 4 → 128 px | idem |
| Structure | `--container` / `--measure` / `--header-h` | `1312px` / `68ch` / `80px` | idem |
| Élévation | `--shadow` / `--scrim` | `none` / `rgb(11 13 17 / .48)` | `none` / `rgb(0 0 0 / .64)` |

Stratégie clair/sombre : `next-themes`, `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange` ; classe `.dark` sur `<html>`, `color-scheme: light dark`, script bloquant injecté par `next-themes` pour éviter tout flash, `suppressHydrationWarning`. Aucune couleur codée en dur dans les composants : uniquement les tokens. L'utilisateur peut basculer clair/sombre depuis le footer ou le header (bouton 44 px, `aria-pressed`).

## 6. Mouvement

Durées : `120 ms` (états), `160 ms` (panneaux), `240 ms` (progression). Easings : `cubic-bezier(.2,0,0,1)` à l'entrée, `cubic-bezier(.4,0,1,1)` à la sortie. Trois usages autorisés, pas un de plus : 1) couleur/bordure au survol et au focus (120 ms) ; 2) ouverture du menu mobile et des accordéons (opacité + translation 4 px, 160 ms) ; 3) remplissage de la barre de progression (240 ms). Aucun parallaxe, reveal au scroll, carrousel automatique, rebond.
`@media (prefers-reduced-motion: reduce)` : transitions et animations à `0.01 ms`, translation supprimée, `scroll-behavior: auto`, mise à jour de la progression instantanée.

## 7. Wireframes

**Accueil — desktop**
```
┌──────────────────────────────────────────────────────────────┐
│ TALOOM       Services  Réalisations  Conseil  À propos [Devis]│
├──────────────────────────────────────────────────────────────┤
│ H1 Promesse (8 col)                  │ Preuve chiffrée (4 col)│
│ Sous-titre (6 col) [Devis] [Contact] │ [À COMPLÉTER]          │
├──────────────────────────────────────────────────────────────┤
│ 01 EXPERTISES — Dév. | Cloud | Gestion | IA | Conseil         │
├──────────────────────────────────────────────────────────────┤
│ 02 RÉALISATIONS — 3 cartes : capture 4:3 + titre + résultat  │
├──────────────────────────────────────────────────────────────┤
│ 03 MÉTHODE — 4 étapes : Cadrage | Conception | Réal. | Suivi │
├──────────────────────────────────────────────────────────────┤
│ CTA : [Devis] | [Contact]                                    │
└──────────────────────────────────────────────────────────────┘
```
**Accueil — mobile (360)** : header logo + `[Menu]` ; H1 ; CTA empilés ; preuve ; 5 expertises en liste ; 3 cartes empilées ; méthode en 4 blocs ; CTA ; footer en accordéon.
**Services**
```
H1 + intro (8 col)
┌──────────┬────────────────────────────────────────────────┐
│ Sommaire │ 01 Développement — à qui · livrables · stack    │
│ sticky   │ 02 Cloud & DevOps                             │
│ 3 col    │ 03 Gestion de projet                          │
│          │ 04 IA · 05 Conseil & audit                    │
└──────────┴────────────────────────────────────────────────┘
```
**Réalisations — liste filtrable**
```
H1 + intro
Filtres : [Toutes N] [Développement] [Cloud] [Gestion] [IA] [Conseil]
« N réalisations » (aria-live)                       [réinitialiser]
┌────────────────────────┬────────────────────────┐
│ capture 4:3            │ capture 4:3            │
│ Titre · Client · année │ Titre · Client · année │
│ Résultat [À COMPLÉTER] │ Résultat [À COMPLÉTER] │
└────────────────────────┴────────────────────────┘
Mobile 1 col · vide : « Aucune réalisation » + réinitialiser.
```
**Étude de cas**
```
Fil d'Ariane
H1 + résumé (8 col)          │ Client · Année · Rôle (4 col)
[capture pleine largeur, filet 1 px]
┌────────────────────────────┬────────────────────────┐
│ Contexte / Problème        │ Stack                  │
│ Solution + schéma          │ Résultats [À COMPLÉTER] │
│ Résultats / Apprentissages │ Liens                  │
└────────────────────────────┴────────────────────────┘
[Projet suivant]  [Retour aux réalisations]
```
**Estimateur — étape 2**
```
H1 Estimer un projet                    Étape 2 / 5
████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  progressbar
┌───────────────────────────────────┬──────────────────┐
│ Périmètre : [ ] Pages [ ] Auth.   │ Récapitulatif    │
│ [ ] Paiement [ ] Back-office      │ Type · Choix     │
│ [ ] Intégrations · précisions     │ [Modifier]       │
│ (i) Hypothèse [À COMPLÉTER]       │ Brouillon sauv.  │
│ [Précédent]            [Continuer]│                  │
└───────────────────────────────────┴──────────────────┘
```
**Estimateur — résultat**
```
H1 Votre estimation
[min] — [estimé] — [max] HT · [X] j · [X] sem.
Tableau Désignation | Jours | Prix HT + totaux HT/TVA/TTC
Hypothèses · Exclusions
[Télécharger le PDF] [Parler à un conseiller]
Estimation indicative non contractuelle ; devis définitif après cadrage.
```
**Conseil — question / résultat**
```
Étape 1 / 5  ████░░░░░░░░
H1 Nature du projet ? ( ) Site ( ) Appli ( ) API ( ) Autre
(i) Pourquoi cette question ?  [Précédent] [Continuer]

Résultat : H1 Approche recommandée + résumé
Stack indicative | Durée | Risques · réponses (accordéon)
[Modifier] [Transformer en estimation]
```
**Contact**
```
H1 Contact
┌──────────────────────────────┬─────────────────────────┐
│ Nom* · E-mail* · Société     │ E-mail [À COMPLÉTER]    │
│ Type de projet · Message*    │ Tél. / Ville            │
│ [x] RGPD* · honeypot caché   │ LinkedIn                │
│ [Envoyer]                    │ Délai de réponse        │
└──────────────────────────────┴─────────────────────────┘
Succès : aria-live + résumé + retour.
```

## 8. Règles « très carré »

**DO** — angles à `0` partout (cartes, champs, boutons, images) ; filets 1 px ; blanc/`#F7F8F9` dominant ; sections alignées sur la grille ; titres à gauche ; captures réelles cadrées, filet 1 px, légende ; schémas SVG 1 px avec un seul chemin accentué ; icônes **Lucide** (`stroke-width: 1.5`, tailles 16/20/24, `currentColor`, `aria-hidden` si décoratives) ; chiffres tabulaires ; un seul bloc accent par écran, hors liens et focus.
**DON'T** — aucun `border-radius` décoratif, aucune ombre portée, aucun dégradé (a fortiori violet), aucune illustration générique ni photo de banque d'images, aucun emoji, aucun glassmorphism, aucune icône colorée ou remplie, pas de texte centré en prose, pas de section plus dense qu'une autre sans raison, pas d'animation au scroll, pas de bordure épaisse (2 px réservé à la progression), pas de titre en majuscules au-delà de 3 mots.

## 9. Accessibilité

- Focus : anneau `2 px` accent + offset `2 px`, visible sur fond clair, sombre et images ; jamais `outline: none` sans remplacement.
- Ordre de tabulation = ordre visuel ; skip link en premier ; menu mobile focus piégé, `Esc`, restitution du focus ; `inert` sur l'arrière-plan.
- Formulaires : label visible, `aria-invalid`, `aria-describedby`, résumé d'erreurs `role="alert"` au submit, erreurs inline `aria-live="polite"`, jamais de placeholder comme seul label.
- Cibles tactiles ≥ 44×44 px, espacement ≥ 8 px ; liens de texte avec zone cliquable suffisante.
- Contrastes AA : 4,5:1 texte normal, 3:1 grand texte et composants ; tableau §1 comme référence.
- `prefers-reduced-motion` respecté ; pas de clignotement ; pas d'information portée par la couleur seule.
- Landmarks `header`, `nav`, `main`, `footer` ; un seul `h1` par page ; hiérarchie de titres continue ; `lang="fr"`.
- Images : `alt` descriptif pour les captures, vide si décoratives ; schémas avec `<title>`/`<desc>`.
- Progression : `aria-valuenow`, annonce d'étape, bouton de retour toujours disponible ; sauvegarde du brouillon annoncée.
- PDF : lien explicite, format et poids annoncés, alternative HTML du récapitulatif.

## 10. Points à valider par le client

1. **Logo** : version SVG monochrome (positive/négative), marque carrée, favicon 32 px, zone de protection.
2. **Couleur** : validation du bleu encre `#1F4FD8` ; sinon choix entre vert `#1F6B4F` et ocre `#A6431E` (échelles à produire).
3. **Captures projets** : disponibilité, droits, résolution ≥ 1600 px, données clients à masquer ; Gestilok en priorité.
4. **Chiffres et résultats** : tous les `[À COMPLÉTER]` (utilisateurs, délais, gains) doivent être fournis et sourcés ; aucun chiffre ne sera inventé.
5. **Ton visuel** : acceptation d'une page très sobre, sans photo d'équipe ni illustration ; place éventuelle d'un portrait du fondateur.
6. **Typographie** : validation d'Archivo + IBM Plex Sans ; repli Space Grotesk + Inter si rejet.
7. **Thème** : clair par défaut ou préférence système ? Le sombre est-il visible dans le header ou seulement le footer ?
8. **Tarifs** : affichage public des fourchettes de l'estimateur, TVA et mentions légales `[À COMPLÉTER]`.
