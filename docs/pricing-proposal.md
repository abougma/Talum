# Grille tarifaire — proposition à valider

> **Statut : `[PROPOSITION]` — implémentée dans `src/lib/pricing/config.ts`**
>
> Cette grille est publiée en **HT uniquement**, à titre indicatif et non
> contractuel. Elle n’a pas été validée par le client. Les montants, jours et
> coefficients peuvent être corrigés, remplacés ou refusés.
>
> La société n’étant pas encore créée, le régime de TVA reste `null` : le moteur
> renvoie `status: "ready-ht"`. Le HT et la fourchette HT sont affichés ; la TVA,
> le TTC, le devis PDF et les mentions légales restent désactivés.

## 1. Objet

Cette proposition répond à deux besoins :

1. donner des ordres de grandeur **cohérents avec le marché français 2026** ;
2. traiter l’**IA comme une ligne de service à part entière**, et non comme une
   option gratuite du développement web.

Elle couvre les TJM, les charges de base, les options, les contraintes, les
frais forfaitaires, les coefficients, la marge de risque et la fourchette.

## 2. Statut d’implémentation

| Élément | État |
| --- | --- |
| Grille recopiée dans `src/lib/pricing/config.ts` | Oui, version `2026-11-08-proposition` |
| Affichage public | Oui, sur `/fr/estimate` et `/en/estimate` |
| Mode | `ready-ht` : HT et fourchette HT uniquement |
| TVA / TTC | Désactivés (`vat.regime: null`) |
| PDF / devis | Désactivés |
| Validation client | **Non — à faire** |

Aucun prix n’est écrit en dur dans un composant : la grille publique est lue
depuis la configuration typée, et les tests vérifient le comportement du moteur.

## 3. Références de marché utilisées

Les fourchettes ci-dessous sont des ordres de grandeur publics, pas des
engagements. Elles servent à positionner la proposition, pas à la justifier
contractuellement.

| Source | Donnée retenue |
| --- | --- |
| L’Expert-Comptable, calcul du TJM freelance informatique 2026 | 450–650 € HT/j pour un profil confirmé ; senior/expert 800–1 000 € ; experts IA générative > 950 €/j |
| Free-Work, TJM chef de projet informatique 2026 | Annonces autour de 550–750 €/j selon expérience et canal |
| OpenWork / RH Solutions, TJM chef de projet | 500–750 €/j en région, 600–900 €/j pour un senior |
| Reflekt Lab, prix d’un audit IA pour PME 2026 | Audit express 2 000–4 000 € HT ; audit complet 6 000–12 000 € HT ; premier cas d’usage en production à partir de 15 000 € HT |
| ADME AI Studio, automatisation IA PME 2026 | Pilote 3 000–5 000 € HT ; projet moyen 6 000–12 000 € HT ; projet ambitieux 15 000–30 000 € HT |
| Reflekt Lab / GrowthPerf, formation IA 2026 | 1 500–3 500 € HT/jour en intra-entreprise ; 2 500 € HT pour une journée appliquée |
| La Fabrique du Net, baromètre agents IA 2026 | Médiane de développement 10 000 € ; moitié des budgets entre 4 000 € et 25 000 € |

Sources :
- <https://www.l-expert-comptable.com/a/535027-comment-calculer-le-tjm-d-un-freelance-informatique.html>
- <https://www.free-work.com/fr/tech-it/chef-de-projet-informatique/rate-tjm-freelance>
- <https://www.openwork.fr/dossier/tjm-chef-de-projet>
- <https://reflektlab.ai/fr/blog/combien-coute-un-audit-ia>
- <https://adme-aistudio.com/automatisation-ia-pme-guide-2026>
- <https://reflektlab.ai/fr/solutions/formation-ia>
- <https://growthperf.com/blog/prix-formation-ia-entreprise-2026>
- <https://www.lafabriquedunet.fr/agences/pages/agences-intelligence-artificielle>

## 4. Positionnement retenu

La grille actuelle est une **grille de lancement « senior en direct »** :

- pas de couche agence ni de marge commerciale intermédiaire ;
- TJM dans le haut de la fourchette « confirmé » pour le web, afin de ne pas
  attirer une clientèle uniquement sur le prix ;
- l’IA est positionnée au-dessus du conseil classique, mais pas au niveau des
  experts en IA générative à plus de 950 €/j ;
- les coûts variables (tokens, API, infrastructure) sont exclus et refacturés
  au réel : ils ne doivent jamais ronger la marge.

Grille cible indicative, après 2 ou 3 références publiques :

| Prestation | Lancement (config actuelle) | Cible |
| --- | ---: | ---: |
| Web | 550 €/j | 600 €/j |
| API | 600 €/j | 650 €/j |
| Cloud & DevOps | 650 €/j | 700 €/j |
| Gestion de projet | 600 €/j | 650 €/j |
| IA | 850 €/j | 900–950 €/j |
| Conseil / audit | 750 €/j | 800 €/j |

Le passage à la grille cible doit rester une décision du client.

## 5. TJM HT par prestation — `[PROPOSITION]`

| Prestation | Identifiant moteur | TJM HT | Référence marché |
| --- | --- | ---: | --- |
| Développement web et applicatif | `web` | 550 € | 450–650 € confirmé |
| API et intégrations | `api` | 600 € | 450–650 €, haut de fourchette |
| Cloud & DevOps | `cloud-devops` | 650 € | 550–750 €, compétence rare |
| Gestion de projet | `gestion-de-projet` | 600 € | 500–900 € selon expérience |
| IA et automatisation | `ia` | 850 € | 600–900 € audit/IA ; > 950 € experts |
| Conseil et audit technique | `conseil` | 750 € | 600–900 € indépendant |

## 6. Charges de base — `[PROPOSITION]`

Charge de référence, en jours, avant coefficients de complexité et d’urgence.

| Prestation | Jours de base | Lecture marché |
| --- | ---: | --- |
| Web | 8 | Site vitrine ou MVP applicatif |
| API | 6 | API métier avec documentation |
| Cloud & DevOps | 4 | Socle CI/CD et supervision |
| Gestion de projet | 4 | Cadrage et pilotage court |
| IA | 3 | Audit express ou cadrage de cas d’usage |
| Conseil | 3 | Audit technique express |

## 7. Options par prestation — `[PROPOSITION]`

### Développement web et applicatif

| Option | Identifiant moteur | Jours |
| --- | --- | ---: |
| Pages et parcours supplémentaires | `pages` | 3 |
| Authentification et comptes | `authentification` | 3 |
| Paiement en ligne | `paiement` | 4 |
| Back-office d’administration | `back-office` | 5 |
| Intégrations tierces | `integrations` | 4 |
| Multilingue | `multilingue` | 2 |

### API et intégrations

| Option | Identifiant moteur | Jours |
| --- | --- | ---: |
| Authentification et autorisation | `authentification` | 2 |
| Intégrations tierces | `integrations` | 4 |
| Temps réel | `temps-reel` | 3 |
| Notifications | `notifications` | 2 |
| Documentation et contrat d’API | `documentation` | 1 |

### Cloud & DevOps

| Option | Identifiant moteur | Jours |
| --- | --- | ---: |
| Conteneurisation | `conteneurisation` | 3 |
| Intégration et déploiement continus | `ci-cd` | 3 |
| Supervision et alertes | `supervision` | 2 |
| Sauvegardes et restauration | `sauvegardes` | 2 |
| Gestion des secrets | `secrets` | 1 |

### Gestion de projet

| Option | Identifiant moteur | Jours |
| --- | --- | ---: |
| Accompagnement hebdomadaire | `accompagnement-hebdomadaire` | 1 |
| Recette et acceptation | `recette` | 2 |
| Formation et transfert | `formation` | 2 |
| Reporting et comités | `reporting` | 1 |
| Coordination des partenaires | `coordination-partenaires` | 2 |

### IA et automatisation

| Option | Identifiant moteur | Jours | Lecture marché |
| --- | --- | ---: | --- |
| Audit IA et cadrage des cas d’usage | `audit-ia` | 4 | Audit complet 6 000–12 000 € HT |
| Chatbot ou assistant | `chatbot` | 3 | Pilote 3 000–5 000 € HT |
| RAG sur documents | `rag` | 5 | Projet moyen 6 000–12 000 € HT |
| Agents et enchaînement d’outils | `agents` | 7 | Projet ambitieux, à partir de 15 000 € HT |
| Automatisation de tâches | `automatisation` | 4 | Pilote ou projet moyen |
| Évaluation de la qualité | `evaluation-qualite` | 3 | Jeux de tests, garde-fous, mesure |
| Formation et acculturation IA | `formation` | 2 | 1 500–3 500 € HT/j en intra |

### Conseil et audit technique

| Option | Identifiant moteur | Jours |
| --- | --- | ---: |
| Audit d’architecture | `audit-architecture` | 2 |
| Audit de code | `audit-code` | 3 |
| Audit de sécurité | `audit-securite` | 2 |
| Atelier de restitution | `atelier-restitution` | 1 |
| Plan d’action | `plan-action` | 1 |

## 8. Contraintes — `[PROPOSITION]`

| Contrainte | Identifiant moteur | Jours | Commentaire |
| --- | --- | ---: | --- |
| Exigences de sécurité | `securite` | 3 | Menaces, durcissement, revue |
| Conformité / RGPD | `conformite` | 3 | Registre, minimisation, droits |
| Conformité IA / AI Act | `conformite-ia` | 4 | Classification, supervision humaine, documentation |
| Intégration à un système existant | `integration-existant` | 4 | API, données, legacy |
| Hébergement imposé | `hebergement` | 2 | Contraintes client ou souveraineté |
| Reprise de maintenance | `maintenance` | 1 | Reprise de code et documentation |

La contrainte `conformite-ia` est nouvelle : elle évite de sous-facturer les
sujets de classification, de documentation, de supervision humaine et de
traçabilité des systèmes d’IA.

## 9. Frais forfaitaires — `[PROPOSITION]`

| Frais | Identifiant moteur | Montant HT | Périmètre |
| --- | --- | ---: | --- |
| Cadrage initial | `cadrage` | 900 € | Web, API, cloud, projet, IA |
| Mise en production | `mise-en-production` | 600 € | Web, API, cloud |

Le conseil inclut son propre cadrage. L’IA n’a pas de frais de mise en
production automatique : la mise en service est chiffrée dans le périmètre
(audit, prototype, RAG, agents).

## 10. Coefficients — `[PROPOSITION]`

### Complexité

| Niveau | Identifiant moteur | Coefficient |
| --- | --- | ---: |
| Simple | `simple` | 0,75 |
| Standard | `standard` | 1,00 |
| Avancé | `avance` | 1,30 |
| Complet | `complet` | 1,60 |

### Urgence

| Niveau | Identifiant moteur | Coefficient |
| --- | --- | ---: |
| Standard | `standard` | 1,00 |
| Confort | `confort` | 1,10 |
| Prioritaire | `prioritaire` | 1,25 |

## 11. Hypothèses de calcul

| Paramètre | Valeur | Commentaire |
| --- | --- | --- |
| Devise | EUR | Contrainte technique |
| Jours travaillés par semaine | 5 | Paramètre de forme |
| Arrondi des jours | 0,5 jour | Paramètre de forme |
| Arrondi des montants HT | 50 € | Paramètre de forme |
| Marge de risque | 10 % | `[PROPOSITION]` |
| Amplitude de la fourchette | ±15 % | `[PROPOSITION]` |
| TVA | `[À COMPLÉTER]` | Société non créée, régime non validé |

## 12. Exemples de calcul

### Site web standard

Site web standard, options « pages » et « authentification », contrainte
« sécurité ».

| Ligne | Calcul | Jours | Montant HT |
| --- | --- | ---: | ---: |
| Base web | 8 j × 1,00 × 1,00 | 8 | 4 400 € |
| Pages | 3 j × 1,00 × 1,00 | 3 | 1 650 € |
| Authentification | 3 j × 1,00 × 1,00 | 3 | 1 650 € |
| Sécurité | 3 j × 1,00 × 1,00 | 3 | 1 650 € |
| Cadrage | Forfait | — | 900 € |
| Mise en production | Forfait | — | 600 € |
| Sous-total HT | — | 17 | 10 850 € |
| Marge de risque 10 % | 10 850 × 0,10 | — | 1 085 € |
| Total HT arrondi | 11 935 → 11 950 | — | 11 950 € |
| Fourchette ±15 % | — | — | 10 150 € à 13 750 € |

Durée indicative : 17 jours, soit environ 3 à 4 semaines.

### Audit IA complet

Prestation IA, option « audit IA », sans contrainte.

| Ligne | Calcul | Jours | Montant HT |
| --- | --- | ---: | ---: |
| Base IA | 3 j × 1,00 × 1,00 | 3 | 2 550 € |
| Audit IA | 4 j × 1,00 × 1,00 | 4 | 3 400 € |
| Cadrage | Forfait | — | 900 € |
| Sous-total HT | — | 7 | 6 850 € |
| Marge de risque 10 % | 6 850 × 0,10 | — | 685 € |
| Total HT arrondi | 7 535 → 7 550 | — | 7 550 € |
| Fourchette ±15 % | — | — | 6 400 € à 8 700 € |

Cette estimation tombe dans la fourchette marché 6 000–12 000 € HT pour un audit
complet. L’audit express, sans option, ressort autour de 3 800 € HT, dans la
fourchette 2 000–4 000 € HT.

### Pilote d’automatisation IA

Prestation IA, option « chatbot », sans contrainte : environ 6 600 € HT, dans la
fourchette des pilotes et petits projets moyens (3 000–12 000 € HT).

La TVA et le TTC ne sont pas calculés dans ces exemples : le régime reste
`[À COMPLÉTER]`.

## 13. Ce qui est exclu de la grille

- consommation des modèles LLM et des API ;
- infrastructure cloud, stockage et services tiers ;
- licences et abonnements logiciels ;
- rédaction et production de contenus ;
- déplacements et hébergement ;
- frais légaux et administratifs ;
- support et interventions d’urgence.

Ces coûts sont refacturés au réel ou font l’objet d’un devis séparé. Les inclure
dans le TJM ferait porter au prestataire un risque variable non maîtrisé.

## 14. Données client encore manquantes

- [ ] statut juridique de la société ;
- [ ] SIRET ;
- [ ] adresse professionnelle et mentions légales ;
- [ ] régime de TVA (franchise ou standard) et taux applicable ;
- [ ] conditions de paiement et acompte ;
- [ ] logo et identité visuelle définitifs ;
- [ ] assurance professionnelle, si applicable ;
- [ ] coordonnées bancaires et modalités de facturation ;
- [ ] validité des devis et conditions de report ou d’annulation.

Tant que ces éléments manquent, le PDF, le devis et les totaux TTC restent
désactivés. Le mode `ready-ht` est un mode de simulation publique, pas un devis.

## 15. Procédure de validation

1. Le client annote cette grille : conserve, corrige ou supprime chaque ligne.
2. Les valeurs validées sont recopiées dans `src/lib/pricing/config.ts`.
3. `npm test` vérifie la cohérence de la configuration et du moteur.
4. `npm run typecheck`, `npm run lint` et `npm run build` sont exécutés.
5. L’estimateur et la grille sont contrôlés sur `/fr/estimate` et `/en/estimate`.
6. Le PDF et les totaux TTC ne sont activés qu’après validation des données
   légales et du régime de TVA.

## 16. Ce que cette proposition ne fait pas

- Elle ne valide aucun tarif : elle propose.
- Elle ne fixe aucune TVA.
- Elle ne crée aucune mention légale.
- Elle ne remplace pas un devis signé.
- Elle n’active ni le PDF ni le TTC.
