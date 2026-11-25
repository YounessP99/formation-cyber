# Brief — sections ESGI : Réalisations, Cours & révision, TP, Contrôles

Document de directives pour Claude Code, dans `C:\Dev\formation-cyber`.
Rédigé le 25 novembre 2026. Complète `BRIEF_APPLICATION.md`, ne le remplace pas.

---

## 0. Règle absolue

**Le parcours débutant reste intact.** Les 41 niveaux, `curriculum.json`, `modules/`,
les examens de niveau, les clés `localStorage` existantes (`formation.cyber.*`,
`fc.theme`) : on n'y touche pas. Le parcours « de zéro à expert » reste l'onglet
principal et l'écran d'accueil par défaut.

Ce brief **ajoute** quatre sections qui suivent l'école en temps réel. Il ne retire rien.

---

## 1. Ce qu'on construit

Cinq onglets en haut de l'application :

| Onglet | Rôle |
|---|---|
| **Parcours** | L'existant, inchangé. Écran d'accueil. |
| **Réalisations** | Ce que Youness a réellement fait : TP rendus, labos montés, notes obtenues. |
| **Cours & révision** | Une page par matière ESGI : séances, supports, cartes de révision. |
| **TP** | Les travaux pratiques : échéance, statut, note, étapes à cocher. |
| **Contrôles** | Les évaluations annoncées : date, périmètre, format, examen blanc. |

Navigation par hash (`#parcours`, `#realisations`, `#cours`, `#cours=asm`, `#tp`,
`#controles`) **sans casser** le hash existant `#m=<id>` qui ouvre un module.
Sur téléphone, les onglets passent en barre fixe en bas d'écran.

---

## 2. Décisions prises

1. **Supports de cours** : ils restent dans OneDrive
   (`C:\Users\Youne\OneDrive\03_Etudes\ESGI\M1_2026-2027\...`). L'application
   **n'essaie pas de les ouvrir** : elle affiche le chemin complet, le numéro de
   slide/page, et un bouton « copier le chemin ». Aucun PDF n'est copié dans le dépôt.
2. **Contenu en fichiers, application en lecture seule.** Tout le contenu vit dans un
   nouveau dossier `esgi/` (JSON). Pas de formulaire de saisie dans l'app : les
   fichiers sont mis à jour par Claude après chaque cours/TP. Seule la progression
   des cartes est écrite dans le navigateur.
3. **Cartes de révision rédigées par Claude**, à partir des `Notes.md` et des supports
   de chaque matière. Chaque carte porte sa source (fichier + slide/page). Exactitude
   vérifiée selon les principes de `relire-module` avant commit.
4. **Synchronisation PC/téléphone : reportée.** Les cartes ESGI utilisent leur propre
   clé `localStorage` (`formation.cyber.esgi.cartes.v1`), indépendante de celle du
   parcours, pour que la future synchro puisse les reprendre sans migration.

---

## 3. Fichiers de données

```
esgi/
├── matieres.json        liste des matières
├── realisations.json    ce qui a été fait
├── tp.json              travaux pratiques
├── controles.json       évaluations
└── cartes/<id>.json     cartes de révision, une matière par fichier
```

### matieres.json
```json
[{ "id": "asm", "titre": "Assembleur avancé", "intervenant": "M. GRAU",
   "trimestre": "T1", "type": "tronc|electif",
   "dossier": "C:\\Users\\Youne\\OneDrive\\03_Etudes\\ESGI\\M1_2026-2027\\T1_Cours\\Assembleur_avance",
   "seances": [{ "date": "2026-11-24", "sujet": "...", "supports": [{"fichier": "...", "reperes": "slides 1-24"}] }],
   "modules_parcours": ["n13-1"] }]
```
Identifiants : `asm`, `crypto`, `linux`, `rust`, `ad`, `radio`, `toeic`, `python`,
`powerbi` (+ les autres électifs seulement si le périmètre de l'examen les inclut).
`modules_parcours` : ids **existants** de `curriculum.json` qui couvrent la matière.

### realisations.json
```json
[{ "id": "linux-ckb", "date": "2026-11-13", "matiere": "linux",
   "titre": "Checkpoint B — infrastructure deux services sur Proxmox",
   "fait": ["..."], "competences": ["..."], "note": null,
   "preuve": "chemin du rendu ou du dépôt", "modules_parcours": ["..."] }]
```

### tp.json
```json
[{ "id": "linux-final", "matiere": "linux", "titre": "...",
   "echeance": "2026-12-20T17:00", "statut": "a_faire|en_cours|rendu|note",
   "note": null, "plateforme": null, "enonce": "chemin",
   "etapes": [{"t": "...", "fait": false}] }]
```
Les étapes cochées dans l'app sont stockées dans le navigateur ; `fait` dans le JSON
est l'état de référence.

### controles.json
```json
[{ "id": "electifs-qcm", "matiere": "powerbi", "date": "2026-12-18",
   "format": "QCM 40 questions", "perimetre": ["..."], "a_confirmer": "...",
   "cartes": ["powerbi"] }]
```

### cartes/<id>.json
```json
{ "matiere": "asm", "cartes": [{ "r": "recto", "v": "verso",
  "source": "x0ne module 01, slide 9", "piege": false }] }
```
Même forme `{r, v}` que les cartes des modules, pour réutiliser le moteur de boîtes.

---

## 4. Contenu à pré-remplir (faits vérifiés, ne rien inventer)

### Réalisations
- **Linux — Checkpoint A** (rendu après l'échéance du 11/10) : partitionnement LVM avec
  /home /var /tmp séparés, montages durcis, sudo granulaire, réseau statique
  persistant, SSH durci, snapshot LVM et rollback. Rendu :
  `...\Linux_admin_avancee\Checkpoint_A\Checkpoint_A_Youness_Parbotteea.pdf`
- **Linux — tuxeval TP1** : 85/100 après correction des options de montage fstab.
- **Linux — Checkpoint B** (rendu le 13/11, échéance 15/11) : Proxmox sous VMware,
  conteneurs LXC non privilégiés (CT 210 dns, CT 220 web), BIND9 autoritatif zone
  `ckb.home.arpa` (directe + inverse, AXFR refusé), RBAC Proxmox (`kim@pve`), TOTP,
  Apache avec contrôle d'accès à trois niveaux, script `deploy.sh` idempotent.
  Rendu : `...\Checkpoint_B\Checkpoint_B_Youness_Parbotteea.pdf`
- **Sécurité Python — TP1** 17,64/20 (analyse de trafic, Scapy) · **TP2** 17,7/20
  (triage de malware) · **TP3** 19,49/20 (exploit : fuzzing d'endpoint, OCR de CAPTCHA,
  session HTTP, base64 + XOR sur TCP, tests pytest). Dépôt :
  `C:\Users\Youne\Dev\template-securite-python`
- **Radio — TP cartes sans contact** : lecture d'une Mifare Classic 1K (libnfc, mfoc,
  mfdread, clés d'usine), lecture du passe Navigo (Calypso) avec Cardpeek.
  **Exercice final** en binôme : décodage d'un signal ASK/OOK avec URH, schéma GNU Radio,
  modification d'un dump de carte.
- **Power BI — TP séance** (26/10) : import CSV, nettoyage, colonne calculée, rapport
  KPI/histogramme/courbe/segment. `...\T1_Electifs\Power_BI\TP_PowerBI_Parbotteea_Youness.pbix`
- **AD — labo** (25/11) : modèle Windows Server 2025 généralisé (Sysprep), DC1, forêt
  `parboyouness.local`, DNS intégré, dcdiag OK. DC2 Server Core en cours.
- **Crypto** : rattrapage complet du programme 3A (fiche 37 pages) et fiches
  authentification 4A partie 1.

### TP
- **Linux — rendu final HomeLab** : 20/12/2026 17h00, statut `a_faire`. Étape 1 :
  « récupérer l'énoncé du HomeLab (absent du dossier) ». Le syllabus annonce en plus
  la gestion des services et des bases de données.
- **AD — labo** : statut `en_cours`. Étapes : DC1 ✔ · DC2 Server Core · client Windows
  joint au domaine · OU/groupes/utilisateurs (PDF 02) · GPO (PDF 03) · PKI AD CS.
  Note : 4 VM = 12 Go sur 16 Go, éteindre DC2 pendant le travail sur la PKI.
- **Sécurité Python TP1, TP2, TP3** : statut `note`, notes ci-dessus.

### Contrôles
- **Électifs** — 18/12/2026, présentiel, QCM 40 questions par matière.
  `a_confirmer` : « évalué sur Power BI seul ou sur les cinq électifs ? »
- **Windows AD** — date inconnue. Périmètre annoncé le 25/11 : AD CS (PKI) et GPO.
- **Sécurité Python** — examen sur table (QCM + analyse de code), date inconnue.

---

## 5. Matière pilote : Assembleur

C'est la première matière à recevoir ses cartes (révision immédiate).
Source : x0ne.training, module 01, section « Rappels & Prérequis » (24 slides).
Notions à couvrir :

notation binaire · notation hexadécimale · table 0–15 déc/bin/hex · table ASCII
(chiffres 0x30–0x39, majuscules 0x41–, minuscules 0x61–) · nibble, octet · word,
dword, qword et types C correspondants · little-endian / big-endian · opérations
logiques (tables de vérité, bit à bit, masques) · descripteurs de fichiers 0/1/2 ·
assembleur langage vs programme assembleur · syntaxe Intel vs AT&T · langage machine
et opcodes · cycle du processeur et registre RIP · hiérarchie mémoire.

Cartes `piege: true` obligatoires :
1. le caractère `'0'` (0x30) n'est pas la valeur 0 ; `'7' - 0x30 = 7` ;
2. `word` = 16 bits, même sur un processeur 64 bits ;
3. little-endian inverse l'ordre des **octets**, jamais des nibbles :
   `0x12345678` → `78 56 34 12` ;
4. AND éteint/teste, OR allume, XOR inverse ; `0x41 OR 0x20 = 0x61` ;
5. un saut court `75 06` est relatif à la fin de l'instruction ; les immédiats sont
   écrits en little-endian.

Le contenu exact des slides n'est pas accessible à Claude Code (plateforme avec
connexion) : rédiger les cartes sur ces notions, avec exemples chiffrés recalculés,
et noter `source: "x0ne module 01"` sans numéro de slide inventé.

**Deuxième source : QCM 1 de x0ne.training (24/11, 25/40)**, dans
`C:\Users\Youne\OneDrive\03_Etudes\ESGI\M1_2026-2027\T1_Cours\Assembleur_avance\2026-11-24_QCM1_x64_Assembly_corrige.pdf`
(40 questions en anglais, bonne réponse indiquée, ses erreurs marquées « ta réponse »).
La section « Pour l'examen » du `Notes.md` du même dossier résume les 15 erreurs.
- Chacune des 15 erreurs devient une carte `piege: true`, `source: "QCM 1 x0ne, Q<n>"`.
- Les 25 questions réussies deviennent des cartes normales.
- Le recto peut garder la question en anglais (comme à l'examen), le verso explique en français.
- Q14 (nombre premier) : préciser « strictement supérieur à 1 ». Q19 : signaler que le code
  de sortie se passe dans RDI, RAX portant le numéro de syscall (60).
- À ajouter dans `controles.json` comme contrôle passé (date 2026-11-24, note 25/40) ; si le
  schéma n'a pas de champ note pour un contrôle, proposer son ajout avant de l'écrire.

Ensuite, dans cet ordre : `ad` (depuis la section « À retenir » de son `Notes.md`,
puis AD CS et GPO depuis `Cours windows complet.pptx` et `03 - GPO.pdf`), `powerbi`,
puis les autres.

---

## 6. Interface

- Même direction visuelle que le parcours (`design/direction.html`), thèmes clair et
  sombre, couleurs vives lisibles. Pas de bleu marine imposé.
- **Cours & révision** : une tuile par matière avec compteur de cartes à revoir ;
  dans la matière : séances, supports (chemin + bouton copier), bouton « Réviser »
  (moteur de boîtes existant), lien vers les modules du parcours liés.
- **Réalisations** : frise chronologique, filtrable par matière ; chaque carte affiche
  compétences, note, chemin de la preuve, et les modules du parcours qu'elle couvre
  (cliquables).
- **TP** : trié par échéance ; compte à rebours ; rouge sous 7 jours ; étapes cochables.
- **Contrôles** : trié par date ; bandeau « à confirmer » visible ; bouton
  « examen blanc » = 20 cartes tirées des matières liées, chronométré 30 s/carte,
  score affiché, aucune donnée hors cartes.
- L'onglet Parcours affiche un petit rappel : prochain TP et prochain contrôle.

---

## 7. Ordre de mise en œuvre

Une étape à la fois. Montrer le résultat, attendre la validation, committer, puis
passer à la suivante.

1. Schéma des fichiers `esgi/` + extension de `outils/valider.js` (champs requis,
   matières référencées existantes, `modules_parcours` existants, dates ISO).
2. Onglets et routage, Parcours inchangé (vérifier que `#m=<id>` marche toujours).
3. Cours & révision + cartes `asm` (matière pilote).
4. Réalisations, pré-remplies selon §4.
5. TP.
6. Contrôles + examen blanc.
7. Cartes `ad`, puis `powerbi`.

---

## 8. Garde-fous

- Ne rien inventer : une info absente reste `null` ou `a_confirmer`.
- Ne pas recopier de longs passages des supports : cartes courtes, reformulées.
- Ne pas modifier `curriculum.json`, `modules/`, ni les skills existantes.
- Tester sur PC et en largeur téléphone (≤ 400 px) avant chaque validation.

---

## 9. Ajout du 25/11 au soir : sauvegarde de la progression et arbre de compétences

### 9.1 Constat
- Toute la progression (modules, examens, boîtes de cartes, cartes ESGI, étapes de TP
  cochées) vit dans le `localStorage` du navigateur. Rien ne permet de la sauvegarder
  ni de la transférer.
- L'application sera publiée sur GitHub Pages
  (`https://younessp99.github.io/formation-cyber/app/`). Cette adresse et
  `localhost:8000` sont deux origines différentes : deux progressions séparées.
- La carte en circuit imprimé (`design/carte.html`) existe seulement comme maquette, avec
  une progression fictive. L'application affiche encore une simple liste de niveaux.

### 9.2 Étape A : exporter / importer la progression (à faire juste après l'étape 3)
- Un bouton « Sauvegarder ma progression » télécharge un fichier
  `progression-AAAA-MM-JJ.json` contenant toutes les clés `localStorage` de l'appli
  (`formation.cyber.*`, `fc.theme`), avec un numéro de version et la date.
- Un bouton « Restaurer » lit ce fichier, affiche ce qu'il contient (date, nombre de
  modules validés, de cartes) et demande confirmation avant d'écraser.
- Fusion simple proposée en option : un module validé d'un côté reste validé ; pour une
  carte, on garde la boîte la plus basse (prudence).
- Rappel discret dans l'en-tête si la dernière sauvegarde a plus de 7 jours.
- Doit marcher sur téléphone (téléchargement et sélection de fichier).
- C'est une solution d'attente, pas la synchronisation du §6.2 de `BRIEF_APPLICATION.md`,
  qui reste à faire.

### 9.3 Étape B : brancher l'arbre de compétences (à faire après l'étape 7)
- La carte de `design/carte.html` devient la vue d'accueil de l'onglet Parcours, avec les
  vraies données : `curriculum.json` pour les niveaux, modules et prérequis, et la
  progression réelle (module validé, examen de niveau validé).
- Un module écrit et ouvert se clique et s'ouvre ; un module non écrit apparaît
  « à écrire » ; un niveau verrouillé affiche ses prérequis manquants.
- Les modules couverts par une réalisation (`modules_parcours` de `realisations.json`)
  apparaissent avec un marquage distinct « vu en cours/TP », sans être comptés comme
  validés : seule l'évaluation valide un module.
- La liste actuelle des niveaux reste accessible (bouton « vue liste »).
- Sur téléphone : la carte se charge en premier, comme validé lors de la maquette.

### 9.4 Étape C : synchronisation automatique gratuite par Gist GitHub (juste après l'étape A)
Décision : pas de serveur, pas de service payant. La progression est stockée dans un
**Gist secret** du compte GitHub de Youness, via l'API GitHub.
- Réglages de l'appli : champ « jeton GitHub » (jeton à portée `gist` uniquement),
  stocké dans le `localStorage` de l'appareil, jamais dans le dépôt ni dans le code.
- Premier appareil : l'appli crée le Gist secret `formation-cyber-progression.json` et
  mémorise son identifiant. Autres appareils : on colle le même jeton, l'appli retrouve
  le Gist par son nom.
- Envoi : quelques secondes après chaque changement (module, examen, carte, étape de TP),
  et à la fermeture de la page. Réception : à l'ouverture de l'appli.
- Conflit : fusion de l'étape A (validé reste validé ; boîte de carte la plus basse ;
  horodatage par clé pour le reste). Jamais d'écrasement silencieux.
- Hors connexion : l'appli marche normalement et envoie au retour du réseau.
- Indicateur dans l'en-tête : « synchronisé », « en attente », « erreur ».
- Le bouton d'export/import de l'étape A reste disponible en secours.
- Documenter dans le README, pas à pas, la création du jeton (Settings → Developer
  settings → Personal access tokens → Tokens (classic) → portée `gist` uniquement).
Cette étape remplace le « petit service de synchronisation » du §6.2 de
`BRIEF_APPLICATION.md`.
