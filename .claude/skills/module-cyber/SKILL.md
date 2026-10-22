---
name: module-cyber
description: Rédige un module de la formation cybersécurité de Youness au format JSON du projet. À utiliser dès qu'il faut créer, compléter ou corriger un fichier dans modules/. Impose la structure pédagogique, le ton, le niveau d'exigence et les types d'exercices.
---

# Rédaction d'un module de formation

Tu écris un module de cours pour **une seule personne** : Youness, 27 ans, M1 Mastère Cybersécurité (Architectures Systèmes Réseaux Sécurité) en alternance. Ce n'est pas un cours générique pour un public. C'est sa formation.

## Principe directeur

**Un module doit pouvoir remplacer un chapitre de manuel, pas le résumer.**

Si quelqu'un peut lire ton module et dire « d'accord, mais concrètement ça marche comment ? », le module est raté. Le lecteur doit finir en sachant *faire*, pas en sachant *que ça existe*.

Cinq règles non négociables :

1. **Niveau de départ : zéro.** Youness part du principe qu'il ne connaît rien en informatique. Tout terme technique est défini à sa première apparition, dans le texte, avant d'être utilisé. Un module qui emploie « paquet », « socket » ou « hash » sans l'avoir expliqué ou sans qu'un module prérequis l'ait fait est raté.
2. **Montrer les DEUX sens avant d'exercer.** C'est l'erreur qui a dû être corrigée dans `n0-1` : le cours montrait décimal → binaire, et l'exercice partait de l'hexa, un chemin jamais montré. Avant chaque exercice, vérifie que le cours a déroulé un exemple complet de **chaque** direction que le générateur peut tirer. Un seul sens enseigné pour deux sens testés, c'est un module défaillant.
3. **Toujours montrer le mécanisme.** Pas « le TCP handshake établit la connexion » mais le détail des trois paquets, des numéros de séquence, et de ce qui se passe si l'un manque. Le niveau de détail juste est celui qui permet de reproduire ou de débugger.
4. **Toujours ancrer en sécurité.** Chaque notion doit répondre à « pourquoi un attaquant ou un défenseur s'en sert ». Le ET binaire sert à comprendre les masques ; les numéros de séquence TCP servent à comprendre le spoofing. L'ancrage se met dans le texte, jamais en encadré décoratif.
5. **Toujours corriger en expliquant le raisonnement.** Une correction qui donne la bonne réponse est inutile. Elle doit redérouler le calcul ou la logique, et nommer l'erreur probable.

## Le test du lecteur ignorant

Avant de livrer, relis chaque section en te demandant : *quelqu'un qui découvre ce sujet aujourd'hui peut-il suivre, ligne après ligne, sans ouvrir un autre onglet ?*

Trois signes qu'un passage échoue au test :
- un terme employé avant d'être défini ;
- une étape de calcul qui « se devine » au lieu d'être écrite ;
- un exemple donné en résultat (« 181 = 1011 0101 ») sans le déroulé qui y mène.

Chaque méthode se montre sur un exemple **numérique complet**, étape par étape, dans un bloc `pre`. Jamais la méthode seule.

## Ce qui est interdit

- Renvoyer vers une ressource externe à la place d'expliquer. Le contenu doit être autonome.
- Les listes à puces en guise de cours. Un cours est rédigé en phrases.
- Les analogies vagues (« c'est comme une enveloppe postale ») sans le mécanisme réel derrière.
- Les exercices dont la réponse est dans la phrase précédente.
- Le tutoiement professoral condescendant, les félicitations, les emojis.
- Annoncer un prérequis sans l'avoir couvert dans un module antérieur du curriculum.

## Ton

Direct, dense, adulte. Phrases courtes. On explique une fois, bien, sans répéter. On peut dire qu'un sujet est difficile, on ne dit jamais qu'il est « simple » ou « facile ».

## Format du fichier

Un module = un fichier `modules/<id>.json`. L'`id` suit le curriculum (`n0-1`, `n2-3`…).

```json
{
  "id": "n0-2",
  "level": 0,
  "title": "Le modèle TCP/IP",
  "subtitle": "Ce qui arrive à tes données entre le clavier et le câble",
  "duration": "60 min",
  "prereq": ["n0-1"],
  "why": "Deux à quatre phrases. Pourquoi ce module existe, en termes de ce qu'il débloque concrètement en sécurité. C'est le premier texte lu, il doit donner envie de continuer.",
  "sections": [
    {
      "title": "Titre de section",
      "blocks": [
        { "t": "p",      "v": "Paragraphe. Le HTML inline est autorisé : <strong>, <code>, <em>." },
        { "t": "h3",     "v": "Sous-titre" },
        { "t": "pre",    "v": "Bloc technique monospace.\n<b>…</b> met en évidence.\n<span class='c'>…</span> met en commentaire grisé." },
        { "t": "table",  "head": ["Col A","Col B"], "rows": [["x","y"],["z","w"]] },
        { "t": "note",   "v": "Remarque en retrait. À utiliser avec parcimonie : maximum deux par module." }
      ],
      "exercise": { "gen": "convTriple" }
    }
  ],
  "qcm": [
    {
      "q": "Question de raisonnement, pas de récitation.",
      "o": ["Option A", "Option B", "Option C", "Option D"],
      "a": 1,
      "w": "Correction : pourquoi la bonne réponse est bonne, ET pourquoi la plus tentante des fausses est fausse. Trois à six phrases."
    }
  ],
  "eval": { "count": 5, "pass": 4 }
}
```

## Exigences de volume

- **4 à 6 sections** de cours par module.
- **400 à 600 mots de prose** par section, hors tableaux et blocs techniques. Le module `n0-1` est la référence de densité : ses sections font 320 à 510 mots. Un module notablement plus léger est refusé.
- **1 exercice** rattaché à au moins la moitié des sections.
- **5 à 8 entrées dans `qcm`**, dont au moins deux posent une situation concrète (un log, une configuration, une phrase entendue en réunion) plutôt qu'une définition.

## Générateurs d'exercices disponibles

Un exercice se déclare par son nom de générateur. Les générateurs vivent dans `app/index.html`, pas dans le JSON.

| `gen` | Ce qu'il produit |
|---|---|
| `convBin` | décimal → binaire 8 bits |
| `convTriple` | un octet tiré au sort, à écrire dans les trois bases |
| `bitop` | ET / OU / XOR entre deux octets |
| `subnet` | IP/CIDR → réseau, masque, broadcast, nombre d'hôtes |
| `ipv4` | un en-tête IPv4 en hexa (somme de contrôle valide) → TTL, protocole, IP source, IP destination |
| `paquet` | une trame Ethernet + IPv4 + TCP ou UDP en dump hexa → transport, ports, service (ports du tableau de n0-2) |
| `qcm` | tire une question de la liste `qcm` du module |

**Si un module a besoin d'un exercice d'un type nouveau** (lire un en-tête de paquet, compléter une règle de pare-feu, repérer la ligne malveillante dans un log), ajoute le générateur dans `app/index.html` en suivant exactement la forme des existants : une fonction `make<Nom>()` qui retourne `{prompt, fields, answers, explain}`, puis une entrée dans l'objet `GENERATORS`. Documente-le dans ce tableau.

## Procédure

1. Lire `curriculum.json` pour l'intitulé exact du module et ses prérequis.
2. Lire un module déjà écrit (`modules/n0-1.json`) pour caler le ton et la densité.
3. Écrire le module en entier. Ne pas livrer un squelette à compléter plus tard.
4. Valider : `node outils/valider.js modules/<id>.json`.
5. Vérifier soi-même chaque réponse d'exercice et de QCM. Une correction fausse dans un cours est pire que pas de cours.
