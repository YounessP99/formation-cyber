---
name: exercice-cyber
description: Ajoute un nouveau type d'exercice interactif au moteur de la formation (app/index.html). À utiliser quand un module a besoin d'un exercice que les générateurs existants ne couvrent pas : lire un en-tête de paquet, repérer une ligne malveillante dans un log, compléter une règle de pare-feu, décoder une trame.
---

# Ajouter un générateur d'exercice

Le moteur `app/index.html` produit les exercices ; les fichiers de `modules/` ne contiennent que le nom du générateur à appeler. Un nouveau type d'exercice est donc une fonction JavaScript, jamais du contenu dans le JSON.

## Le contrat

Un générateur est une fonction sans argument qui retourne un objet :

```js
function makeMonExercice(){
  // … tirage aléatoire ici …
  return {
    prompt: "La consigne, en une phrase.",
    given:  "L'énoncé mis en évidence (monospace, couleur accent).",
    fields: [ {k:"cle", label:"Libellé du champ", ph:"placeholder"} ],
    answers: { cle: "la réponse attendue, en chaîne" },
    norm: (v,k) => String(v).trim(),   // normalisation avant comparaison
    explain(ok){ return "<p>…</p>"; }  // correction, HTML
  };
}
```

Puis inscription dans l'objet déjà présent :

```js
const GENERATORS={convBin:makeConvBin, …, monExercice:makeMonExercice};
```

Enfin, deux mises à jour obligatoires sinon le validateur rejettera les modules qui s'en servent :
1. ajouter le nom dans la liste `GENS` de `outils/valider.js` ;
2. ajouter une ligne au tableau des générateurs dans `.claude/skills/module-cyber/SKILL.md`.

## Règles de conception

**L'aléatoire doit être réel.** Un générateur qui tire parmi cinq énoncés figés n'est pas un générateur, c'est une liste. L'intérêt du format est que l'exercice soit infini : tire les valeurs, construis l'énoncé à partir d'elles, et calcule la réponse — ne la stocke jamais en dur à côté d'un énoncé.

**La réponse se calcule, elle ne se cherche pas.** Le code doit dériver `answers` des valeurs tirées. S'il faut une table de correspondance (noms de protocoles, Event IDs), elle est en haut du générateur et la réponse en est extraite, jamais recopiée.

**`explain` redéroule le raisonnement.** C'est la partie qui a le plus de valeur pédagogique. Elle montre le calcul ligne par ligne, avec les mêmes valeurs que l'énoncé tiré. Une correction qui affiche seulement la bonne réponse ne sert à rien. Utilise un bloc `<pre>` avec `<b>` pour les valeurs clés et `<span class='c'>` pour les commentaires.

**La normalisation est permissive sur la forme, stricte sur le fond.** On accepte les espaces, la casse, un préfixe `0x` optionnel. On n'accepte pas une réponse approximative. `norm` reçoit `(valeur, clé)` pour traiter chaque champ différemment.

**Les champs restent peu nombreux.** Au-delà de quatre, l'exercice devient un formulaire et décourage la répétition.

## Types à écrire selon les besoins du curriculum

| Niveau | Générateur utile | Ce qu'il doit tirer au sort |
|---|---|---|
| n0-2 / n0-4 | `header` | un en-tête IP ou TCP en hexa, à décoder champ par champ |
| n0-4 | `flags` | une combinaison de drapeaux TCP, à nommer et interpréter |
| n0-5 | `resolution` | une chaîne de résolution DNS à ordonner |
| n0-6 | `routage` | une table de routage et une destination, à router |
| n1-2 | `permissions` | un mode octal ou symbolique à traduire, SUID inclus |
| n2-2 | `regex` | un texte et une cible d'extraction, la regex à écrire |
| n3-1 | `primitive` | un besoin décrit, la primitive crypto à choisir |
| n5-1 | `logline` | un extrait de log, la ligne malveillante à désigner |

Pour un exercice où la réponse est une regex ou une commande, il existe plusieurs écritures correctes : teste alors la réponse par exécution (appliquer la regex à un échantillon et comparer les captures) plutôt que par comparaison de chaînes. C'est plus de travail et c'est le seul moyen honnête.

## Vérification avant de livrer

1. Appeler le générateur une centaine de fois et vérifier qu'aucun tirage ne produit d'énoncé dégénéré (valeur nulle, réponse triviale, division par zéro).
2. Vérifier à la main trois tirages complets, calcul compris.
3. `node outils/valider.js modules/*.json` doit rester vert.
4. Ouvrir la page et faire l'exercice soi-même, juste puis faux, pour voir les deux corrections.
