# Cahier des charges — refonte de la formation

Ce document est destiné à Claude Code. Il fixe les objectifs et les contraintes.
La conception (déroulé, activités, textes, interface) est à ta charge : réfléchis-y,
propose, teste dans le navigateur, et itère avec Youness.

---

## 1. Le constat

Youness a travaillé les modules n0-1 à n0-3. Son retour, répété trois fois :

- Les explications sont **longues mais pas claires**. On passe d'un coup de « rien » à « tout ».
- Plusieurs idées et plusieurs mots nouveaux arrivent dans le même paragraphe.
- Les questions donnent l'impression de porter sur des choses **jamais vues dans le module**,
  parce qu'elles portent sur des notions mentionnées en passant, jamais pratiquées.
- C'est **trop passif** : lire, puis cocher. Il veut manipuler.

Causes identifiées : la skill `module-cyber` exige 400 à 600 mots par section (elle pousse
vers la densité au lieu de la clarté) et demande d'ancrer la sécurité partout (ce qui ajoute
du vocabulaire avant que la base soit comprise).

---

## 2. Le public

Un adulte motivé qui part **de zéro en informatique**. Il ne connaît pas le vocabulaire.
Il comprend vite quand on lui montre, décroche quand on lui récite.
Il est par ailleurs en Mastère Cybersécurité : le niveau visé à terme reste élevé.
Ce qui change, c'est la pente : douce, régulière, sans marche.

---

## 3. Les principes pédagogiques (non négociables)

1. **Une idée à la fois.** Une étape du module = une seule idée. Si une étape introduit deux
   notions, la couper en deux.
2. **Les mots nouveaux d'abord.** Tout terme technique est défini, en une phrase simple,
   au moment où il apparaît, avant d'être utilisé.
3. **Toujours dans cet ordre :** l'idée en langage courant → une image de la vie quotidienne
   → un exemple déroulé pas à pas → une manipulation où l'élève le fait lui-même.
4. **Faire avant de lire la suite.** Chaque idée se termine par une activité interactive
   courte. On ne passe à l'étape suivante qu'après l'avoir réussie (ou après avoir vu la
   correction expliquée).
5. **On n'évalue que ce qui a été pratiqué.** Une question, un exercice ou une question
   d'examen ne peut porter que sur une notion qui a fait l'objet d'une manipulation dans le
   module. Ce qui a été seulement mentionné n'est pas évaluable.
6. **Court.** La longueur n'est pas un objectif. Supprimer la contrainte des 400 à 600 mots.
   Une étape claire de 80 mots vaut mieux qu'une étape dense de 400.
7. **La sécurité à sa place.** Un encadré court en fin d'étape ou de section : « À quoi ça
   sert en cyber ». Pas de digressions de sécurité au milieu de l'explication de base.
8. **Le ton** reste adulte et direct. Simple ne veut pas dire infantilisant. Les activités,
   elles, peuvent être ludiques, même enfantines : c'est voulu.

---

## 4. L'interactivité attendue

Youness veut **manipuler**. Le QCM doit devenir une activité parmi d'autres, pas la
principale. Construire dans le moteur des **composants d'activité réutilisables**, déclarés
dans le JSON des modules, par exemple :

| Activité | Exemples d'usage |
|---|---|
| **Interrupteurs de bits** : 8 cases à allumer ou éteindre, la valeur se met à jour en direct | fabriquer 181 ; trouver le masque /26 |
| **Glisser-déposer pour classer** | adresses privées / publiques ; protocoles par couche ; TCP ou UDP |
| **Relier deux colonnes** | port ↔ service ; hexa ↔ binaire ; EtherType ↔ protocole |
| **Remettre dans l'ordre** | étapes de l'encapsulation ; méthode du bloc ; étapes d'une conversion |
| **Texte à trous** | compléter un calcul déroulé ; compléter une adresse réseau |
| **Cliquer sur la bonne zone** | dans une trame hexa, cliquer sur l'octet du TTL ; dans une adresse, cliquer sur la partie réseau |
| **Construire** avec des curseurs ou des blocs | construire une adresse et son masque, voir le réseau se dessiner |
| **Animation pas à pas** | un paquet qui descend les couches et prend ses en-têtes ; un paquet qui traverse des routeurs |
| **Défi chronométré** facultatif | 10 conversions en 2 minutes, pour l'automatisme |

Ce tableau est une piste, pas une liste fermée. Propose d'autres formats si tu en vois de
meilleurs. Chaque activité doit :
- donner un retour immédiat, et expliquer l'erreur quand l'élève se trompe ;
- pouvoir se rejouer avec de nouvelles valeurs quand c'est pertinent ;
- fonctionner à la souris **et** au clavier, et rester utilisable sur un écran étroit.

---

## 5. Ce qui existe et doit être conservé

- Le principe des fichiers : `curriculum.json` pour le plan, `modules/<id>.json` pour le
  contenu, `app/index.html` pour le moteur. Le contenu reste séparé du moteur.
  Le format JSON des modules peut évoluer : c'est même attendu.
- Les générateurs d'exercices existants (`convBin`, `convTriple`, `bitop`, `subnet`,
  `cidr`, `decoupe`, `ipv4`, `paquet`) : les réutiliser, les adapter si besoin.
- Le mélange des options de QCM à chaque affichage.
- Les **cartes de révision** (boîtes 1 à 5) et la **fiche du niveau**.
- L'**examen de fin de niveau** : 20 questions, 80 % exigés, questions inédites jamais
  montrées dans les modules, corrigé détaillé à la fin, niveau suivant verrouillé tant
  qu'il n'est pas réussi. L'examen peut lui aussi contenir des activités interactives.
- La progression stockée dans le navigateur (`localStorage`).

---

## 6. Contraintes techniques

- HTML, CSS et JavaScript simples, **sans étape de compilation** : la formation se lance
  avec `python -m http.server` à la racine et s'ouvre sur `http://localhost:8000/app/`.
- Pas de dépendance à installer. Une bibliothèque chargée depuis un CDN est acceptable si
  elle apporte vraiment quelque chose, mais tout doit rester fonctionnel en local.
- Si `app/index.html` devient trop gros, le découper en plusieurs fichiers dans `app/`.
- Mettre à jour `outils/valider.js` pour qu'il vérifie le nouveau format.
- **Tester dans le navigateur** chaque activité avant de la livrer : la jouer, juste puis
  faux, et vérifier le retour affiché.

---

## 7. La méthode de travail

1. **Commencer par un prototype** : réécrire uniquement la première partie du module n0-1
   (les bases de numération et la conversion décimal ↔ binaire) dans le nouveau format,
   avec au moins trois types d'activités différents.
2. **Le montrer à Youness et attendre son avis.** Ne pas aller plus loin avant qu'il ait
   validé le format.
3. Une fois le format validé : réécrire la **skill `module-cyber`** pour qu'elle produise
   ce format (supprimer la contrainte de longueur, intégrer les principes du §3 et les
   activités du §4), et adapter la skill `relire-module` (contrôle du principe 5 en
   priorité : chaque question porte-t-elle sur une notion manipulée ?).
4. Puis refaire n0-1, n0-2 et n0-3 dans le nouveau format, un module à la fois, chacun
   validé par Youness avant le suivant.
5. Faire un commit Git à chaque étape validée.

---

## 8. Le critère de réussite

Youness doit pouvoir dire, à la fin de chaque étape : « j'ai compris, et je viens de le
faire moi-même ». Et à la fin du module, réussir l'évaluation sans avoir l'impression
qu'une question sort de nulle part.
