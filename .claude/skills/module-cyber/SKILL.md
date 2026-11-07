---
name: module-cyber
description: Rédige ou corrige un module de la formation cybersécurité de Youness, soit un fichier modules/<id>.json au format 2 : un chapitre dense découpé en étapes d'une seule idée, chacune terminée par une activité. À utiliser dès qu'il faut créer, compléter, reprendre ou corriger un fichier de modules/, même si la demande dit seulement « écris n0-4 », « refais ce cours » ou « ajoute cette notion ». Impose la densité, la définition des termes, les activités, le ton, et la règle centrale : on n'évalue que ce qui a été manipulé.
---

# Rédaction d'un module de formation

Tu écris un module pour **une seule personne** : Youness, 27 ans, M1 Mastère Cybersécurité (Architectures Systèmes Réseaux Sécurité) en alternance. Le point de départ est zéro en informatique, et le niveau visé reste celui du Mastère. Ce qui se règle ici, c'est la pente : douce, régulière, sans marche.

**Un module remplace un chapitre de manuel, il ne le résume pas.** Si un lecteur peut finir en disant « d'accord, mais concrètement ça marche comment ? », le module est raté. Il doit finir en sachant faire.

## Le défaut à ne pas reproduire

Sur les premiers modules, le même retour est revenu trois fois : long mais pas clair, on passe de rien à tout, et des questions qui semblent sortir de nulle part. La longueur n'était pas en cause. La cause était la pente : plusieurs notions et plusieurs mots nouveaux dans le même paragraphe, et des questions sur des notions citées sans jamais avoir été manipulées.

La réponse n'est donc pas de raccourcir. Un module garde le volume d'un chapitre, réparti en étapes qui n'introduisent qu'une chose à la fois et que l'élève termine en faisant.

Le critère de réussite : à la fin de chaque étape, l'élève peut dire « j'ai compris, et je viens de le faire moi-même ». À la fin du module, il réussit l'évaluation sans qu'aucune question ne l'étonne.

## Les règles

### 1. La densité est une exigence de section, jamais d'écran

Un module vise **4 à 6 sections** (une section est une entrée de `parties`), et chaque section vise **400 à 600 mots de prose**. Le nombre de sections est une cible de rédaction, pas un plafond : un module peut en compter 7 ou plus quand scinder une section est la bonne réponse pédagogique. La relecture applique ces seuils :

| Mots de la section | Classement |
|---|---|
| moins de 300 | bloquant |
| 300 à 399 | à améliorer |
| 400 à 660 | accepté : 600 reste la cible, 660 une tolérance |
| 661 à 750 | à améliorer |
| plus de 750 | bloquant |

Se comptent, balises HTML retirées et sur toutes les étapes de la section : `mots` (terme et définition), `idee`, `image`, `intro` et `conclusion` de l'exemple, `cyber`. Ne se comptent pas : les `lignes` de l'exemple et les activités.

Ce compte ne s'applique jamais à une étape. Une section de 500 mots se répartit en général sur 3 à 5 étapes, et une étape claire de 80 mots est une bonne étape. Quand une section est trop légère, ajoute une étape ou va plus loin dans le mécanisme, sans délayer celles qui existent. Quand elle dépasse la tolérance, retire d'abord les redites, puis coupe-la en deux, même si le module passe à 7 sections ou plus. Ne la rabote jamais pour rester dans la fourchette, et ne sacrifie jamais une étape, un déroulé ou un mécanisme pour tenir le plafond : une section de plus de 750 mots ne peut pas être livrée telle quelle.

Mesure ces comptes par un calcul, sans les estimer, avec la règle de la fonction `mots()` d'`outils/valider.js` : un mot est un segment entre deux espaces qui contient une lettre ou un chiffre. Le validateur ne fait pas ce calcul par section au format 2.

### 2. Une idée par étape

Une étape porte une seule idée, nommée par son champ `notion`, unique dans le module : le moteur s'en sert pour renvoyer l'élève à la bonne étape après une erreur.

Pour tester : énonce l'idée en une phrase. S'il faut un « et » pour relier deux choses à apprendre, coupe l'étape en deux. Passer de décimal à binaire et de binaire à décimal fait deux étapes. Choisir entre plusieurs notions déjà vues fait une étape à part entière.

### 3. Tout terme est défini à sa première apparition

Un terme technique se définit dans `mots`, en une phrase simple, dans l'étape où il apparaît pour la première fois et avant d'être employé. Un module qui emploie « paquet », « socket » ou « hash » sans l'avoir défini, ou sans qu'un module prérequis l'ait fait, est raté.

Est technique tout mot qu'un adulte étranger à l'informatique ne saurait pas expliquer, ou auquel l'informatique donne un sens propre (« serveur », « paquet », « clé »). Un mot courant employé dans son sens courant n'a pas à être défini.

La règle vaut partout : consignes, corrections, encadrés `cyber`, cartes, et **options fausses des questions**. Le lecteur doit pouvoir écarter une mauvaise réponse en connaissance de cause, pas au hasard. Un terme qui n'apparaît que dans un encadré n'a pas sa place dans `mots`, affiché bien avant lui : définis-le dans la phrase même, ou évite-le.

Plus de trois mots nouveaux dans une étape signalent le plus souvent qu'elle porte deux idées.

### 4. Toujours le même ordre

Le moteur affiche chaque étape dans cet ordre, et le texte doit être écrit pour lui :

1. `mots` : les termes nouveaux ;
2. `idee` : l'idée en langage courant, une seule, en moins de 90 mots ;
3. `image` : une image de la vie quotidienne, qui prépare le mécanisme sans le remplacer ;
4. `exemple` : un exemple numérique ou concret complet, déroulé ligne par ligne ;
5. `activites` : l'élève le fait lui-même ;
6. `cyber` : l'encadré, s'il y en a un, affiché seulement après l'activité.

**L'exemple montre le mécanisme.** Pas « le handshake TCP établit la connexion », mais les trois paquets, les numéros de séquence, et ce qui se passe si l'un manque. Le bon niveau de détail est celui qui permet de reproduire ou de déboguer. Aucune étape de calcul ne doit « se deviner », et aucun résultat n'est donné sans le déroulé qui y mène.

**Chaque sens se montre avant d'être demandé.** Un seul sens enseigné pour deux sens testés est un défaut déjà corrigé une fois dans `n0-1` : le cours montrait décimal → binaire, et l'exercice partait de l'hexa. Quand un générateur tire plusieurs directions, le cours en a déroulé chacune.

### 5. Chaque étape se termine par une activité

Sans activité, l'étape n'existe pas : le validateur la refuse, et le moteur n'ouvre l'étape suivante qu'une fois l'activité réussie, ou ratée avec sa correction affichée.

- **L'activité pratique l'idée de son étape**, pas une idée voisine, et n'exige rien que cette étape ou les précédentes n'aient montré.
- **Le QCM est une activité parmi d'autres.** Préfère un type où l'élève produit ou range quelque chose. Garde `choix` pour ce qui est vraiment une décision : distinguer deux notions, interpréter une situation. Dans `n0-1`, il ne représente que 2 activités sur 25.
- **Varie les types** dans le module, trois au minimum.
- **Fais rejouer quand c'est possible**, avec `gen` ou `"aleatoire"` : une activité à valeurs neuves entraîne le geste, une activité figée ne fait réviser que sa réponse.
- **La réponse ne se trouve pas dans la phrase précédente.**

### 6. On n'évalue que ce qui a été manipulé

C'est la règle qui répond directement au reproche des « questions sorties de nulle part ». Elle s'applique à `evaluation.banque`, à `examen` et à `cartes`.

Une notion est **manipulée** quand l'élève a lui-même fait ce geste dans une activité d'étape, dans la même configuration. N'en font pas partie : ce qui est lu dans `idee`, l'exemple regardé, le terme défini dans `mots` sans servir dans aucune activité, l'usage cité dans `cyber`, l'explication donnée dans une correction.

Le transfert reste permis et même souhaité : **même geste, autres valeurs ou autre situation**. Si le cours calcule 192.168.1.70/26, l'examen calcule autre chose. Un autre geste, en revanche, n'est plus un transfert :

- un masque à octets pleins pratiqué ne couvre pas un masque partiel demandé ;
- décimal → binaire pratiqué ne couvre pas binaire → décimal ;
- des conversions sur un octet ne couvrent pas une valeur sur deux octets ;
- une activité `choix` prouve qu'on a su choisir : elle couvre une question de décision, pas un calcul ;
- appliquer un masque fourni ne couvre pas construire un masque à partir d'un besoin, même si l'élève peut essayer les quatre options une à une : on juge le geste de la question telle qu'elle est posée.

Une question de situation concrète (un log, une configuration, une phrase entendue en réunion) apporte un cadre neuf, jamais un geste ou un vocabulaire neufs.

Écris donc l'évaluation **après** les étapes, en les relisant. Pour chaque question, désigne l'étape et l'activité où le geste a été fait. Si tu n'en trouves pas, deux issues seulement : ajouter une étape avec sa manipulation, ou retirer la question. Le champ `notion` doit désigner cette étape-là. Le validateur compare seulement cette étiquette à la liste des notions pratiquées, il ne lit pas la question : son feu vert ne prouve rien sur ce point.

### 7. L'ancrage sécurité, à sa place

Chaque section répond à la question « pourquoi un attaquant ou un défenseur s'en sert ». Le ET binaire sert à comprendre les masques, les numéros de séquence TCP servent à comprendre l'usurpation.

Mets l'ancrage dans le texte quand il explique la notion. Mets dans l'encadré `cyber` (70 mots au plus) les usages qui n'y tiennent pas. Toutes les étapes n'ont pas besoin d'un encadré, et aucune digression de sécurité ne doit interrompre l'explication de base.

Un encadré ne contient pas de terme non défini, et ce qu'il cite sans le faire pratiquer n'est pas évaluable. S'il annonce un usage traité plus loin, il renvoie au module concerné.

### 8. Toute correction explique le raisonnement

Une correction qui donne seulement la bonne réponse ne sert à rien. Elle redéroule le calcul ou la logique, et nomme l'erreur probable. Pour un `choix`, le champ `w` explique pourquoi la bonne réponse est bonne et pourquoi la plus tentante des fausses est fausse, en trois à six phrases.

## Le test du lecteur ignorant

Avant de livrer, relis chaque étape en te demandant : quelqu'un qui découvre ce sujet aujourd'hui peut-il suivre, ligne après ligne, sans ouvrir un autre onglet ?

Un passage échoue dès qu'un terme est employé avant d'être défini, qu'une étape de calcul se devine, ou qu'un exemple est donné en résultat (« 181 = 1011 0101 ») sans son déroulé.

## Ce qui est interdit

- Renvoyer vers une ressource externe à la place d'expliquer.
- Remplacer une explication par une liste à puces. `idee` et `image` sont rédigées en phrases.
- Une analogie vague (« c'est comme une enveloppe postale ») sans le mécanisme réel derrière.
- Le ton professoral condescendant, les félicitations, les emojis.
- Annoncer un prérequis qu'aucun module antérieur du curriculum ne couvre.

## Ton

Direct et adulte, en phrases courtes. On explique une fois, bien, sans répéter. On peut dire qu'un sujet est difficile, jamais qu'il est « simple » ou « facile ». Simple ne veut pas dire infantilisant, même si les activités, elles, peuvent être ludiques.

## Format du fichier

Un module est un fichier `modules/<id>.json`, avec `"format": 2`. L'`id` suit le curriculum (`n0-1`, `n2-3`…).

```json
{
  "format": 2,
  "id": "n0-1",
  "level": 0,
  "title": "Titre du curriculum",
  "subtitle": "Une ligne concrète",
  "duration": "60 min",
  "prereq": [],
  "why": "Deux à quatre phrases : ce que ce module débloque concrètement en sécurité. C'est le premier texte lu, il doit donner envie de continuer.",
  "parties": [
    {
      "titre": "Titre de la section",
      "etapes": [
        {
          "id": "dec2bin",
          "notion": "dec2bin",
          "titre": "Écrire un nombre en binaire",
          "mots": [{ "m": "le terme", "d": "sa définition, en une phrase simple." }],
          "idee": "L'idée. Une chaîne, ou un tableau de deux paragraphes. HTML inline autorisé : <strong>, <code>, <em>.",
          "image": "L'image de la vie quotidienne.",
          "exemple": {
            "intro": "Ce qu'on va dérouler.",
            "lignes": ["Une ligne, en monospace, affichée une à la fois.", "<b>mise en évidence</b> <span class='c'>commentaire grisé</span>"],
            "conclusion": "La règle à retenir."
          },
          "activites": [{ "type": "bits", "mode": "fabriquer", "cible": "aleatoire" }],
          "cyber": "Facultatif : l'usage en sécurité qui ne tient pas dans le texte."
        }
      ]
    }
  ],
  "evaluation": {
    "count": 10,
    "pass": 8,
    "banque": [{ "notion": "dec2bin", "type": "bits", "mode": "fabriquer", "cible": "aleatoire", "consigne": "Allume les bits de" }]
  },
  "cartes": [{ "notion": "dec2bin", "r": "Comment écrire un nombre en binaire ?", "v": "Du plus gros poids au plus petit : s'il rentre dans le reste, écrire 1 et le soustraire." }],
  "examen": [{ "notion": "dec2bin", "type": "choix", "q": "Question inédite.", "o": ["A", "B", "C", "D"], "a": 2, "w": "La correction." }]
}
```

`modules/n0-1.json` est la référence pour le découpage en étapes, le ton et les activités. Ce n'est pas une référence de densité : plusieurs de ses sections sortent de la fourchette, et c'est la fourchette qui fait foi.

## Les activités disponibles

Déclarées dans le JSON, exécutées par `app/activites.js`.

| `type` | Ce que fait l'élève | Champs |
|---|---|---|
| `bits` | allume des interrupteurs, ou lit un octet | `mode` (`fabriquer` ou `lire`), `cible` ou `valeur` (0 à 255, ou `"aleatoire"`), `direct`, `consigne` |
| `operation` | calcule ET, OU ou XOR colonne par colonne | `op` (`ET`, `OU`, `XOR`, `"aleatoire"`), `a`, `b` (octet ou `"aleatoire"`), `consigne` |
| `trous` | complète un calcul ou une phrase | `texte` avec `{{réponse\|variante}}`, `consigne`, `explication` ; ou `gen` |
| `ordre` | remet des étapes dans l'ordre | `items` (au moins 3, dans le bon ordre), `consigne`, `explication` |
| `classer` | range des étiquettes dans des cases | `categories` (au moins 2), `items` (au moins 3 : `{t, c, w}`), `consigne`, `explication` ; ou `gen` |
| `relier` | relie deux colonnes | `paires` (au moins 3 : `[gauche, droite, raison]`, éléments de droite tous différents), `titres`, `consigne`, `explication` ; ou `gen` |
| `zone` | clique sur le bon morceau | `consigne`, `segments` (au moins 2), `bons` (index), `multi`, `explication` ; ou `gen` |
| `choix` | choisit une option parmi quatre | `q`, `o`, `a`, `w` |

Générateurs existants, utilisables avec `gen` :

| `type` | `gen` |
|---|---|
| `trous` | `decompo10`, `suiteBinaire`, `poids`, `convHex`, `hexBin`, `masque`, `construireMasque`, `testerBit`, `xorRetour`, `base64Taille`, `base64Paquets`, `base64Caractere`, `base64Egal` |
| `classer` | `bases` |
| `relier` | `relierNibble`, `relierAscii` |
| `zone` | `zoneNibble`, `erreurSoustractive` |

Les anciens générateurs d'`app/index.html` (`subnet`, `cidr`, `decoupe`, `ipv4`, `paquet`…) ne sont pas appelés par un module au format 2 : pour réutiliser leur logique, écris un générateur d'activité.

Si un module a besoin d'autre chose (lire un en-tête de paquet, compléter une règle de pare-feu, repérer la ligne malveillante d'un log), écris-le plutôt que de te rabattre sur un QCM :

- **un générateur** s'ajoute à `ACT_GENS` dans `app/activites.js` et dans `outils/valider.js`, puis à la table ci-dessus ;
- **un nouveau type** s'écrit sous la forme `act<Nom>(el, spec, ctx)`, s'inscrit dans `ACTIVITES` et dans `ACTS` d'`outils/valider.js`, puis dans la table ci-dessus.

Dans les deux cas, teste l'activité dans le navigateur : joue-la juste, puis faux, et vérifie le retour affiché. Elle doit fonctionner à la souris, au clavier et sur écran étroit.

## L'évaluation, les cartes et l'examen

Tous portent un champ `notion`, soumis à la règle 6.

**`evaluation`** : l'épreuve de fin de module, avec un seul essai par épreuve et le corrigé à la fin.

- `count` : environ une épreuve pour deux étapes, 5 au minimum. `pass` : 80 % de `count`.
- `banque` : au moins le double de `count`, pour qu'une reprise ne se réussisse pas de mémoire. Toutes les sections y sont représentées.
- Au moins deux épreuves posent une situation concrète plutôt qu'une définition.
- Prévois des épreuves rejouables (`gen` ou `"aleatoire"`) : le moteur y puise les 8 exercices de l'examen de niveau.

**`cartes`** : 12 au minimum, davantage pour un module long. Elles alimentent le mode « Réviser le niveau », où l'élève répond de tête avant de retourner la carte. Elles servent à retrouver de mémoire, pas à relire le cours.

- Une carte porte une seule notion. Si le verso dépasse deux phrases, coupe-la en deux.
- Le recto est une question, jamais un titre : « Que vaut 0x9E en décimal ? », pas « L'hexadécimal ».
- Couvre les chiffres et les tables à connaître par cœur (poids, valeurs de masque, ports, numéros de protocole), les définitions des termes qui servent dans une activité, et au moins une carte par réflexe de sécurité manipulé.
- Le verso donne le résultat et le moyen de le retrouver quand c'est un calcul : « 158 (9 × 16 + 14) ».
- Tout ce qu'une carte affirme figure dans le cours du module.

**`examen`** : 5 à 7 questions. L'examen de fin de niveau en tire 12 dans tous les modules du niveau, plus 8 exercices, et exige 80 %. Ces questions ne sont jamais montrées pendant le module.

- Quatre options, correction complète (règle 8), termes tous définis (règle 3).
- Aucune question identique ou reformulée d'une épreuve de `banque` : le validateur refuse les doublons exacts, la relecture refuse les reformulations.
- Fais varier la position de la bonne réponse, et n'en fais pas systématiquement la plus longue ni la plus nuancée. Le moteur mélange les options à l'affichage, mais le fichier doit rester sain par lui-même.

## Procédure

1. Lire `curriculum.json` pour l'intitulé exact du module et ses prérequis, et les modules prérequis pour savoir quels termes sont déjà définis.
2. Lire `modules/n0-1.json` pour caler le ton et le découpage.
3. Dresser la liste des notions du module, dans l'ordre : une notion, une étape, une activité. Vérifier qu'aucune n'a besoin d'un terme ou d'un geste qui vient après elle. Repère indicatif : un module compte le plus souvent 12 à 27 étapes. Un écart se signale, il ne bloque jamais et ne justifie ni de couper ni de fusionner des étapes : ce qui décide, c'est « une idée par étape » (règle 2), qui s'évalue et ne se compte pas.
4. Écrire les étapes, en entier. Ne pas livrer un squelette à compléter plus tard.
5. Écrire `evaluation`, `cartes` et `examen` en relisant les étapes, question par question (règle 6).
6. Régénérer l'index des modules écrits, que l'application lit au démarrage : `node outils/indexer.js`. Puis valider : `node outils/valider.js curriculum.json modules/<id>.json`. Aucune erreur ne doit rester, et chaque alerte se traite ou se justifie.
7. Calculer les mots de chaque section et rectifier selon la règle 1.
8. Vérifier soi-même chaque réponse d'activité, d'épreuve et d'examen. Une correction fausse dans un cours est pire que pas de cours.
9. Passer le module à la skill `relire-module`.
