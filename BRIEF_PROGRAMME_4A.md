# Brief — aligner la formation sur le programme 4A

Document de directives pour Claude Code, travaillant dans `C:\Dev\formation-cyber`.
Rédigé le 6 novembre 2026, à partir des supports de cours réellement présents dans
`C:\Users\Youne\OneDrive\03_Etudes\ESGI\M1_2026-2027`.

Ce document ne contient aucun code et ne modifie rien. Il dit **ce que la formation doit
couvrir et dans quel ordre**. La conception reste à la charge de Claude Code, dans le
cadre déjà fixé par `BRIEF_REFONTE.md`, qui reste valable et prioritaire sur la forme.

---

## 1. L'objectif, tel qu'il a été posé

> Partir de zéro et aller jusqu'au niveau de ce qui est fait en cours. Tout le contenu
> de la 4e année doit être dans ma tête. La 4e année n'est pas validante : c'est une
> préparation à la 5e.

Trois conséquences qui gouvernent tout le reste :

1. **Le critère n'est pas la note, c'est la couverture.** Un module n'est fini que
   lorsque la notion correspondante du cours ESGI peut être réexpliquée et refaite sans
   support. Les examens de décembre sont des échéances utiles, pas la cible.
2. **La cible de niveau n'est plus « débutant éclairé », c'est le niveau du cours.**
   Pour la crypto, cela veut dire savoir dérouler Euclide étendu et expliquer pourquoi
   RSA naïf est cassé. Pour Linux, savoir monter un homelab Proxmox + BIND9 + Apache +
   TLS + LDAP et défendre chaque frontière de confiance.
3. **La pente part toujours de zéro.** Entre les deux, il manque aujourd'hui des étages
   entiers que l'école suppose acquis : arithmétique modulaire, architecture machine,
   administration de services. C'est l'essentiel de ce que ce document ajoute.

---

## 2. Ce que couvrent réellement les cours 4A

Inventaire établi sur les supports présents, pas sur les intitulés. C'est la référence
de niveau à atteindre.

### 2.1 Cryptographie avancée (Mme KHATI) — supports complets

L'intervenante a annoncé que le post-quantique ne serait pas réellement traité : le
module porte sur la crypto appliquée classique. Les documents préfixés `3A` sont donnés
comme **prérequis** de l'année, pas comme cours de M1 — donc à maîtriser aussi.

| Support | Notions |
|---|---|
| `A3 _ intro` (108 p.) | cryptologie vs cryptanalyse, stéganographie, Kerckhoffs, transposition, substitution mono-alphabétique, analyse fréquentielle, dénombrement et ordres de grandeur, polyalphabétique, Vernam et masque jetable, XOR |
| `3A _ chiffrement` (149 p.) | confusion/diffusion, encodage vs chiffrement, symétrique vs asymétrique, modèles d'attaquant, permutations, primitives par bloc (DES, 3DES, AES), modes opératoires (ECB et son déterminisme, CBC, malléabilité, IV, padding), sécurité des modes |
| `3A _ intégrité` (77 p.) | MAC (objectifs, modèles, contrefaçon, taille du tag), CBC-MAC, EMAC, fonctions de hachage (préimage, seconde préimage, collisions), Merkle-Damgård, fonction éponge, SHA-3, HMAC, chiffrement authentifié, GCM, CAESAR |
| `3A _ RSA` (111 p.) | complexité produit/factorisation, records de factorisation, Euclide, Bezout, Euclide étendu, indicatrice d'Euler, théorème d'Euler, génération de clés RSA, RSA naïf et ses attaques, OAEP, signature RSA naïve et ses deux attaques, PKCS#1 v1.5, PSS |
| `authentification part1` (105 p., cours 4A du 27/10) | rappels 3A, signature, authentification d'entité, tiers de confiance, AC, IGC/PKI, certificat, authentification de la personne, facteurs (connaissance, possession, inhérence), MFA, protocoles d'authentification |

Programme annoncé pour la 4A : compléter les fonctionnalités cryptographiques et
**construire un protocole sécurisé de bout en bout**.

Prérequis mathématiques que le cours utilise sans les enseigner : congruences, inverse
modulaire, exponentiation modulaire, PGCD, primalité, dénombrement, probabilité de
collision.

### 2.2 Linux — administration système et réseau avancée (M. FERRAND) — supports complets

Quatre modules, treize sessions, un projet HomeLab noté (21 h estimées, rapport PDF
individuel avec captures de preuve).

| Module | Sessions | Notions |
|---|---|---|
| A — Foundations | 1-3 | Debian 13 netinst sans interface, partitionnement manuel LVM, options de montage durcies (`noexec`, `nosuid`, `nodev`) et ce qu'elles ne bloquent pas, frontière syscall/noyau, FHS, rwx et octal, bits spéciaux (setuid, setgid, sticky), ACL et piège du masque, sudo granulaire et sa journalisation, utilisateurs de service, LVM (PV/VG/LV, `lvextend -r`, rituel de rétrécissement, snapshots copy-on-write, `tune2fs`, `fsck`) |
| B — Networking, SSH, hypervisor | 4-6 | OSI et TCP/IP en pratique, sockets et ports, NAT et table d'état, port forwarding, `ip`/`ss`/`tcpdump`/`ip neigh`, `nsswitch.conf` et `resolv.conf`, `systemd-networkd` persistant, SSH (clés ed25519, agent, `~/.ssh/config`, `ProxyJump`, `LocalForward`, durcissement `sshd_config.d`, rituel `sshd -t`, TOFU vs pinning, `rsync --dry-run`), Checkpoint A, type-1 vs type-2 vs conteneurs, Proxmox VE |
| C — Proxmox, conteneurs, services | 7-10 | historique de l'isolation (chroot → namespaces → cgroups → LXC → OCI), venv vs LXC vs Docker vs VM, namespaces (mnt, net, pid, user, uts, ipc), cgroups, LXC non privilégié et mapping UID, bridge `vmbr0` et paires veth, conventions d'ID Proxmox, `pct`/`qm`, templates et clones liés/complets, snapshots et `vzdump`, RBAC PVE (user, group, role, path), tokens API, TOTP, DNS (récursif vs autoritaire, hiérarchie, DNSSEC/DoT/DoH, collisions de noms, RCODEs), BIND9 (`allow-query`, `allow-recursion`, `allow-query-cache`, `allow-transfer`), zones directe et inverse, SOA et sérial, NOTIFY et AXFR/IXFR, HTTP (anatomie, méthodes, codes, statelessness), Apache (vhosts, MPM, modèle maître/worker, `Require ip`/`Require user`, htpasswd, `mod_status`) |
| D — Trust, sharing, identity | 11-13 | PKI (clé privée, clé publique, CSR, certificat, certificat d'AC), chaîne de confiance, SAN vs CN, AC de laboratoire avec `openssl`, terminaison TLS et zones de confiance, Nginx en reverse proxy, cycle de vie des certificats (CRL/OCSP), Samba vs NFS (où chaque protocole vérifie l'identité, `root_squash`, montages hard/soft), OpenLDAP (arbre DIT, DN/RDN, LDIF, objectClass, posixAccount, `olcAccess` et l'ordre des règles, NSS/PAM/SSSD) |

Examen final : infrastructure complète notée sur 20, avec entretien de défense et une
panne injectée.

### 2.3 Sécurité des systèmes radio (M. ZAITSEV) — support visuel

Support « Radio Hacking — From Photon to Data », 33 pages majoritairement
graphiques : électromagnétisme, induction, champ, onde, particules, spectre, radio,
antennes, modulation, SDR, réseaux mobiles (GSM 850 MHz, GPRS 900 MHz, UMTS 1,8 GHz,
LTE 2,2 GHz, NR 3,5 GHz) et leurs attaques, RFID LF ~125-135 kHz, NFC HF 13,56 MHz,
sans contact et ses attaques.

TP annoncés : écoute FM avec RTL-SDR (gqrx, SDRangel), décodage FM sous GNU Radio,
interception de talkie-walkie, analyse de signal 433 MHz avec URH, crack de Mifare
Classic avec ACR122 + libnfc/mfoc/mfdread. Le TP cartes sans contact est déjà fait.

### 2.4 Sécurité avec Python (M. ROBIN, T2) — support complet

76 slides, trois modules : hygiène de projet (Poetry, structure, pre-commit, pytest) ;
défensif 1 (Scapy : sniffing, DNS, ARP, graphiques, IDS/IPS maison) ; défensif 2
(triage de malware : isolation, empreintes et type, entropie, strings et IOC,
dissection PE/ELF, règles YARA, LLM comme assistant, rapport de triage) ; offensif
(requests, fuzzing d'endpoints, sessions et cookies, CAPTCHA simple, pwntools,
chaînage d'attaque). Trois TP auto-corrigés, échéance 30/11/2026.

### 2.5 Matières sans aucun support récupéré

| Matière | Ce qu'il faut présumer | Risque |
|---|---|---|
| Assembleur avancé (M. GRAU) | x86-64 : registres, mémoire, pile, conventions d'appel, jeu d'instructions, débogage | Élevé : un module écrit à l'aveugle risque de viser une autre architecture ou un autre niveau |
| Rust — programmation système et réseau (M. BOURY) | ownership, emprunts, durées de vie, Cargo, sockets, concurrence | Élevé : le cours peut être très orienté systèmes embarqués ou très orienté réseau |
| Windows Active Directory (M. OUAKI) | domaine, forêt, OU, GPO, Kerberos, groupes privilégiés, PowerShell | Moyen : le socle du domaine est stable |

**À faire avant de rédiger ces modules** : récupérer les supports sur l'intranet, ou à
défaut les notes prises en cours. Règle déjà posée : se baser en priorité sur les
supports ESGI, et signaler toute notion ajoutée qui n'y figure pas.

### 2.6 Cours électifs — examen unique le 18 décembre 2026, QCM de 40 questions par matière

Le plan officiel des cinq séances est dans
`Listing matières 4A INFRA T1 Filières SI_ SRC.pdf` (document du projet).

- **Audit de code** : démarche d'audit, périmètre, surface d'attaque, frontières de
  confiance, OWASP et CWE, validation des entrées, injections, contrôle d'accès,
  désérialisation, SSRF, logique métier, sources/sinks/sanitization, taint analysis,
  SAST et Semgrep, intégration CI/CD, faux positifs, CVSS, rédaction d'un finding.
- **Recon — stratégie d'exploration** : règles d'engagement, OPSEC, passif vs actif,
  DNS, WHOIS/RDAP, certificats, archives Web, dépôts publics, métadonnées,
  sous-domaines, IP, ASN, cloud, dépendances externes, découverte d'hôtes,
  fingerprinting, énumération, corrélation et priorisation.
- **FinOps** : CapEx/OpEx, modèles de facturation, coûts cachés, tagging, allocation,
  showback/chargeback, KPI, rightsizing, autoscaling, stockage chaud/froid, coûts
  d'egress, forecast, réservations, unit economics, gouvernance.
- **Power BI** (M. RHODES) : sources et import, qualité des données, KPI, Power Query
  (nettoyage, typage, jointures), modélisation (relations, cardinalité, modèle en
  étoile, table de calendrier, granularité), DAX (colonnes calculées vs mesures,
  contexte de filtre, `CALCULATE`, indicateurs temporels), construction et publication
  d'un tableau de bord.
- **Management de l'innovation** : innovation incrémentale vs de rupture, cycle
  d'adoption, veille (sources, signaux faibles, brevets, open source), du cas d'usage
  au PoC, Go/No-Go, transfert de technologie, propriété intellectuelle, conduite du
  changement, mesure de la valeur.

---

## 3. Écart avec le curriculum actuel

`curriculum.json` v1 compte 7 niveaux et 42 modules, construits selon une logique de
métier (fondations → systèmes → scripting → fondamentaux → offensif → défensif →
spécialisation). Trois modules sont écrits : `n0-1`, `n0-2`, `n0-3`.

### 3.1 Ce qui est manquant

| Manque | Cours 4A concerné |
|---|---|
| Mathématiques de la cryptographie (modulaire, Euclide étendu, Bezout, φ d'Euler, théorème d'Euler, exponentiation modulaire, dénombrement, collisions) | Crypto : indispensable, utilisé sans être enseigné |
| Architecture machine et assembleur. Aujourd'hui l'assembleur n'apparaît qu'au module `n6-3` (rétro-ingénierie), dernier niveau | Assembleur avancé, qui est un cours du T1 |
| Rust, et plus largement la programmation système | Rust : absent du curriculum |
| LVM, options de montage, FHS, `fstab` : `n1-4` traite les systèmes de fichiers sans LVM ni snapshots | Linux module A, Checkpoint A |
| Virtualisation, Proxmox, LXC, namespaces, cgroups, mapping UID, réseau virtuel | Linux modules B et C, Checkpoint B |
| Administration de services : BIND9 autoritaire, Apache, Nginx, TLS avec AC propre, Samba, NFS, OpenLDAP. Le curriculum enseigne DNS comme protocole et comme cible d'attaque, jamais comme service à configurer | Linux modules C et D, projet HomeLab, rendu du 20/12 |
| SSH comme discipline (clés, config, tunnels, `ProxyJump`, durcissement, TOFU/pinning) | Linux module B |
| Profondeur crypto : un seul module `n3-1` « Cryptographie appliquée » pour ce que Mme Khati déroule sur quatre supports | Crypto |
| Sécurité radio, SDR, RFID/NFC | Sécurité des systèmes radio : absent |
| Scapy, triage de malware, YARA, entropie, PE/ELF, pwntools, hygiène de projet Python | Sécurité avec Python |
| SAST, taint analysis, CWE, CVSS, rédaction de finding | Audit de code |
| FinOps, Power BI, management de l'innovation | Trois électifs évalués le 18/12 |
| Lien avec les rendus notés (Checkpoints, TP, projets) | Aucun module ne pointe vers un livrable réel |

### 3.2 Ce qui est à conserver tel quel

Le niveau 0 est juste et sert directement trois cours : le binaire et l'hexadécimal
alimentent l'assembleur et la crypto, l'adressage et les sous-réseaux alimentent le
module B de Linux, DNS et TCP/UDP alimentent Recon. Les six modules `n0-1` à `n0-6`
restent inchangés, avec les mêmes identifiants : la progression déjà enregistrée dans
le navigateur doit survivre.

Les niveaux offensif, défensif et spécialisation de la v1 restent pertinents, mais ils
ne relèvent pas du programme 4A. Ils constituent l'axe 5e année et passent **après** la
couverture 4A.

### 3.3 Trois problèmes de structure, indépendants du contenu

**a) Le verrouillage séquentiel est incompatible avec quatre cours en parallèle.**
Aujourd'hui un niveau ne s'ouvre que si l'examen du niveau précédent est validé
(`app/index.html`, fonction d'ouverture de niveau : `!prec || prog["examen-n"+prec.n]`).
Avec une couverture 4A, les besoins arrivent simultanément : Linux et les électifs en
novembre-décembre, la crypto en fin de semestre, Python en T2. Une chaîne linéaire
impose d'avoir fini les mathématiques avant de toucher à LVM.

**b) Le volume.** La couverture complète représente de l'ordre de 70 à 80 modules. À
raison de 6 à 10 h par semaine et d'un module traité en entier avant le suivant, c'est
l'équivalent de l'année scolaire complète, sans marge. Le plan n'est tenable que si
tous les modules ne pèsent pas le même poids.

**c) Les deux skills se contredisent.** `BRIEF_REFONTE.md` demande explicitement de
supprimer la contrainte de longueur et de passer à « une idée par étape, activité
obligatoire avant de continuer ». `.claude/skills/module-cyber/SKILL.md` exige toujours
« 400 à 600 mots de prose par section » et « 4 à 6 sections ». C'est exactement la cause
identifiée du défaut signalé trois fois. Le prototype de refonte demandé au §7 du brief
précédent n'a pas encore été validé. **Aucun module nouveau ne doit être produit en
série avant que ce conflit soit tranché et le format validé.**

---

## 4. Structure proposée

Deux axes, un seul système de niveaux numériques pour ne rien casser dans le moteur.

- **Axe socle** : ce que l'école suppose acquis. Niveaux 0 à 2.
- **Axe matières** : un bloc par cours ESGI, qui s'arrête au niveau exigé par ce cours.
  Niveaux 3 à 13.
- **Axe 5e année** : l'ancien offensif / défensif / spécialisation, renuméroté ensuite.

Chaque module porte un champ nouveau, à ajouter au schéma de `curriculum.json` :
`esgi`, qui nomme le cours servi et, le cas échéant, la session ou le livrable. C'est ce
champ qui permet de répondre à la seule question qui compte en cours d'année : « ce
qu'on a vu aujourd'hui, c'est quel module ? »

### N0 — Socle machine et réseau *(inchangé, 6 modules)*

`n0-1` binaire et hexadécimal · `n0-2` modèle TCP/IP · `n0-3` adressage IP et
sous-réseaux · `n0-4` TCP et UDP en détail · `n0-5` DNS, DHCP, ARP, NAT · `n0-6`
routage et commutation.
Sert : Assembleur, Crypto, Linux B, Recon.

### N1 — Mathématiques de la cryptographie *(nouveau)*

1. Arithmétique modulaire : congruences, classes, opérations, inverse modulaire.
2. Exponentiation modulaire rapide, et pourquoi elle rend RSA calculable.
3. PGCD, algorithme d'Euclide, Euclide étendu, théorème de Bezout.
4. Nombres premiers, indicatrice d'Euler, théorème d'Euler et petit théorème de Fermat.
5. Dénombrement, ordres de grandeur, probabilité de collision et paradoxe des
   anniversaires, lecture d'une taille de clé.

Sert : Crypto (`3A _ RSA` et tout le raisonnement de sécurité). Chaque notion doit se
pratiquer au stylo sur des nombres petits avant toute formule générale.

### N2 — Architecture machine et assembleur *(nouveau)*

1. Processeur, mémoire, registres, cycle d'exécution.
2. Jeu d'instructions x86-64 : arithmétique, mouvements, sauts, drapeaux.
3. La pile, les appels de fonction, les conventions d'appel.
4. Du source au binaire : compilation, édition de liens, format ELF, sections.
5. Lire et déboguer un binaire : `objdump`, `gdb`, correspondance source/assembleur.

Sert : Assembleur avancé, et prépare la rétro-ingénierie de 5e année.
**À confirmer sur support** : architecture et assembleur enseignés (x86-64, ARM, autre),
syntaxe (Intel ou AT&T), outillage imposé.

### N3 — Linux : système *(reprend et complète `n1-1` à `n1-4`)*

1. Ligne de commande : navigation, recherche, filtres, tubes, redirections.
2. Permissions : rwx et octal, propriétaire/groupe/autres, ordre de vérification,
   setuid, setgid, sticky bit, ACL et piège du masque.
3. Identités et délégation : utilisateurs, groupes, sudo granulaire, journalisation,
   utilisateurs de service sans shell.
4. Processus, services, démarrage : `ps`, `ss`, systemd, `journalctl`.
5. Systèmes de fichiers, FHS, montages et durcissement : `noexec`, `nosuid`, `nodev`,
   ce qu'ils bloquent et ce qu'ils ne bloquent pas, `fstab`, `findmnt`.
6. LVM : PV/VG/LV, extension à chaud, rituel de rétrécissement, snapshots
   copy-on-write et rollback, `fsck`, `tune2fs`.

Sert : Linux module A, Checkpoint A.

### N4 — Linux : réseau et accès distant *(nouveau)*

1. Réseau sous Debian : `ip`, `ss`, `tcpdump`, `ip neigh`, diagnostic bas en haut.
2. Configuration persistante : `systemd-networkd`, DHCP vs statique, conflits.
3. Résolution côté client : `nsswitch.conf`, `/etc/hosts`, `resolv.conf`, `getent`.
4. NAT et redirection de ports : ce que NAT réécrit, table d'état, règle publiée.
5. SSH : clés ed25519, agent, `~/.ssh/config`, durcissement, rituel `sshd -t`, TOFU vs
   pinning.
6. Tunnels : `LocalForward`, `RemoteForward`, `ProxyJump`, `scp`, `rsync --dry-run`.

Sert : Linux module B, Checkpoint A.

### N5 — Virtualisation et conteneurs *(nouveau)*

1. Type-1, type-2, conteneurs : ce qui est partagé et ce qui ne l'est pas, KVM et VT-x.
2. Proxmox VE : `pct`, `qm`, conventions d'ID, templates, clones liés et complets,
   snapshots, `vzdump`.
3. Namespaces et cgroups : mnt, net, pid, user, uts, ipc ; quotas CPU et mémoire ; ce
   qui n'est pas une frontière de sécurité.
4. LXC non privilégié : mapping UID, preuve par observation, surface de noyau partagée.
5. Réseau virtuel : bridge `vmbr0`, paires veth, flux inter-conteneurs.
6. RBAC Proxmox : user, group, role, path, pools, tokens API, TOTP et codes de secours.

Sert : Linux modules B et C, Checkpoint B.

### N6 — Services réseau à administrer *(nouveau)*

1. BIND9 en résolveur : récursif vs autoritaire, ACL, `allow-recursion` et voisines.
2. Zones DNS : SOA et sérial, zone directe, zone inverse et PTR, types
   d'enregistrements, lecture d'une réponse `dig` (flags, RCODE), NOTIFY et AXFR/IXFR,
   restriction des transferts.
3. HTTP et Apache : anatomie d'un échange, méthodes, codes, vhosts, MPM, modèle
   maître/worker, `Require ip` et `Require user`, htpasswd, `mod_status`.
4. TLS avec sa propre autorité : clé privée, CSR, certificat, SAN, `openssl`,
   vérification stricte, Nginx en terminaison, cycle de vie et révocation.
5. Partage de fichiers : Samba et NFS, où chaque protocole vérifie l'identité,
   `root_squash`, montages hard et soft.
6. Annuaire OpenLDAP : arbre DIT, DN et RDN, LDIF, objectClass, `olcAccess` et l'ordre
   des règles, intégration NSS/PAM/SSSD, une identité qui n'existe que dans l'annuaire.

Sert : Linux modules C et D, projet HomeLab, rendu final du 20/12.

### N7 — Cryptographie symétrique *(remplace une partie de `n3-1`)*

1. Vocabulaire et modèles : Kerckhoffs, confusion et diffusion, encodage vs
   chiffrement vs hachage, modèles d'attaquant.
2. Chiffrements historiques et cryptanalyse : transposition, substitution,
   analyse fréquentielle, polyalphabétique, Vernam et masque jetable.
3. Primitives par bloc : permutations, DES, 3DES, AES, ce que signifie leur sécurité.
4. Modes opératoires : ECB et son déterminisme, CBC, IV, padding, malléabilité.
5. Intégrité symétrique : MAC, contrefaçon, taille du tag, CBC-MAC, EMAC, HMAC.
6. Fonctions de hachage : préimage, seconde préimage, collisions, Merkle-Damgård,
   éponge, SHA-3, usages légitimes et usages abusifs.
7. Chiffrement authentifié : pourquoi chiffrer ne suffit pas, GCM, AEAD.

Sert : Crypto, supports `3A _ chiffrement` et `3A _ intégrité`.

### N8 — Cryptographie asymétrique, signature et authentification *(nouveau)*

1. Chiffrement asymétrique : le problème de l'échange de clé, factorisation et
   complexité, records.
2. RSA : génération des clés, chiffrement et déchiffrement déroulés à la main.
3. RSA naïf et ses attaques, encapsulation OAEP, cas d'usage réels.
4. Signature : objectifs de l'attaquant, modèles, signature RSA naïve et ses attaques,
   PKCS#1 v1.5, PSS.
5. Authentification d'entité : tiers de confiance, AC, IGC/PKI, contenu d'un
   certificat, chaîne de confiance et ce qui arrive si l'AC est corrompue.
6. Authentification de la personne : les trois facteurs, MFA, TOTP, protocoles
   d'authentification.
7. Protocole de bout en bout : composer les briques précédentes, lire TLS comme un
   assemblage.

Sert : Crypto, supports `3A _ RSA` et `authentification part1`, et le programme 4A
annoncé. Le module 5 recoupe N6-4 (AC de laboratoire) : l'un donne la théorie, l'autre
la pratique, et ils doivent se citer mutuellement.

### N9 — Windows et Active Directory *(reprend `n1-5` et `n1-6`)*

1. Windows en profondeur : registre, services, processus, journaux d'événements,
   jetons d'accès.
2. Active Directory : domaine, forêt, OU, schéma, rôle du DNS.
3. GPO et administration : stratégies, délégations, groupes privilégiés.
4. Kerberos : tickets, TGT, service, et pourquoi c'est la cible favorite.
5. Administration PowerShell de l'annuaire : objets, pipeline, interrogation.

Sert : Windows Active Directory. **À confirmer sur support.**

### N10 — Programmation pour la sécurité *(reprend le niveau 2 de la v1 et l'étend)*

1. Bash au-delà des one-liners.
2. Expressions régulières et extraction d'IOC.
3. Git et code présentable.
4. Python : projet propre — structure, venv et Poetry, pytest, pre-commit.
5. Python réseau : sockets, puis Scapy — forger, sniffer, lire DNS et ARP.
6. Un IDS/IPS maison : détection, seuils, faux positifs, rapport.
7. Triage de malware : isolation, empreintes, type, entropie, strings et IOC,
   dissection PE/ELF, règles YARA, rapport de triage.
8. Python offensif : requests, sessions et cookies, fuzzing d'endpoints, pwntools,
   chaînage.
9. PowerShell : objets, pipeline, interrogation des journaux.

Sert : Sécurité avec Python (TP du 30/11), Audit de code, Windows AD.
Contrainte déjà posée pour les rendus notés : écrire le code soi-même, donc les modules
décrivent ce qu'il faut faire étape par étape, sans bloc à copier.

### N11 — Rust : programmation système et réseau *(nouveau)*

1. Pourquoi Rust existe : sûreté mémoire sans ramasse-miettes.
2. Ownership, emprunts, durées de vie.
3. Types, enums, `Result` et `Option`, gestion d'erreurs.
4. Cargo, modules, tests.
5. Réseau et concurrence : sockets, threads, async.

Sert : Rust — programmation système et réseau. **À confirmer sur support.**

### N12 — Sécurité des systèmes radio *(nouveau)*

1. Du champ à l'onde : électromagnétisme, induction, propagation, fréquence et longueur
   d'onde, décibels.
2. Spectre et antennes : bandes, allocation, gain, adaptation.
3. Modulations : AM, FM, ASK, FSK, PSK, et à quoi ressemble chacune à l'écran.
4. SDR en pratique : RTL-SDR, gqrx, GNU Radio, URH, de la capture au décodage.
5. Réseaux mobiles : GSM, GPRS, UMTS, LTE, NR — bandes, architecture, attaques.
6. Sans contact : RFID 125 kHz et NFC 13,56 MHz, Mifare Classic et ses clés d'usine,
   Calypso, libnfc, mfoc, limites des attaques.

Sert : Sécurité des systèmes radio et ses TP. Le TP cartes sans contact est déjà fait :
le module 6 doit s'appuyer sur ce qui a été observé plutôt que le réintroduire à zéro.

### N13 — Audit de code et sécurité applicative *(étend `n3-5`)*

1. OWASP Top 10 compris : mécanisme, code vulnérable, correctif réel.
2. Démarche d'audit : périmètre, architecture, surface d'attaque, points d'entrée,
   frontières de confiance, CWE.
3. Suivre les données : sources, sinks, sanitization, taint analysis, flux de contrôle,
   distinguer potentiel, exploitable et faux positif.
4. SAST : analyse par règles et sémantique, Semgrep, intégration CI/CD, couverture.
5. De la vulnérabilité à la remédiation : impact, CVSS, priorisation, correctif,
   finding, rapport destiné aux développeurs.

Sert : élective Audit de code (QCM du 18/12).

### N14 — Reconnaissance *(étend `n4-1`)*

1. Penser la reconnaissance : objectifs, règles d'engagement, OPSEC, démarche
   itérative.
2. Reconnaissance passive et OSINT : DNS, WHOIS/RDAP, certificats, archives Web, dépôts
   publics, métadonnées.
3. Cartographier la surface : domaines et sous-domaines, IP, ASN, services, cloud,
   dépendances externes.
4. Reconnaissance active : découverte d'hôtes, ports, fingerprinting, énumération,
   bruit généré.
5. Corrélation et stratégie : graphes de relations, priorisation, restitution.

Sert : élective Recon (QCM du 18/12).

### N15 — Électifs hors cybersécurité : cloud, données, innovation *(nouveau)*

Trois matières évaluées le 18 décembre qui ne relèvent pas de la cybersécurité. Elles
méritent une couverture honnête, pas un module de prestige.

1. Économie du cloud : CapEx et OpEx, modèles de facturation, coûts cachés.
2. FinOps : tagging, allocation, showback et chargeback, KPI, budgets et alertes.
3. Optimisation : rightsizing, ressources inutilisées, autoscaling, stockage
   chaud/froid, coûts d'egress.
4. Prévision : forecast, anomalies, réservations, unit economics.
5. Power BI : import, Power Query, modèle en étoile, DAX et contexte de filtre,
   tableau de bord.
6. Management de l'innovation : veille, signaux faibles, PoC et Go/No-Go, transfert,
   conduite du changement.

### Après la 4e année

Les niveaux offensif, défensif et spécialisation de la v1 (`n4-*`, `n5-*`, `n6-*`)
restent au plan, renumérotés à la suite. Ils sont l'axe 5e année et la cible métier.
Ne pas les supprimer : plusieurs de leurs modules sont la suite naturelle de ce qui
précède (exploitation web après audit de code, attaques AD après N9, forensic après le
triage de malware).

---

## 5. Décisions à prendre avant d'écrire une ligne

Quatre questions, dans cet ordre. Aucune ne se devine.

**1. Déverrouillage.** Le verrouillage séquentiel actuel rend le plan inapplicable.
Proposition : ouvrir un niveau dès que ses prérequis déclarés sont validés, et non le
niveau précédent. Cela demande de passer les prérequis au niveau du niveau, pas
seulement du module, et de modifier la fonction d'ouverture dans `app/index.html`.
Alternative plus simple : garder la chaîne mais réordonner les niveaux selon le
calendrier. Elle coûte moins cher et sert moins bien l'objectif.

**2. Deux poids de modules.** Tout n'a pas besoin d'un chapitre complet. Proposition :
deux statuts déclarés dans `curriculum.json`.
- `complet` : notion nouvelle, construite depuis zéro, format de la refonte.
- `ancrage` : notion déjà vue en cours ou déjà pratiquée en TP. Le module ne réenseigne
  pas : il fait manipuler, corrige, et produit les cartes de révision. Nettement plus
  court.
Sans cette distinction, 75 modules de chapitre complet ne tiennent pas dans l'année.

**3. Ordre de travail.** Deux ordres cohérents, à trancher explicitement.
- *Par dépendances* : N1 et N2 d'abord, puis les matières. Plus solide, plus lent à
  produire un effet visible en cours.
- *Par échéances* : N3 à N6 d'abord (Linux, Checkpoint B le 15/11, rendu final le
  20/12), puis N13 à N15 (QCM du 18/12), puis N1, N7 et N8 (crypto), puis N10 (TP Python
  du 30/11 — en réalité à remonter), puis le reste.
Comme la 4e année n'est pas validante, l'ordre par dépendances sert mieux l'objectif
déclaré. Mais les rendus Linux sont notés et déjà en retard d'un checkpoint : un
compromis raisonnable est de traiter N3 à N6 en premier (ils servent un projet réel en
cours), puis de revenir à N1, N7, N8.

**4. Matières sans support.** N2 (assembleur), N9 (AD) et N11 (Rust) ne peuvent pas
être écrits sérieusement sans les supports. Soit ils sont récupérés, soit ces niveaux
sont écrits en version générique assumée et explicitement signalée comme telle.

---

## 6. Mise en œuvre

Ordre strict. Chaque étape se valide avant la suivante.

1. **Trancher le conflit de format.** Produire le prototype demandé au §7 de
   `BRIEF_REFONTE.md` (première partie de `n0-1` dans le nouveau format, au moins trois
   types d'activités), le faire valider, puis réécrire `module-cyber` en supprimant la
   contrainte des 400 à 600 mots et en y intégrant les principes du §3 de ce brief-là.
   Tant que ce n'est pas fait, écrire de nouveaux modules revient à produire en série le
   défaut déjà signalé trois fois.

2. **Mettre à jour le schéma de `curriculum.json`** : ajouter `esgi` (cours servi,
   session ou livrable) et `statut` (`complet` ou `ancrage`) sur chaque module, et
   `prereq` au niveau du niveau. Adapter `outils/valider.js` en conséquence.

3. **Écrire le nouveau `curriculum.json`** avec les niveaux ci-dessus. Conserver à
   l'identique les identifiants `n0-1` à `n0-6`. Vérifier qu'aucun `prereq` ne pointe
   vers un identifiant inexistant, et que les trois modules déjà écrits restent
   validables.

4. **Vérifier la progression enregistrée.** La progression vit dans `localStorage` et
   est indexée par identifiant de module et par `examen-n<N>`. Renuméroter des niveaux
   change la signification des clés `examen-n<N>`. Prévoir le cas : soit une migration,
   soit l'acceptation documentée d'une remise à zéro des examens de niveau.

5. **Produire les modules dans l'ordre arrêté à la décision 3**, un par un, chacun
   validé avant le suivant, chacun relu avec `relire-module`, chacun committé.

6. **Relier les modules aux livrables réels.** Un module qui sert le Checkpoint B doit
   le dire, et son labo doit ressembler à l'épreuve : `deploy.sh` idempotent, CT
   non privilégiés, zones directe et inverse, RBAC sur pool, TOTP, Apache en moindre
   privilège, et surtout la **preuve négative** — montrer que ce qui doit être refusé
   l'est, dans le bon contexte d'identité.

---

## 7. Deux points de méthode qui pèsent plus que le plan

**La preuve négative est la signature de ce semestre.** Elle revient dans chaque
énoncé de Linux : prouver qu'un `cp` dans `/tmp` est refusé, qu'une requête AXFR hors
périmètre est rejetée, que `www-data` ne peut pas écrire, que Kim ne peut pas créer de
conteneur, qu'un `uid 0` client devient `nobody`. Les exercices de la formation doivent
reprendre cette forme : non pas « est-ce que ça marche », mais « montre que ce qui doit
échouer échoue, et nomme la couche qui refuse ». C'est aussi le réflexe que l'entretien
de défense de l'examen final évalue.

**Le risque principal n'est pas le contenu, c'est de construire la plateforme au lieu
d'apprendre.** Il a déjà été signalé une fois. Soixante-quinze modules à concevoir, un
moteur à refondre, un schéma à migrer : tout cela est plus agréable que de dérouler
Euclide étendu au stylo quinze fois. La règle de `PLAN.md` reste la seule qui compte —
un module écrit n'est rien, un module travaillé et évalué est tout.
