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
est propre à ce navigateur et à cette machine.

## Sauvegarde

```bash
git init && git add -A && git commit -m "Formation cyber : socle initial"
```

Pousse ensuite sur un dépôt privé. Ce sont des mois de travail : ne les laisse
pas vivre dans un seul dossier non versionné.
