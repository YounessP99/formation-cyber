# Brief maître — l'application de formation

Document de directives pour Claude Code, travaillant dans `C:\Dev\formation-cyber`.
Rédigé le 6 novembre 2026.

Il **remplace** `BRIEF_PROGRAMME_4A.md` comme document de référence, mais ne l'annule
pas : l'inventaire détaillé des supports de cours 4A, matière par matière, y reste et
doit être lu avant d'écrire un module de 4e année. Il **intègre** `BRIEF_REFONTE.md`,
dont les principes pédagogiques restent en vigueur, à une exception tranchée (§4.1).

---

## 1. Ce qu'on construit

Une application de formation personnelle, utilisable sur PC et sur téléphone, qui prend
quelqu'un qui ne connaît **rien** à l'informatique et l'amène au niveau du Mastère
Cybersécurité de l'ESGI.

Le périmètre a été arrêté : **tout le cycle**, en accéléré sur les deux premières
années, approfondi sur la troisième, complet sur la quatrième, avec ouverture sur la
cinquième.

| Cycle | Statut | Pourquoi |
|---|---|---|
| 1re et 2e année (tronc commun informatique) | Accéléré | Ce sont les fondations. Elles doivent être solides, mais sans les parties qui ne servent pas la cyber (VBA Excel, traitement d'images, développement mobile). |
| 3e année (Bachelor Cybersécurité) | Approfondi | C'est le prérequis direct de la 4A, et c'est l'année que Youness n'a pas faite. Assembleur x64, Python cyber, Rust, Linux admin avancée, CCNA 1 et 2, crypto clés et certificats, blue team IDS : la 4A part de là. |
| 4e année (Mastère 1) | Complet | L'année en cours. C'est la cible. |
| 5e année (Mastère 2) | Ouverture | Pas un cours complet : de quoi arriver préparé, et savoir où chaque matière de 5A s'enracine. |

La 4e année n'est pas validante. Le critère n'est donc pas la note, c'est la
couverture : une notion est acquise quand elle peut être réexpliquée et refaite sans
support.

---

## 2. Les quatre décisions prises

Elles sont arrêtées, pas à rediscuter.

**Couverture** : tout le cycle, accéléré 1A-2A, approfondi 3A, complet 4A, ouverture 5A.

**Synchronisation** : un petit service de synchronisation est mis en place. La
progression doit être identique sur PC et sur téléphone, sans manipulation. Aujourd'hui
elle vit dans le `localStorage` du navigateur, donc elle est enfermée dans un appareil
et un simple nettoyage l'efface.

**Mode labo** : les travaux pratiques s'exécutent dans la vraie VM, pas dans un terminal
simulé. L'application donne la consigne, l'utilisateur exécute, puis recolle la sortie
dans l'application qui la vérifie.

**Matières non techniques** (FinOps, Power BI, management de l'innovation,
communication professionnelle, TOEIC) : présentes, mais dans une section séparée, au
format court, sans polluer le parcours technique.

---

## 3. Le programme officiel, année par année

Source : pages programme de l'ESGI. C'est la référence de couverture.

### 3.1 Première année — tronc commun

- **Sciences de l'ingénieur** : mathématiques mise à niveau, mathématiques générales.
- **Développement** : modélisation de bases de données, langage SQL, algorithmique et
  structures de données, langage C.
- **Systèmes et réseaux** : architecture des réseaux, circuits logiques et architecture
  d'un ordinateur, virtualisation et gestion de parcs informatiques, Linux utilisation
  avancée, bases de l'administration Windows.
- **Technologies du Web** : architectures Web, HTML/CSS/PHP, JavaScript/XML/API Fetch.
- **Entreprise et gestion** : connaissance de l'entreprise, gestion du travail de
  groupe, développement VBA Excel, techniques de recherche d'emploi, architecture du
  système d'information.
- **Outils de communication** : anglais, méthodologie, modélisation et IHM.

### 3.2 Deuxième année — tronc commun

- **Conception et développement** : langage C avancé, modélisation UML2, programmation
  orientée objet et Java, versioning avec Git et GitHub.
- **Systèmes et réseaux avancés** : architecture et programmation assembleur, sécurité
  et vulnérabilités informatiques, Linux administration, virtualisation de réseaux
  (GNS3, NSX).
- **Technologies Web et Internet** : développement Web et API en Go, initiation au
  cloud, conteneurisation Docker.
- **Traitement de données** : mathématiques pour le traitement de données, introduction
  au data mining, introduction à l'IA.
- **Entreprise et gestion** : anglais, droit général, introduction à la gestion de
  projets.
- **Électifs infrastructures** : administration Windows avancée et PowerShell,
  déploiement dans le cloud, sécurité WiFi, collecte d'informations avec OSINT.

### 3.3 Troisième année — Bachelor Cybersécurité

- **Développement et plateformes** : langage C et algorithmie, scripting Python
  cybersécurité, outils de développement et de protection du code en Rust,
  assembleur x64.
- **Infrastructure** : Linux administration avancée, réseau mise en application
  (CCNA 1 et 2), sécurité WiFi, blue team — IDS et monitoring.
- **Sécurité technique** : panorama de la cyber et de l'IA, cryptographie — clés et
  certificats, intrusions physiques et hot-plug attacks, gestion des exploits,
  détection de vulnérabilités, crochetage.
- **Soft skills** : communication, planification, cyberéthique ; sécurité des réseaux
  WiFi ; sécurité et intrusion physique.

### 3.4 Quatrième année — Mastère 1 (année en cours)

- **Développement et scripting** : assembleur avancé, Rust, programmation système et
  réseau, sécurité avec Python.
- **Infrastructure** : Linux administration avancée, Windows Active Directory, sécurité
  du système d'information, blue team — SIEM et détection des intrusions,
  infrastructure à clés publiques (PKI), Cisco Network Security.
- **Sécurité technique** : cryptographie avancée, computer forensic, mécanismes de
  sécurité bas niveau, sécurité shellcode, reverse engineering, OSINT, exploitation de
  binaires, sécurité des cartes bancaires, sécurité RFID et radio, sécurité des IoT,
  ouverture fine et sécurité physique.
- **Soft skills** : communication professionnelle, social engineering.
- **Activités annuelles** : e-learning, projet annuel, projet de recherche FYC, Grand
  Oral professionnel, mission en entreprise, anglais et TOEIC, cours électifs, Security
  Day, Mindbreak CTF, DefHack.

Le détail de ce qui est réellement enseigné cette année, support par support, est dans
`BRIEF_PROGRAMME_4A.md` §2. **À lire avant d'écrire un module de 4A.**

### 3.5 Cinquième année — Mastère 2 (cible de préparation)

- **Infrastructure** : Linux sécurité avancée, Windows sécurité avancée, Blue Team —
  Security Operation Center, sécurité avancée des réseaux.
- **Sécurité technique** : sécurité offensive, audit et tests d'intrusion, intrusion
  RedTeam, Identity Access Management, analyse de malwares, sécurité des drones, Cyber
  Threat Intelligence, analyse de la menace, sécurité des systèmes industriels et
  SCADA, exploitation avancée de binaires, analyse de risque (ISO 27005, EBIOS-RM),
  sécurité des clouds, cadre réglementaire (DORA, NIS2).
- **Soft skills** : droit, éthique et cybercriminalité ; gestion de crise.

Lecture du programme : la 4A construit les mains, la 5A construit la tête et le cadre.
Ce qui doit être solide à la fin de la 4A, c'est le binaire, le réseau, l'Active
Directory et la cryptographie. Le reste de la 5A s'apprend dessus.

---

## 4. Le contenu : structure proposée

Quatre cycles. Les niveaux restent numériques pour ne rien casser dans le moteur, qui
indexe la progression par identifiant de module et par `examen-n<N>`.

Les six modules `n0-1` à `n0-6` **conservent leurs identifiants** : trois sont déjà
écrits et travaillés.

Chaque module porte deux champs nouveaux dans `curriculum.json` :
- `annee` : `1A`, `2A`, `3A`, `4A` ou `5A` — d'où vient la notion dans le cursus ;
- `esgi` : le cours servi, et le cas échéant la session ou le livrable concerné.

C'est ce qui permet de répondre, en sortant de cours : « ce qu'on vient de voir, c'est
quel module ? »

### Cycle 1 — Fondations accélérées (1A et 2A)

| Niveau | Titre | Contenu | Année |
|---|---|---|---|
| N0 | Socle machine et réseau *(existant)* | binaire et hexadécimal · TCP/IP · adressage et sous-réseaux · TCP et UDP · DNS, DHCP, ARP, NAT · routage et commutation | 1A |
| N1 | Logique et architecture d'un ordinateur | portes logiques, circuits, mémoire, bus, processeur, cycle d'exécution, représentation des nombres et des flottants | 1A |
| N2 | Algorithmique et structures de données | variables, conditions, boucles, fonctions, récursivité, complexité, tableaux, listes, piles, files, arbres, tables de hachage, tris et recherches | 1A |
| N3 | Langage C | types, pointeurs, mémoire, allocation, tableaux et chaînes, structures, fichiers, compilation ; puis C avancé : modularité, make, débogage | 1A et 2A |
| N4 | Données et SQL | modélisation relationnelle, clés, normalisation, SQL, jointures, agrégats, index, transactions ; NoSQL en survol | 1A et 2A |
| N5 | Le Web, de la requête au rendu | HTTP, URL, HTML, CSS, JavaScript, DOM, API et JSON, PHP côté serveur, sessions et cookies | 1A |
| N6 | Mathématiques pour la sécurité | logique, ensembles, dénombrement, probabilités, arithmétique modulaire, PGCD et Euclide étendu, Bezout, nombres premiers, indicatrice d'Euler, théorème d'Euler, exponentiation modulaire, paradoxe des anniversaires | 1A, et prérequis direct de la crypto 4A |
| N7 | Linux : utilisation et administration | ligne de commande, permissions et bits spéciaux, ACL, utilisateurs et sudo, processus et systemd, systèmes de fichiers, FHS, montages durcis, LVM et snapshots | 1A, 2A, 3A |
| N8 | Windows : utilisation et administration | installation, registre, services, processus, journaux d'événements, jetons d'accès, PowerShell | 1A et 2A |
| N9 | Virtualisation, conteneurs, cloud | type-1 et type-2, KVM, Proxmox, LXC, namespaces et cgroups, Docker, initiation au cloud et au modèle de responsabilité partagée | 1A et 2A |
| N10 | Programmer proprement | Python objet, structuration d'un projet, environnement virtuel, tests, UML2, Git et GitHub | 2A |

### Cycle 2 — Troisième année approfondie

| Niveau | Titre | Contenu | Année |
|---|---|---|---|
| N11 | Réseau en application : CCNA 1 et 2 | commutation, VLAN, trunk, STP, routage statique et dynamique, ACL, NAT sur IOS, sécurité des commutateurs, laboratoires GNS3 | 3A, et sert Cisco Network Security en 4A |
| N12 | Python pour la cybersécurité | projet propre (Poetry, pytest, pre-commit), sockets, parsing, automatisation, Scapy : forger et sniffer, un IDS maison | 3A et 4A |
| N13 | Assembleur x86-64 | registres, mémoire, instructions, drapeaux, pile, conventions d'appel, du C au binaire, ELF, `objdump` et `gdb` | 3A et 4A |
| N14 | Rust | pourquoi Rust, ownership, emprunts, durées de vie, types et gestion d'erreurs, Cargo, protection du code, sockets et concurrence | 3A et 4A |
| N15 | Linux : administration avancée et services | BIND9 résolveur et zones, Apache et vhosts, TLS avec sa propre autorité, Nginx en terminaison, Samba et NFS, OpenLDAP, RBAC Proxmox, tokens API, TOTP | 3A et 4A — cours de M. Ferrand, projet HomeLab |
| N16 | Cryptographie symétrique | Kerckhoffs, chiffrements historiques et cryptanalyse, primitives par bloc (DES, 3DES, AES), modes opératoires, MAC et HMAC, fonctions de hachage, chiffrement authentifié | 3A et 4A — Mme Khati |
| N17 | Cryptographie asymétrique, signature, PKI | factorisation, RSA, RSA naïf et ses attaques, OAEP, signature et ses attaques, PKCS#1 v1.5, PSS, certificats, autorités, chaîne de confiance, facteurs d'authentification, MFA, TLS de bout en bout | 3A et 4A — Mme Khati, et le cours PKI |
| N18 | Vulnérabilités et exploits | OWASP Top 10, sécurité et vulnérabilités systèmes, détection de vulnérabilités, gestion des exploits, scan et énumération | 2A, 3A, 4A |
| N19 | Blue team : IDS, monitoring, SIEM | sources de journaux, Event IDs utiles, Sysmon, IDS et règles, SIEM, écriture d'une règle de détection, faux positifs, MITRE ATT&CK, réponse à incident | 3A et 4A |
| N20 | Sécurité des réseaux sans fil | 802.11, WEP/WPA2/WPA3, handshake, capture, attaques et défenses | 2A, 3A, 4A |
| N21 | Intrusion physique | crochetage, hot-plug attacks, contournement de contrôle d'accès, ouverture fine, bonnes pratiques de sécurité physique | 3A et 4A |
| N22 | OSINT et reconnaissance | règles d'engagement et OPSEC, DNS, WHOIS/RDAP, certificats, archives, dépôts publics, sous-domaines, ASN, cloud, reconnaissance active, corrélation | 2A, 3A, 4A — et l'électif Recon |

### Cycle 3 — Quatrième année, complète

| Niveau | Titre | Contenu |
|---|---|---|
| N23 | Windows Active Directory | domaine, forêt, OU, rôle du DNS, GPO, délégations, groupes privilégiés, Kerberos, administration PowerShell |
| N24 | Mécanismes de sécurité bas niveau | ASLR, NX et DEP, canaries de pile, RELRO, PIE, CFI, SMEP et SMAP, TPM, démarrage sécurisé — et comment chacun se contourne |
| N25 | Reverse engineering | analyse statique et dynamique, désassemblage, décompilation, environnement isolé, reconnaissance de motifs, anti-analyse |
| N26 | Exploitation de binaires | débordement de tampon, écrasement de pointeur de retour, format string, ROP, exploitation du tas |
| N27 | Sécurité shellcode | écrire un shellcode, appels système, contraintes (octets nuls, taille), encodeurs, injection |
| N28 | Computer forensic | acquisition, chaîne de contrôle, timeline, analyse disque, analyse mémoire, artefacts Windows et Linux, rapport |
| N29 | Sécurité du système d'information | gouvernance, politique de sécurité, défense en profondeur, moindre privilège, segmentation, ISO 27001, RGPD, hygiène ANSSI |
| N30 | Sécurité des cartes bancaires | ISO 7816, APDU, puce et magnétique, EMV, cryptogrammes, PIN, sans contact, Calypso et le passe de transport, fraudes connues |
| N31 | Sécurité RFID et radio | du champ à l'onde, spectre, antennes, modulations, SDR (RTL-SDR, GNU Radio, URH), réseaux mobiles GSM à 5G, RFID 125 kHz, NFC 13,56 MHz, Mifare Classic |
| N32 | Sécurité des IoT | architecture d'un objet connecté, firmware, UART et JTAG, extraction et analyse, protocoles (MQTT, BLE, Zigbee, LoRa), surface d'attaque matérielle |
| N33 | Audit de code | démarche d'audit, CWE, sources et sinks, taint analysis, SAST et Semgrep, CI/CD, faux positifs, CVSS, rédaction d'un finding et d'un rapport |
| N34 | Social engineering | principes d'influence, prétextes, hameçonnage, vishing, OSINT appliqué aux personnes, cadre légal et éthique, sensibilisation |
| N35 | Compétition et restitution | format CTF (Mindbreak, DefHack), méthode de résolution, write-up, Grand Oral, projet de recherche FYC, communication professionnelle |

### Cycle 4 — Ouverture cinquième année

| Niveau | Titre | Contenu |
|---|---|---|
| N36 | Sécurité offensive et tests d'intrusion | méthodologie d'audit, exploitation web, élévation de privilèges, latéralisation, attaques Active Directory, RedTeam, rapport de pentest |
| N37 | SOC et Blue Team avancée | organisation d'un SOC, niveaux de support, ingénierie de détection, chasse aux menaces, CTI, analyse de la menace |
| N38 | Analyse de malwares | triage, analyse statique et dynamique, entropie, strings et IOC, PE et ELF, YARA, désobfuscation, rapport |
| N39 | Identité, cloud et systèmes particuliers | IAM, sécurité des clouds, Kubernetes, SCADA et systèmes industriels, drones |
| N40 | Risque, droit et crise | ISO 27005, EBIOS-RM, DORA, NIS2, droit et cybercriminalité, gestion de crise, certifications et plan de carrière |

### Section à part — matières non techniques

Hors parcours, accessible en permanence, au format court. Pas de verrouillage, pas de
prérequis.

FinOps et économie du cloud · Power BI · management de l'innovation · communication
professionnelle · anglais et préparation au TOEIC · **examens blancs des électifs** au
format exact de l'épreuve : QCM de 40 questions, chronométré.

---

## 5. Pédagogie : ce qui est tranché

### 5.1 La densité est conservée

`BRIEF_REFONTE.md` §3.6 demandait de supprimer la contrainte de « 400 à 600 mots de
prose par section » de `module-cyber`. **Cette suppression est abandonnée.** Le défaut
n'était pas la longueur, c'était la pente : plusieurs notions et plusieurs mots nouveaux
dans le même paragraphe, et des questions portant sur des notions mentionnées sans
jamais être manipulées.

Arbitrage entre les deux skills :

| Exigence | Décision |
|---|---|
| 4 à 6 sections, 400 à 600 mots de prose par section | **Conservée.** Un module reste un chapitre, pas une fiche. |
| Une idée par étape | **Conservée**, appliquée *à l'intérieur* de la section. Le compte de mots est une exigence de section, jamais d'écran. |
| Tout terme défini à sa première apparition | **Conservée.** |
| Ordre idée → exemple déroulé → manipulation | **Conservée.** |
| Activité interactive obligatoire avant de passer à l'étape suivante | **Conservée.** C'est le manque principal : le QCM devient une activité parmi d'autres. |
| On n'évalue que ce qui a été manipulé | **Conservée, et contrôle prioritaire** de `relire-module` : pour chaque question, identifier l'étape où la notion a été pratiquée, et refuser la question sinon. |
| Ancrage sécurité | Dans le texte quand il explique la notion ; en encadré pour les usages qui n'y tiennent pas. |

### 5.2 Deux poids de modules

Déclarés dans `curriculum.json` par un champ `statut` :

- `complet` : notion nouvelle, construite depuis zéro, densité pleine.
- `ancrage` : notion déjà vue en cours ou déjà pratiquée en TP. Le module ne réenseigne
  pas : il fait manipuler, corrige, et produit les cartes de révision. Nettement plus
  court. C'est la seule exception admise à l'exigence de volume.

### 5.3 La preuve négative

C'est la signature de tout le semestre Linux et le réflexe que l'entretien de défense
évalue : prouver qu'un `cp` dans `/tmp` est refusé, qu'une requête AXFR hors périmètre
est rejetée, que `www-data` ne peut pas écrire, qu'un `uid 0` client devient `nobody`.

Les exercices ne demandent pas « est-ce que ça marche ». Ils demandent : **montre que ce
qui doit échouer échoue, et nomme la couche qui refuse.**

### 5.4 Le code s'écrit à la main

Règle déjà posée et non négociable : pas de bloc de code à copier-coller. Un module qui
demande d'écrire du code décrit ce qu'il faut faire, étape par étape, et vérifie le
résultat. Cela vaut doublement pour les TP notés : le barème de M. Robin pénalise de
5 points les traces d'outillage d'assistant dans le rendu, et il y a une analyse
automatique anti-triche.

---

## 6. L'application : ce qui est demandé

### 6.1 Deux supports, deux usages

| | PC | Téléphone |
|---|---|---|
| Rôle | mode labo | mode révision |
| Contenu | cours complet, labos dans la VM, dumps hexa, terminal | cartes de révision, quiz, activités tactiles, défis chronométrés |
| Contrainte | écran large, clavier | une main, debout, hors ligne |

La même progression derrière. Ce n'est pas une version allégée : c'est le même parcours
vu sous l'angle de ce qui est faisable sur chaque appareil.

### 6.2 Synchronisation

La progression doit survivre au changement d'appareil et au nettoyage du navigateur.

Architecture attendue : front statique, sans étape de compilation, qui continue de se
lancer en local ; `localStorage` conservé comme cache hors ligne ; synchronisation vers
un service distant quand le réseau est là. Un seul utilisateur. Choisir une offre
gratuite et durable, documenter le choix, et prévoir le cas « service indisponible » —
l'application doit rester utilisable hors ligne, avec rattrapage au retour du réseau.

Application installable sur téléphone (manifeste, service worker, fonctionnement hors
ligne). Pas de magasin d'applications.

### 6.3 Mode labo : consigne, exécution réelle, vérification

Un labo se déclare dans le JSON du module, en étapes. Chaque étape porte :
- l'objectif, en une phrase ;
- ce qu'il faut faire, décrit sans donner la commande toute faite quand l'intérêt du
  labo est justement de la trouver ;
- une **commande de vérification** à exécuter dans la VM ;
- la sortie attendue, sous une forme que l'application peut contrôler quand on y
  recolle le résultat (motif, valeur, présence ou absence d'une ligne) ;
- la correction expliquée en cas d'échec, qui nomme l'erreur probable.

Les labos des modules qui servent un rendu noté doivent **ressembler à l'épreuve**.
Pour le Checkpoint B : `deploy.sh` idempotent, conteneurs non privilégiés, zones directe
et inverse, RBAC sur pool, TOTP, Apache en moindre privilège, et la preuve négative à
chaque étape.

### 6.4 Rendre l'application désirable

L'objectif annoncé : avoir envie d'y aller. Ce qui est demandé, par ordre d'impact :

1. **Une carte du parcours en arbre de compétences.** Quarante niveaux présentés en
   liste sont écrasants ; les mêmes présentés en carte, avec les niveaux verrouillés qui
   s'allument quand ils s'ouvrent, deviennent désirables. C'est l'élément central de
   l'interface, pas un ornement.
2. **Une barre de maîtrise par notion**, qui décroît avec le temps. La répétition
   espacée devient visible, donc motivante : on voit ce qui s'efface.
3. **XP et niveau de compte**, avec une courbe de progression lisible.
4. **Série quotidienne** avec un objectif de vingt minutes — et des jours de gel. Une
   série qui se casse et qui culpabilise fait arrêter : c'est l'effet inverse de celui
   recherché.
5. **Badges liés à de vrais gestes** : le premier AXFR refusé, le premier shellcode, dix
   conversions en deux minutes, le homelab complet.
6. **L'examen de fin de niveau mis en scène** comme un affrontement, avec une vraie
   tension et un enjeu visible.
7. **Retour immédiat à chaque action** : micro-animation, son court, vibration sur
   mobile. Tout doit être désactivable, et `prefers-reduced-motion` respecté.
8. **Défis chronométrés** contre son propre record.
9. **Une carte du homelab qui se construit** au fil des modules : chaque service déployé
   apparaît sur le schéma.
10. **Challenges façon CTF avec drapeau à trouver** — le programme contient Mindbreak et
    DefHack, autant s'y entraîner.
11. **Journal d'erreurs** personnel, qui alimente automatiquement les révisions.
12. **Thème sombre avec accent vif et texture**, plus un thème clair lisible dehors.

Deux garde-fous. Les animations ne bloquent jamais : une récompense qu'on attend trois
secondes devient une punition à la dixième fois. Et l'accessibilité n'est pas
optionnelle : tout au clavier et au doigt, contrastes suffisants, mouvement réductible.

### 6.5 Liaison avec les supports de cours

Chaque module pointe vers le support ESGI correspondant : fichier et numéro de page ou
de slide. Objectif : pouvoir réviser depuis le cours officiel après avoir travaillé le
module, et retrouver instantanément le module correspondant à ce qui vient d'être vu en
cours.

---

## 7. Les skills à utiliser

Déjà disponibles :

- **`frontend-design`** — direction visuelle, typographie, choix qui ne sentent pas le
  gabarit par défaut. À charger avant toute décision d'interface.
- **`dataviz`** — courbes de progression, barres de maîtrise, tableaux de bord. À
  charger avant d'écrire la première ligne de code de graphique.
- **`skill-creator`** — pour reprendre proprement `module-cyber` et `relire-module`
  plutôt que de les rafistoler.
- **`module-cyber`** et **`relire-module`** — les skills du projet, à mettre à jour selon
  le §5.1 avant toute production en série.

À chercher depuis le PC — la recherche dans le registre n'est pas accessible depuis
l'environnement où ce document a été rédigé :

```
npx skills find web design
npx skills find animation
npx skills find gamification
npx skills find pwa
```

Vérifier avant d'installer : nombre d'installations, réputation de la source,
étoiles du dépôt. Les sources officielles (`vercel-labs`, `anthropics`) d'abord.

---

## 8. Ordre de mise en œuvre

Chaque étape se valide avant la suivante. Aucune ne se saute.

1. **Mettre à jour les deux skills** selon le §5.1 : densité conservée, découpage en
   étapes, définition des termes, activité obligatoire, interdiction d'évaluer une
   notion non manipulée. `relire-module` reçoit ce dernier point comme contrôle
   prioritaire.

2. **Produire le prototype d'interface** demandé au §7 de `BRIEF_REFONTE.md` : la
   première partie de `n0-1` dans le nouveau format, au moins trois types d'activités,
   **à densité inchangée**. Le faire valider avant toute production en série.

3. **Arrêter la direction visuelle** avec `frontend-design` : palette, typographie,
   texture, animations, thèmes sombre et clair, et la maquette de la carte du parcours.
   La faire valider.

4. **Mettre à jour le schéma de `curriculum.json`** : champs `annee`, `esgi`, `statut`,
   prérequis au niveau du niveau, et déclaration des labos. Adapter `outils/valider.js`.

5. **Écrire le nouveau `curriculum.json`** avec les quarante niveaux. Conserver à
   l'identique `n0-1` à `n0-6`. Vérifier qu'aucun prérequis ne pointe vers un
   identifiant inexistant.

6. **Traiter la migration de la progression.** Elle est indexée par identifiant de
   module et par `examen-n<N>`. Renuméroter les niveaux change la signification de ces
   clés. Soit une migration, soit une remise à zéro des examens de niveau, mais
   documentée et annoncée.

7. **Revoir le déverrouillage.** Le verrouillage strictement séquentiel actuel
   (`!prec || prog["examen-n"+prec.n]`) est incompatible avec quarante niveaux et avec
   le suivi de plusieurs cours en parallèle. Ouvrir un niveau quand ses prérequis
   déclarés sont validés.

8. **Mettre en place la synchronisation et l'installation sur mobile**, avant de
   produire les modules en masse : migrer une progression existante est plus coûteux que
   de partir avec le bon socle.

9. **Produire les modules**, un par un, chacun validé avant le suivant, chacun relu avec
   `relire-module`, chacun committé.

---

## 9. Ce qui décidera de la réussite ou de l'échec

**L'arithmétique.** Le parcours complet représente de l'ordre de deux cents modules.
À trois heures par module et huit heures par semaine, c'est environ soixante-quinze
semaines de travail — soit, à partir de novembre 2026, la fin de l'alternance en
septembre 2028. C'est tenable, mais seulement en étant régulier, et seulement si les
modules `ancrage` allègent réellement la charge là où la notion est déjà vue en cours.
Il n'y a pas de marge pour les semaines perdues.

**Le piège.** Le risque principal de ce projet n'est pas qu'il soit trop ambitieux :
c'est que **construire la plateforme remplace l'apprentissage**. Deux cents modules à
concevoir, une interface à dessiner, une synchronisation à mettre en place, une carte
de parcours à animer : tout cela est plus gratifiant que de dérouler Euclide étendu au
stylo quinze fois de suite.

La règle, déjà écrite dans `PLAN.md`, reste la seule qui compte : un module généré ne
vaut rien, un module travaillé et évalué vaut tout. Règle complémentaire, à tenir :
**ne jamais avoir plus de trois modules d'avance** sur ce qui a été validé.
