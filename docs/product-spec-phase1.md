# Talum — Spécification produit, Phase 1

Contexte lu : `context/project.md`. Stack, ton et périmètre confirmés. Aucun tarif, résultat, certification ni identifiant légal n'est inventé : tout chiffre métier est balisé `[À COMPLÉTER]` ou `[EXEMPLE]`.

**Points pour l'Orchestrateur**
- Le brief demande « 3 réalisations phares avec résultat chiffré », mais un seul projet est fourni (Gestilok). Repli proposé : 1 étude de cas complète + 2 emplacements balisés, jamais de chiffre inventé. Le chiffre de preuve en accueil dépend de ce point.
- Statut juridique, TVA, TJM et coordonnées manquants bloquent l'estimateur et le PDF (mentions obligatoires, totaux).
- L'assistant Conseil et l'Estimateur doivent rester visuellement et lexicalement distincts : l'un conseille une approche, l'autre chiffre. Aucun prix dans le Conseil.

## 1. Proposition de valeur

- **A (recommandée)** — « Talum conçoit, développe et maintient les solutions numériques des TPE/PME, startups, écoles et associations, avec un interlocuteur unique du cadrage au suivi. »
- **B** — « Talum accompagne les organisations qui ont un projet numérique — cadrage, développement, cloud, IA, conseil — pour livrer une solution utile et maintenable. »
- **C** — « Un projet numérique mérite un interlocuteur qui comprend le métier et livre : Talum cadre, construit et suit votre solution, sans jargon et sans intermédiaire. »

A dit quoi, pour qui, et ce qui rassure (continuité, interlocuteur unique). B est plus générique. C est plus engagée mais frôle la promesse commerciale.

**Sous-titre** : « Développement web et applicatif, cloud & DevOps, gestion de projet, IA et conseil. Lille et Abidjan, interventions en France et à distance. »

## 2. Architecture d'information

**Navigation principale (5 entrées)** : Services · Réalisations · Conseil · Estimateur · À propos. CTA fixe dans l'en-tête : « Parler de mon projet » → Contact. Le lien actif est signalé, le focus clavier visible, le menu mobile reprend le même ordre.

**Pied de page** : Talum (À propos, Réalisations, Contact) · Offres (les 5 services) · Outils (Conseil, Estimateur) · Légal (Mentions légales, Confidentialité, Cookies) · coordonnées, LinkedIn, mention « Estimation indicative non contractuelle ».

**Parcours A — visiteur froid venu de LinkedIn**
1. Accueil — hero et preuve → CTA « Voir une réalisation ».
2. Étude de cas Gestilok — contexte, résultats, méthode → CTA « Voir les services concernés ».
3. Services — livrables et pour qui → CTA « Estimer mon projet ».
4. Estimateur — 5 étapes → CTA « Recevoir mon estimation PDF ».
5. Contact — CTA « Envoyer ma demande ».

**Parcours B — PME qui cherche un devis**
1. Accueil — hero + double chemin → CTA « Estimer mon projet ».
2. Estimateur, étape 1 (type) → CTA « Continuer ».
3. Estimateur, étapes 2–3 (périmètre, contraintes) → CTA « Continuer ».
4. Estimateur, étape 4 (coordonnées + consentement) → CTA « Voir mon estimation ».
5. Résultat — fourchette, durée, hypothèses → CTA « Télécharger le PDF », puis « Parler de mon projet ».

**Parcours C — école ou association qui cherche un partenariat**
1. Accueil — preuve et méthode → CTA « Découvrir Talum ».
2. À propos — parcours, valeurs, zones d'intervention → CTA « Voir nos services ».
3. Services — Gestion de projet ou Conseil → CTA « Être conseillé ».
4. Conseil — 5 questions → CTA « Affiner avec un humain ».
5. Contact — motif « Partenariat / école » → CTA « Envoyer ma demande ».

## 3. Spécification page par page

### Métadonnées et données structurées

| Page | Title (≤ 60) | Description (≤ 155) | JSON-LD |
|---|---|---|---|
| Accueil | Talum — Développement, cloud et IA pour vos projets (51) | Talum conçoit, développe et maintient vos solutions numériques : web, API, cloud, IA et conseil. Un interlocuteur unique, du cadrage au suivi. (144) | Organization, WebSite |
| Services | Services — Développement, cloud, IA et conseil \| Talum (54) | Cinq expertises pour votre projet numérique : développement web et applicatif, cloud & DevOps, gestion de projet, IA et conseil technique. (136) | Service (×5), BreadcrumbList |
| Réalisations | Réalisations et études de cas \| Talum (39) | Des projets réels, leur contexte, les choix techniques et les résultats. Découvrez les réalisations de Talum, dont Gestilok, SaaS de gestion locative. (150) | CollectionPage, ItemList |
| Étude de cas | Gestilok — SaaS de gestion locative \| Talum (45) | Étude de cas Gestilok : contexte, problème, solution technique, résultats et apprentissages d'un SaaS de gestion locative mis en production. (137) | CreativeWork, BreadcrumbList |
| Conseil | Conseil — quelle approche pour votre projet ? \| Talum (54) | Cinq questions pour obtenir une approche adaptée : méthode, stack indicative, durée et risques à surveiller. Sans engagement, sans jargon. (138) | WebPage, BreadcrumbList |
| Estimateur | Estimateur de devis — fourchette et PDF \| Talum (49) | Décrivez votre projet en 5 étapes et obtenez une fourchette de prix, une durée indicative et un PDF récapitulatif. Estimation non contractuelle. (145) | WebPage, BreadcrumbList (aucun Offer) |
| À propos | À propos — Armel BOUGMA, Talum (31) | Le parcours, les valeurs et la méthode de travail de Talum, société de services informatiques fondée par Armel BOUGMA, à Lille et Abidjan. (139) | AboutPage, Person, Organization |
| Contact | Contact — parler de votre projet \| Talum (40) | Décrivez votre projet en quelques lignes. Réponse sous [À COMPLÉTER]. Talum intervient à Lille, en France et à distance. (127) | ContactPage, Organization |
| Mentions légales | Mentions légales \| Talum (24) | Éditeur, hébergeur, propriété intellectuelle et informations légales du site Talum. [À COMPLÉTER : statut, SIRET, TVA]. (120) | WebPage |
| Confidentialité | Confidentialité et cookies \| Talum (32) | Données collectées, finalités, durées de conservation, droits RGPD et gestion des cookies sur le site Talum. Aucun traceur sans consentement. (137) | WebPage |

Pas de `aggregateRating`, pas d'`Offer` avec prix, pas d'avis inventés. Le title et la description de Contact sont à finaliser avant mise en ligne (placeholder).

### Accueil
Objectif : comprendre en 10 secondes quoi, pour qui, avec quelle preuve.
1. Hero — msg : promesse, sous-titre, 2 CTA (« Estimer mon projet » / « Voir les réalisations »).
2. Preuves — msg : « des projets réels, pas des promesses » ; 3 faits vérifiés ou balisés.
3. 5 expertises — msg : « un besoin, une expertise identifiée » ; 1 ligne par service, lien vers l'ancre.
4. 3 réalisations phares — msg : « voici ce que ça produit » ; résultat mesuré daté, sinon mention « non mesuré ».
5. Méthode en 4 étapes — msg : « vous savez comment ça se passe ».
6. Double chemin — msg : « je sais ce que je veux » → Estimateur ; « je ne sais pas encore » → Conseil.
7. Contact court — msg : « parlons de votre projet ».
CTA : Estimer mon projet (principal), Parler de mon projet (secondaire).
[À COMPLÉTER] : faits de preuve, 2e et 3e réalisations, captures, logo, délai de réponse.

### Services
Objectif : montrer le périmètre exact de chaque expertise et filtrer les demandes.
1. Intro — msg : « à qui s'adresse ce que je fais ».
2. Sommaire ancré des 5 expertises : Développement · Cloud & DevOps · Gestion de projet · IA · Conseil.
3. Une section par expertise — msg : livrables concrets, technologies réellement maîtrisées, profil de client, durée indicative.
4. FAQ courte (3–5 questions) — msg : lever les doutes sur le déroulé et le budget.
5. CTA final — msg : « estimer cette prestation » (préremplit le type dans l'estimateur).
[À COMPLÉTER] : livrables exacts par service, technos maîtrisées, durées indicatives, FAQ.

### Réalisations (liste)
Objectif : prouver la capacité à livrer, filtrer par expertise.
1. Intro — msg : « des projets livrés, avec leur contexte ».
2. Filtres par expertise (accessibles, état vide explicite).
3. Cartes — msg : titre, client ou « Confidentiel », année, résultat clé ou « non mesuré », tags.
4. CTA — msg : « un projet similaire ? » → Contact.
[À COMPLÉTER] : autres projets, autorisations clients, captures, résultats mesurés.

### Étude de cas
Objectif : donner assez de détail pour qu'un décideur technique ou métier ait confiance.
1. En-tête — msg : client, année, rôle, durée, statut, stack.
2. Contexte — msg : la situation de départ.
3. Problème — msg : le coût du problème, en termes métier.
4. Solution — msg : les choix et les arbitrages.
5. Stack et schéma — msg : ce qui tourne réellement.
6. Résultats — msg : effet mesuré, période et méthode ; sinon « non mesuré ».
7. Apprentissages — msg : ce que le projet a changé dans la pratique.
8. Projet suivant + CTA — msg : « votre cas est peut-être proche ».
[À COMPLÉTER] : captures sans données personnelles, métriques et période, autorisation écrite du client.

**Contenu de départ Gestilok** : SaaS de gestion locative, PHP/Laravel, JavaScript, VPS, CI/CD, utilisateurs réels. Chaque affirmation (résultat, volume d'utilisateurs) doit être mesurée ou reformulée en qualitatif ; aucune capture sans anonymisation.

### Conseil
Objectif : aider un visiteur indécis à choisir une approche, sans le transformer en devis.
1. Intro — msg : « quelques minutes pour clarifier votre approche » + ce que l'outil ne fait pas (pas un devis, pas un audit).
2. Assistant 5 questions, une par écran, progression et retour possibles.
3. Résultat — msg : approche, stack indicative, durée en semaines, risques, prochaine étape.
4. Garde-fou — msg : « recommandation indicative, à valider en cadrage ».
CTA : Affiner avec un humain (Contact), Chiffrer mon projet (Estimateur).
[À COMPLÉTER] : règles validées, formulation de marque, exemple de résultat.

### Estimateur
Objectif : produire une fourchette crédible et capter une demande qualifiée avec consentement.
1. Intro — msg : « quelques minutes, estimation indicative, aucune donnée revendue ».
2. Étapes 1 à 3 — msg : décrire le besoin sans jargon technique.
3. Étape 4 — msg : recevoir le PDF, consentement explicite.
4. Résultat — msg : fourchette, durée, répartition, hypothèses, exclusions.
5. PDF + CTA — msg : « un devis définitif s'établit après cadrage ».
[À COMPLÉTER] : TJM, charges, coefficients, régime de TVA, conditions de paiement, validité.

### À propos
Objectif : incarner Talum et rassurer sur la méthode.
1. Récit court — msg : qui, où, pourquoi.
2. Valeurs (3) — msg : ce qui guide les décisions.
3. Méthode — msg : comment se déroule une mission.
4. Zones et modalités — msg : Lille, Abidjan, France, distance.
5. Certifications et formations — msg : preuves vérifiables ; rien si non vérifié.
CTA : Parler de mon projet.
[À COMPLÉTER] : parcours, certifications, photo, années d'expérience, langues.

### Contact
Objectif : recevoir une demande qualifiée et rassurer sur le traitement.
1. Intro — msg : « décrivez votre besoin, je réponds ».
2. Formulaire — champs nom, e-mail, société, type de projet, message, consentement ; honeypot invisible ; erreurs annoncées.
3. Coordonnées directes — e-mail, téléphone si publié, ville, LinkedIn.
4. Engagement — msg : délai de réponse, usage des données, lien Confidentialité.
5. Confirmation — msg : « demande reçue », e-mail de confirmation.
[À COMPLÉTER] : e-mail, téléphone, adresse, délai de réponse, horaires.

### Mentions légales, Confidentialité, Cookies
- Mentions : éditeur (statut, SIRET, TVA, adresse), directeur de publication, hébergeur, propriété intellectuelle, crédits. [À COMPLÉTER].
- Confidentialité : données, finalités, bases légales, durées, destinataires, sous-traitants, transferts, droits, contact. [À COMPLÉTER].
- Cookies : aucun traceur non essentiel en v1 ; si un outil de mesure est ajouté, bandeau avec refus aussi simple que l'acceptation, et page mise à jour.

## 4. Inventaire de contenu éditorial

**Services — champs obligatoires** : slug ; nom ; promesse (1 phrase, ≤ 90 car.) ; description (120–200 mots) ; livrables (3–7) ; pour qui (2–4) ; technologies (3–8) ; type de prestation lié à l'estimateur ; title et description SEO ; ordre d'affichage. **Optionnels** : cas liés, FAQ (3–5), durée indicative.
*Exemple neutre* : promesse « [EXEMPLE] Des applications web métier qui remplacent vos tableurs. »

**Réalisations — champs obligatoires** : slug ; titre ; client (nom ou « Confidentiel ») ; secteur ; année ; rôle ; durée ; expertises (1–3) ; contexte (80–150 mots) ; problème (60–120) ; solution (100–200) ; stack (3–8) ; résultats (1–3 : indicateur, valeur, période, méthode) ; apprentissages (2–4) ; captures (1–3, texte alternatif) ; autorisation client (booléen bloquant) ; statut (livré / en production / en cours) ; SEO. **Optionnels** : témoignage, lien public, schéma d'architecture.
*Exemple neutre* : « [EXEMPLE] Temps de traitement d'une demande : [valeur avant] → [valeur après], mesuré sur [période], méthode [source]. »

**Règles de rédaction** : phrases ≤ 20 mots ; un message par paragraphe ; pas de superlatif (« révolutionnaire », « leader », « unique ») ; pas d'emoji ; français d'abord, anglais ensuite ; un chiffre n'est publié que s'il est mesuré, daté et attribuable à une méthode — sinon qualitatif + « non mesuré » ; confidentialité : accord écrit, client anonymisé si besoin (« un client du secteur [X] »), aucune capture avec données personnelles ; ne citer que des technologies réellement utilisées ; toute affirmation légale ou certification est validée par le client.

## 5. Assistant Conseil

| # | Question | Options | Type |
|---|---|---|---|
| 1 | Quel type de projet avez-vous ? | Site ou application web · Application métier · API ou backend · Cloud & DevOps · IA ou automatisation · Audit ou conseil · Je ne sais pas encore | Choix unique |
| 2 | Quel est l'objectif principal ? | Trouver des clients · Automatiser des tâches · Fiabiliser l'existant · Lancer un produit · Former les équipes · Obtenir un avis technique | Choix unique |
| 3 | Où en êtes-vous ? | Idée · Besoin cadré · Maquettes prêtes · Développement en cours · En production | Choix unique |
| 4 | Quelles contraintes pèsent le plus ? | Délai court · Budget limité · Sécurité et RGPD · Intégration à l'existant · Accessibilité · Aucune contrainte majeure | Choix multiple, 2 max |
| 5 | Quel budget avez-vous en tête ? | Moins de 5 k€ · 5–15 k€ · 15–40 k€ · 40–80 k€ · Plus de 80 k€ · Je ne sais pas | Choix unique |

Tranches de budget `[EXEMPLE]`, à recalibrer sur les TJM et le panier moyen réels avant mise en ligne.

**Forme d'une règle** : une combinaison de réponses (type, objectif, stade, contraintes, budget) produit une approche (2–3 phrases), une stack indicative (2–5 items), une durée en semaines (min–max), 1–3 risques et une prochaine étape. Les règles sont ordonnées par priorité, stockées dans un fichier de configuration versionné, sans appel LLM. La première règle qui correspond s'applique ; des indicateurs de risque peuvent ajouter 1–2 risques sans changer l'approche. Aucune règle trouvée → recommandation générique de cadrage, jamais un écran vide.

| Condition (exemple) | Approche | Stack indicative | Durée | Risques |
|---|---|---|---|---|
| Site vitrine + trouver des clients + idée | Site éditorial 5–8 pages, SEO local, mesure sans cookie | Next.js, MDX, Vercel | 3–5 sem. | Contenu non fourni ; SEO surestimé |
| Application métier + automatiser + intégration | Cadrage court puis MVP par lots, flux prioritaires | Next.js, PostgreSQL, API REST | 10–16 sem. | Périmètre qui dérive ; données existantes de mauvaise qualité |
| IA ou automatisation + données existantes + sécurité | POC mesuré (qualité, coût) avant industrialisation | Python ou TypeScript, pgvector, API LLM | 6–10 sem. | Données insuffisantes ; attentes irréalistes |
| Cloud & DevOps + fiabiliser + en production | Audit, CI/CD, supervision, sauvegardes testées | Docker, GitHub Actions, cloud à définir | 3–6 sem. | Fenêtre de maintenance ; secrets mal gérés |
| Budget < 5 k€ + périmètre large | Recadrage sur un lot unique ou diagnostic, sinon report | Selon le lot retenu | 2–4 sem. | Solution incomplète ; dette technique |

Durées `[EXEMPLE]`, à valider par le client.

**Cas limites** : réponses contradictoires (budget faible + périmètre large) → afficher la tension, proposer un lot réduit ou un diagnostic, ne jamais bloquer ; budget trop faible → ne pas refuser, proposer un périmètre minimal ou du conseil ; périmètre flou → recommander un cadrage court et renvoyer vers Contact ; « je ne sais pas » partout → parcours de découverte générique ; délai court + sécurité renforcée → signaler le risque et proposer une livraison par phases.

**Critères d'acceptation** : 1) mêmes réponses → même recommandation, résultat identique après retour arrière ; 2) tout parcours, y compris sans règle correspondante, produit approche, stack, durée et risques non vides ; 3) le cas budget faible + périmètre large affiche une alerte et une alternative sans bloquer ; 4) aucun montant en euros ni formulation de devis dans le résultat ; 5) le parcours est utilisable au clavier, les réponses sont conservées au retour, et le résultat est annoncé aux lecteurs d'écran.

## 6. Estimateur de devis

| Étape | Champs | Validation |
|---|---|---|
| 1. Type | Type de prestation (6 options + « Je ne sais pas ») | Requis ; « Je ne sais pas » oriente vers Conseil |
| 2. Périmètre | Champs guidés selon le type (voir ci-dessous) | Requis : au moins 3 réponses, dont le champ principal |
| 3. Complexité | Délai (souple / 6–8 sem. / < 4 sem.) ; sécurité-RGPD (standard / renforcée) ; existant (aucun / reprise / API) ; hébergement (à définir / fourni / à recommander) ; maintenance (oui / non) ; finition (standard / élevée) ; accessibilité (non / AA) | Requis ; bornes numériques |
| 4. Coordonnées | Nom, e-mail, société (opt.), téléphone (opt.), consentement, honeypot | E-mail valide ; consentement = vrai ; honeypot vide |
| 5. Résultat | Aucun champ | Calcul serveur uniquement |

**Périmètre guidé** : Web/app — pages (1–50), authentification, paiement, back-office, intégrations, contenu fourni ou non. API/backend — endpoints (1–50), authentification, base de données, documentation, intégrations. Cloud/DevOps — environnements (1–3), CI/CD, supervision, sauvegardes, migration. Gestion de projet — durée, nombre d'équipes (1–5), rituels, outillage. IA — cas (chatbot / RAG / agent / automatisation), données disponibles, volume, évaluation, hébergement. Conseil/audit — périmètre, durée en jours, restitution.

**Règles de validation** : validation client et serveur avec le même schéma ; erreurs explicites, annoncées et liées au champ ; longueurs maximales sur les textes ; limite de débit sur la soumission ; vérification d'origine/CSRF ; aucun prix calculé côté client ; aucune donnée personnelle dans les journaux.

**Brouillon** : sauvegarde locale des étapes 1 à 3 uniquement (jamais les coordonnées), sur action « Continuer » ; clé versionnée ; expiration à 30 jours ; bannière « Reprendre / Recommencer » ; bouton « Réinitialiser » avec confirmation ; purge après génération du PDF ; version de schéma différente → brouillon ignoré.

**Contenu obligatoire du PDF** : logo et identité légale ; coordonnées ; date et numéro d'estimation ; rappel du besoin ; tableau des postes (désignation, jours, prix unitaire HT, total HT) ; totaux HT, TVA selon régime, TTC ; fourchette min / estimé / max ; durée en semaines ; hypothèses ; exclusions ; conditions de paiement ; durée de validité ; mention « Estimation indicative non contractuelle, un devis définitif est établi après cadrage ».

**Critères d'acceptation** : 1) mêmes réponses → même fourchette, moteur pur et testé ; 2) minimum < estimé < maximum, avec l'écart correspondant à la marge configurée ; 3) TVA correcte selon le régime, ou mention 293 B si non applicable ; 4) sans consentement, aucun envoi, aucun e-mail, message explicite ; 5) le PDF contient les blocs obligatoires et la mention non contractuelle ; 6) brouillon repris après rechargement et réinitialisation confirmée ; 7) double clic ou rejeu ne crée pas deux estimations ; 8) aucun prix ni donnée personnelle dans l'URL ou les journaux.

| Donnée | Finalité | Base légale | Conservation |
|---|---|---|---|
| Nom, e-mail, société, téléphone | Produire et envoyer l'estimation, recontacter | Consentement | [À COMPLÉTER] — recommandation : 12 mois après le dernier contact |
| Contenu du besoin et résultat | Justifier la fourchette, préparer le cadrage | Consentement | Idem demande |
| Preuve de consentement (date, version) | Démontrer la conformité | Consentement (preuve) | Durée de la demande + [À COMPLÉTER] |
| Adresse IP tronquée | Limitation de débit et sécurité | Intérêt légitime | 30 jours maximum [À COMPLÉTER] |
| PDF généré | Téléchargement | Consentement | Non stocké côté serveur |

## 7. Indicateurs de succès

| Indicateur | Définition | Mesure |
|---|---|---|
| Démarrage estimateur | Étapes 1 commencées / visites de la page | Compteur serveur agrégé, sans cookie |
| Complétion estimateur | Résultats obtenus / démarrages | Même compteur |
| Téléchargements PDF | PDF générés / résultats | Journal serveur agrégé |
| Consentement | Consentements / étapes 4 atteintes | Champ booléen, sans identifiant |
| Contacts qualifiés | Demandes avec type de projet + budget + consentement / demandes totales | Formulaire |
| Complétion Conseil | Résultats / démarrages | Compteur serveur |
| Passerelle Conseil → Contact | Contacts précédés d'un résultat Conseil / résultats | Événement de session, sans cookie |
| Source | UTM conservés en session uniquement, agrégés par canal | Premier partie, pas de tiers |

Mesure sans tracking non consenti : compteurs agrégés côté serveur, aucun cookie publicitaire, aucun empreinte, aucun outil tiers par défaut ; adresse IP tronquée et non conservée au-delà de la limitation de débit ; UTM en mémoire de session ; respect de Do Not Track ; export mensuel agrégé. Si un outil d'analyse est ajouté, il est auto-hébergé, sans cookie, et soumis au bandeau. Cibles chiffrées : `[À DÉFINIR]` avec le client après 4 semaines de données.

## 8. Hypothèses produit et risques

| Risque | Impact | Mitigation |
|---|---|---|
| Tarifs non publics | Fourchette peu crédible ou perçue comme un devis | Fourchette large assumée, mention non contractuelle, moteur configurable |
| Portfolio incomplet (Gestilok seul) | Preuve insuffisante en accueil | 1 étude de cas solide + emplacements balisés, aucun faux projet |
| Résultats non mesurés | Promesse non démontrable | Qualitatif explicite + « non mesuré », jamais de chiffre inventé |
| Assistant perçu comme un devis | Déception, contacts déqualifiés | Aucun prix, disclaimer, CTA « chiffrer » séparé |
| Fausse précision du moteur | Perte de confiance | Fourchette, hypothèses et exclusions affichées, justification par règle |
| Statut/TVA inconnus | PDF non conforme, totaux faux | Blocage de la mise en ligne du PDF tant que non fourni |
| Ton de marque non validé | Incohérence éditoriale | Charte de ton courte validée avant rédaction |
| Trafic faible au lancement | Indicateurs non significatifs | Mesure à 4 semaines, pas de conclusion hâtive |

## 9. Questions qui appartiennent au client et bloquent la suite

- **Identité** : statut juridique, SIRET, adresse, directeur de publication, régime et mention de TVA.
- **Contacts** : e-mail public, téléphone, adresse, LinkedIn, domaine et adresse d'envoi (Resend).
- **Économie** : TJM par prestation, charges de base, coefficients de complexité et d'urgence, marge de risque, forfaits, conditions de paiement, validité de l'estimation, tranches de budget de l'assistant.
- **Preuves** : autorisations clients, captures, métriques et périodes, certifications et formations, années d'expérience, photo.
- **Marque** : logo, nom définitif, ton, exemples de phrases appréciées ou rejetées, choix français/anglais.
- **Juridique** : durées de conservation, sous-traitants, transferts hors UE, politique cookies, contact pour les droits RGPD.

**Prochaine étape** : Architect Agent — modèle de contenu typé, découpage des routes, stratégie de rendu et de génération PDF, à partir de cette spécification.
