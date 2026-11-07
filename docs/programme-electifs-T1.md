# Cours électifs INFRA — filières SI et SRC, 4A trimestre 1, 2026-2027

Source : « Listing matières 4A INFRA T1 Filières SI_SRC.pdf », document officiel ESGI.
Déposé ici pour renseigner le champ `esgi` des modules du curriculum.

## Calendrier

| Date | Horaire | Format |
|---|---|---|
| mardi 29 septembre 2026 | 8h00-11h15 (3 h) | distanciel |
| lundi 26 octobre 2026 | 8h00-13h00 (4 h 30) | distanciel |
| lundi 23 novembre 2026 | 8h00-13h00 (4 h 30) | distanciel |
| lundi 14 décembre 2026 | 8h00-11h15 (3 h) | distanciel |
| **vendredi 18 décembre 2026** | — | **examen, présentiel** |

Évaluation : QCM de 40 questions **par matière**, soit cinq QCM le 18 décembre.

---

## Audit de code

Objectif : analyser du code source pour identifier vulnérabilités, erreurs de conception
et pratiques dangereuses. Distinguer une faiblesse théorique d'une vulnérabilité
réellement exploitable, évaluer son impact, proposer une correction. Construire une
démarche d'audit reproductible jusqu'au rapport exploitable par les développeurs.

| Séance | Contenu |
|---|---|
| 1 — Construire une démarche d'audit | objectifs et périmètre ; architecture de l'application ; composants sensibles ; surface d'attaque ; points d'entrée ; frontières de confiance ; méthodologie de revue ; OWASP et CWE |
| 2 — Identifier les vulnérabilités | validation des entrées ; injections ; contrôle d'accès ; authentification ; gestion des sessions ; manipulation de fichiers ; désérialisation ; SSRF ; erreurs de logique métier ; secrets et données sensibles |
| 3 — Suivre les données et les contrôles | sources, sinks et sanitization ; taint analysis ; flux de données ; flux de contrôle ; chemins vulnérables ; analyse interfonctionnelle ; potentiel, exploitable, faux positif |
| 4 — Automatiser l'analyse | SAST ; analyse par règles et sémantique ; Semgrep ; intégration CI/CD ; qualité et couverture des règles ; faux positifs ; complémentarité avec la revue manuelle |
| 5 — De la vulnérabilité à la remédiation | validation ; estimation de l'impact ; CWE et CVSS ; priorisation ; correction sécurisée ; revue du correctif ; rédaction d'un finding ; preuves ; recommandations ; restitution |

Outils : environnement de développement, Git, Docker, outils d'analyse statique.
Prérequis : bases de la programmation et de Git, développement Web, sécurité applicative.

---

## Management de l'innovation

Objectif : identifier une innovation technologique, évaluer son intérêt pour une
organisation, accompagner son adoption — de la veille au transfert vers les équipes.

| Séance | Contenu |
|---|---|
| 1 — Comprendre l'innovation | incrémentale et de rupture ; cycle d'adoption ; technologies émergentes ; innovation technologique et d'usage ; opportunités et risques |
| 2 — Organiser une veille technologique | sources et méthodes ; signaux faibles ; benchmarks ; publications scientifiques ; brevets ; startups ; communautés open source ; qualification et restitution |
| 3 — De la veille au Proof of Concept | cas d'usage ; hypothèses ; construction d'un PoC ; critères de succès ; coûts et risques ; prototype, pilote et MVP ; décision Go/No-Go |
| 4 — Transférer une technologie | du prototype à la production ; industrialisation ; compétences ; documentation ; propriété intellectuelle ; transfert de connaissances ; fournisseurs et partenaires |
| 5 — Accompagner le changement | parties prenantes ; résistances ; communication ; formation ; adoption ; mesure de la valeur ; gouvernance ; présentation d'une recommandation à une direction |

Prérequis : aucun.

---

## FinOps — maîtriser les coûts du cloud

Objectif : comprendre les mécanismes économiques du cloud, piloter et optimiser les
dépenses, arbitrer entre coût, performance, disponibilité, sécurité et besoins métiers.

| Séance | Contenu |
|---|---|
| 1 — Comprendre l'économie du cloud | CapEx et OpEx ; paiement à l'usage ; modèles de facturation ; compute, stockage, réseau, services managés ; coûts directs et cachés |
| 2 — Observer et attribuer les coûts | facturation ; comptes et projets ; tagging ; allocation ; showback et chargeback ; budgets ; alertes ; KPI FinOps |
| 3 — Optimiser les ressources | rightsizing ; ressources inutilisées ; autoscaling ; scheduling ; stockage chaud et froid ; coûts réseau et egress ; bases de données et services managés |
| 4 — Prévoir et maîtriser la dépense | forecast ; budgets ; anomalies de consommation ; engagements et réservations ; coûts variables ; unit economics ; coût par utilisateur, transaction ou service |
| 5 — Construire une démarche FinOps | collaboration finance, IT et métiers ; gouvernance ; responsabilités ; automatisation ; arbitrages coût, performance, résilience, sécurité ; étude de cas |

Prérequis : connaissances générales des architectures cloud.

---

## Recon — stratégie d'exploration

Objectif : conduire méthodiquement une reconnaissance dans le cadre d'un audit ou d'un
test d'intrusion autorisé. À partir d'informations limitées, collecter, corréler et
hiérarchiser pour cartographier une surface d'exposition.

| Séance | Contenu |
|---|---|
| 1 — Penser la reconnaissance | objectifs ; périmètre et règles d'engagement ; passive et active ; OPSEC ; formulation d'hypothèses ; démarche itérative |
| 2 — Reconnaissance passive et OSINT | DNS ; WHOIS et RDAP ; certificats ; moteurs de recherche ; archives Web ; dépôts publics ; métadonnées ; technologies exposées |
| 3 — Cartographier la surface d'exposition | domaines et sous-domaines ; adresses IP ; ASN ; services ; applications ; cloud ; technologies ; identités publiques ; fournisseurs et dépendances |
| 4 — Reconnaissance active | résolution DNS ; découverte d'hôtes ; ports et services ; fingerprinting ; énumération ; validation ; bruit généré et limites opérationnelles |
| 5 — Construire une stratégie d'exploration | corrélation ; graphes de relations ; automatisation ; priorisation des pistes ; choix de la prochaine action ; restitution d'une cartographie |

Outils : environnement Linux ou VM Linux.
Prérequis : bases TCP/IP, DNS, Linux, services Web.

---

## Power BI — analyse et visualisation de données

Intervenant : M. Rhodes.
Objectif : transformer des données brutes en indicateurs et tableaux de bord — import,
préparation, modélisation, DAX, visualisation.

| Séance | Contenu |
|---|---|
| 1 — De la donnée à l'indicateur | découverte de Power BI ; sources de données ; import Excel, CSV et bases de données ; qualité des données ; KPI ; principes de datavisualisation |
| 2 — Préparer les données avec Power Query | nettoyage ; typage ; filtres ; transformations ; jointures ; agrégations ; données manquantes ; reproductibilité |
| 3 — Modéliser les données | tables et relations ; cardinalité ; dimensions et faits ; modèle en étoile ; table de calendrier ; granularité ; bonnes pratiques |
| 4 — Construire des indicateurs avec DAX | colonnes calculées et mesures ; agrégations ; contexte de filtre ; CALCULATE ; indicateurs temporels ; KPI et ratios |
| 5 — Construire un tableau de bord | choix des visualisations ; filtres et interactions ; drill-down ; lisibilité ; storytelling ; publication ; actualisation ; partage et contrôle des accès |

Outils : Power BI Desktop.
Prérequis : bases d'Excel, manipulation simple de données.

Note : la séance 1 a été suivie, et son TP rendu
(`T1_Electifs/Power_BI/TP_PowerBI_Parbotteea_Youness.pbix`).
Le support de séance 1 confirme le plan ci-dessus : business intelligence, donnée
contre information, reporting contre tableau de bord, interface de Power BI Desktop,
choix du graphique, KPI, puis une mission sur un jeu de données de ventes.
