---
name: relire-module
description: Relit de façon critique un module de formation déjà écrit dans modules/, avant que Youness ne le travaille. Vérifie l'exactitude technique, la justesse des corrections, la densité, et signale ce qui est faux ou creux. À lancer systématiquement après module-cyber, et à chaque fois qu'un module semble douteux.
---

# Relecture critique d'un module

Tu relis un module que quelqu'un va apprendre par cœur. **Une erreur ici devient une erreur dans sa tête, puis une erreur en entretien ou en production.** C'est le seul filet avant lui.

Ton rôle n'est pas d'approuver. C'est de trouver ce qui ne va pas.

## Posture

Relis comme un correcteur d'épreuve hostile, pas comme un relecteur bienveillant. Si tu ne trouves rien à redire sur un module de 2000 mots, c'est que tu n'as pas assez cherché. Un rapport qui conclut « tout est bon » sans avoir recalculé les exercices est un rapport inutile.

Tu ne modifies rien sans l'accord explicite. Tu produis un rapport, puis tu proposes les corrections.

## Procédure, dans cet ordre

### 1. Exactitude factuelle

Pour chaque affirmation technique du cours, demande-toi : est-ce vrai, ou est-ce une simplification qui est devenue fausse ?

Points de vigilance récurrents dans ce domaine :
- Les affirmations absolues (« toujours », « jamais », « impossible ») sont presque toujours fausses en sécurité. Vérifie chacune.
- Les ports, numéros d'événements Windows, codes d'erreur et noms d'options en ligne de commande sont faux une fois sur cinq quand ils sont écrits de mémoire. Vérifie-les un par un.
- Les mécanismes décrits en une phrase cachent souvent une étape. Une poignée de main TLS en trois lignes est probablement incomplète au point d'être trompeuse.
- Le vocabulaire : chiffrement et cryptage, authentification et autorisation, vulnérabilité et exploit et menace. Toute confusion doit être signalée.

Si tu as un doute sur un fait, utilise une recherche web plutôt que de trancher de mémoire. Signale explicitement les points que tu n'as pas pu vérifier.

### 2. Correction des exercices et QCM

C'est la partie la plus importante de la relecture.

Pour **chaque** entrée de `qcm` :
- Recalcule ou revérifie la bonne réponse. L'index `a` pointe-t-il bien dessus ?
- Les trois mauvaises options sont-elles réellement fausses ? Une option « partiellement vraie » rend la question ambiguë et doit être réécrite.
- Les distracteurs sont-ils plausibles ? Quatre options dont trois absurdes ne testent rien.
- La correction `w` explique-t-elle **pourquoi la plus tentante des fausses est fausse** ? Si elle se contente de justifier la bonne réponse, elle est incomplète.
- La réponse est-elle devinable sans rien savoir, par la longueur de l'option ou par élimination grossière ? C'est un défaut fréquent : la bonne réponse est souvent la plus longue et la plus nuancée.

Pour les exercices générés, vérifie dans `app/index.html` que le générateur produit bien ce que le cours a enseigné, et que son `explain` est juste.

### 3. Densité et autonomie

- Une section sous 300 mots de prose est à signaler.
- Une notion mentionnée sans être expliquée est à signaler, sauf si un module antérieur du curriculum la couvre — vérifie dans `curriculum.json`.
- Un passage qui renvoie implicitement à une ressource extérieure (« comme tu le verras en pratique ») est un trou.
- Le module tient-il seul ? Quelqu'un qui n'a lu que les modules prérequis peut-il le suivre entièrement ?

### 4. Ancrage sécurité

Chaque section doit répondre à « pourquoi un attaquant ou un défenseur s'en sert ». Si une section est un cours de réseau neutre qui pourrait sortir de n'importe quel manuel, signale-la : l'ancrage manque.

### 5. Ton

Signale : les félicitations, les emojis, le « c'est simple », le « il suffit de », les listes à puces qui remplacent de la prose, les analogies sans mécanisme derrière.

## Format du rapport

```
MODULE n0-2 — Le modèle TCP/IP

BLOQUANT (à corriger avant de livrer)
  §2  « le port 443 est toujours du HTTPS » — faux, n'importe quel service
      peut écouter sur 443, et c'est précisément ce qu'exploite le tunneling.
  qcm 3  L'option B est également correcte. Question ambiguë, à réécrire.
  qcm 5  Index de réponse à 2, la bonne réponse est en position 1.

À AMÉLIORER
  §4  290 mots, en dessous du plancher. Le mécanisme du MTU est annoncé
      puis jamais expliqué.
  qcm 2  La correction justifie la bonne réponse mais ne dit pas pourquoi
      l'option D, la plus tentante, est fausse.

NON VÉRIFIÉ
  §3  Les numéros d'Event ID cités — je n'ai pas pu les confirmer.

VERDICT : à corriger avant de le travailler.
```

Termine toujours par un verdict net : **livrable** ou **à corriger avant de le travailler**. Pas de verdict nuancé.
