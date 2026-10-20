# Générer les modules

## La règle d'abord

Un module construit et jamais travaillé ne vaut rien. La tentation de ce projet,
c'est de générer les 42 modules en une soirée et de n'en faire aucun : construire
un système est beaucoup plus gratifiant que de faire quarante conversions binaires
de suite.

**Règle de fonctionnement : on ne génère le module suivant qu'une fois le
précédent validé par son évaluation.** Quitte à générer par lot de 2 ou 3 pour
avoir de l'avance, jamais le niveau entier.

## Un module

Dans le dossier du projet :

```bash
claude
```

```
Écris le module n0-2 en suivant la skill module-cyber. Lis d'abord curriculum.json
pour l'intitulé exact, et modules/n0-1.json pour caler le ton et la densité.
Valide avec node outils/valider.js à la fin.
```

## Un lot de modules

```
Écris les modules n0-2, n0-3 et n0-4 en suivant la skill module-cyber.
Traite-les un par un, complètement, en validant chacun avant de passer au suivant.
Ne me livre pas de squelettes à compléter.
```

Avec des agents, pour paralléliser sur un niveau entier :

```
Lance un agent par module pour n1-1 à n1-7. Chaque agent lit la skill module-cyber,
lit modules/n0-1.json comme référence de ton, écrit son module en entier et le valide.
Préviens-moi des modules qui échouent à la validation.
```

Les agents travaillent en parallèle et ne se voient pas. Relis la cohérence
d'ensemble ensuite : c'est le point faible de la génération parallèle.

## Après la génération

1. `node outils/valider.js modules/*.json` — la structure.
2. Ouvre le module et **fais ses exercices**. Une correction fausse dans un cours
   est pire que pas de cours du tout. Si tu en trouves une, corrige le JSON et
   signale le problème à Claude Code pour qu'il ne le reproduise pas.
3. `git add -A && git commit -m "module n0-2"`

## Faire évoluer la qualité

Si les modules générés sont trop superficiels, trop bavards, mal ancrés en
sécurité : ne corrige pas module par module, **modifie la skill**. C'est elle qui
produit les 42. Un quart d'heure passé sur `SKILL.md` vaut mieux que dix
corrections à l'unité.

## Les trois skills du projet

| Skill | Quand |
|---|---|
| `module-cyber` | écrire un module |
| `relire-module` | **juste après**, avant de travailler le module |
| `exercice-cyber` | un module a besoin d'un type d'exercice qui n'existe pas encore |

Le cycle complet pour un module :

```
Écris le module n0-2 avec la skill module-cyber.
```
```
Relis n0-2 avec la skill relire-module. Corrige ce qui est bloquant.
```

`relire-module` est le filet de sécurité. Un module généré et jamais relu contient
statistiquement une erreur factuelle ou une correction fausse — et tu vas
l'apprendre par cœur. Ne saute jamais cette étape.

## Skills publics à installer sur ta machine

Le registre `skills.sh` référence des skills écrits par d'autres. À tester :

```bash
npx skills find security
npx skills find teaching
npx skills add anthropics/skills@frontend-design -g -y
```

Avant d'en installer un : regarde le nombre d'installations et le dépôt d'origine.
Un skill peu installé, venant d'un auteur inconnu, s'ouvre et se lit avant de servir —
c'est un fichier d'instructions qui va piloter ton agent.
