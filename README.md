# Formation Cybersécurité

Formation personnelle, du niveau 0 au niveau expert. 7 niveaux, 42 modules.
Le contenu est à toi : des fichiers texte, sur ta machine, sans dépendance à un service.

## Lancer

Le navigateur refuse de lire des fichiers locaux depuis une page ouverte en double-clic.
Il faut un serveur, et Python en fournit un en une commande :

```bash
cd formation-cyber
python3 -m http.server
```

Puis ouvre **http://localhost:8000/app/**

## Structure

```
formation-cyber/
├── curriculum.json          le plan des 7 niveaux et 42 modules
├── modules/<id>.json        le contenu de chaque module (n0-1.json, n0-2.json…)
├── app/index.html           le moteur : rendu, exercices, évaluations, progression
├── outils/valider.js        vérifie qu'un module respecte le format
└── .claude/skills/          la consigne de rédaction utilisée par Claude Code
```

Le moteur ne contient **aucun contenu de cours**. Il lit le JSON et l'affiche.
Ajouter un module = déposer un fichier dans `modules/`. Rien d'autre à toucher.

## Générer les modules suivants

Dans ce dossier, lance Claude Code :

```bash
claude
```

Puis demande, un module à la fois :

```
Écris le module n0-2 en suivant la skill module-cyber.
```

La skill impose le format, le ton et le niveau d'exigence. Elle est dans
`.claude/skills/module-cyber/SKILL.md` — c'est le fichier à modifier si le
résultat ne te convient pas. C'est le vrai levier du projet : la qualité des
42 modules dépend de ce fichier, pas de la façon dont tu formules la demande.

Pour plusieurs modules d'affilée, voir `GENERER.md`.

## Vérifier un module

```bash
node outils/valider.js modules/n0-2.json
```

Le validateur contrôle la structure, le nombre de sections, la longueur des
textes, les générateurs d'exercices et la cohérence des QCM. Il ne juge pas
l'exactitude du contenu : ça, c'est à toi de le faire en lisant.

## Ajouter un type d'exercice

Les générateurs vivent dans `app/index.html`, dans la section GÉNÉRATEURS.
Chacun est une fonction qui retourne `{prompt, given, fields, answers, explain}`.
Copie-en un, adapte-le, inscris-le dans l'objet `GENERATORS`, puis ajoute son nom
dans la liste `GENS` de `outils/valider.js` et dans le tableau de la skill.

## Règle de progression

Un module se valide par son évaluation, pas par sa lecture. 4 bonnes réponses
sur 5. La progression est stockée dans le navigateur (`localStorage`), donc elle
est propre à ce navigateur, à cette machine et à cette adresse : `localhost:8000`
et la version publiée sur GitHub Pages ont chacune la leur. Deux moyens de la
transporter, tous deux sur la page **Sauvegarde** de l'application (lien en haut) :

- **un fichier** `progression-AAAA-MM-JJ.json` à télécharger puis à restaurer
  ailleurs, en fusionnant ou en remplaçant ;
- **la synchronisation automatique** par un Gist GitHub secret, ci-dessous.

## Synchronisation automatique par Gist GitHub

La progression est copiée dans un **Gist secret** de ton compte GitHub. Pas de
serveur ni de service payant : le navigateur parle directement à l'API GitHub.
À l'ouverture, l'application lit le Gist et fusionne ; après chaque changement,
elle envoie quelques secondes plus tard ; à la fermeture, elle envoie tout de
suite. Hors connexion, elle fonctionne normalement et envoie au retour du réseau.

Fusion, jamais d'écrasement silencieux : un module ou un examen validé d'un côté
reste validé ; une carte garde la boîte la plus basse ; un module commencé garde
l'étape la plus avancée ; pour le reste, la modification la plus récente gagne.
Le thème clair/sombre reste propre à chaque appareil.

### Créer le jeton (une seule fois)

1. Sur github.com, connecté : photo de profil → **Settings**.
2. Tout en bas à gauche : **Developer settings**.
3. **Personal access tokens** → **Tokens (classic)**.
4. **Generate new token** → **Generate new token (classic)**.
5. **Note** : `formation-cyber`. **Expiration** : une durée, par exemple 90 jours
   (il faudra en recréer un à l'échéance).
6. Dans **Select scopes**, coche **uniquement `gist`**. Rien d'autre : si le jeton
   fuit, il ne donne accès qu'à tes Gists, pas à tes dépôts.
7. **Generate token**, puis copie le jeton (`ghp_…`). GitHub ne le montrera plus.

### L'activer sur chaque appareil

Dans l'application : **Sauvegarde** → **Synchronisation automatique** → colle le
jeton → **Activer**.

- Premier appareil : l'application crée le Gist secret `formation-cyber-progression.json`.
- Autres appareils : même jeton ; l'application retrouve ce Gist par son nom et
  fusionne avec ce qui est déjà sur l'appareil.

L'état s'affiche en haut de l'écran : **Synchronisé**, **En attente** (changement
pas encore envoyé, ou hors connexion) ou **Erreur de synchro** (survole ou ouvre
la page Sauvegarde pour le détail ; le plus souvent, un jeton expiré).

### Sécurité

- Le jeton reste dans le navigateur de l'appareil (`localStorage`, clé `fc.sync`).
  Il n'est jamais dans le dépôt, ni dans le code, ni dans le Gist, ni dans un
  fichier de sauvegarde.
- Une personne qui a accès à ce navigateur peut le lire : n'active pas la
  synchronisation sur un ordinateur partagé.
- « Désactiver sur cet appareil » efface le jeton de l'appareil. Pour le rendre
  inutilisable partout, supprime-le sur GitHub (même page qu'à l'étape 3).
- Si l'application signale un jeton avec d'autres droits que `gist`, remplace-le.

## Sauvegarde

```bash
git init && git add -A && git commit -m "Formation cyber : socle initial"
```

Pousse ensuite sur un dépôt privé. Ce sont des mois de travail : ne les laisse
pas vivre dans un seul dossier non versionné.
