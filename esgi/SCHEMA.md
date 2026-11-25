# Schéma des fichiers `esgi/`

Contenu des sections Réalisations, Cours & révision, TP et Contrôles
(`BRIEF_SECTIONS_ESGI.md`). L'application les lit sans les modifier ; ils sont mis à
jour à la main (par Claude) après chaque cours ou TP. Vérification :

```bash
node outils/valider.js esgi          # tout le dossier
node outils/valider.js esgi/tp.json  # un seul fichier
```

```
esgi/
├── matieres.json        liste des matières
├── realisations.json    ce qui a été fait
├── tp.json              travaux pratiques
├── controles.json       évaluations
├── cartes/<id>.json     cartes de révision, une matière par fichier
└── cartes-index.json    liste des fichiers de cartes, écrite par node outils/indexer.js
```

## Conventions communes

- **Identifiant** (`id`) : minuscules, chiffres et tirets (`linux-ckb`), unique dans son fichier.
- **Date** : `AAAA-MM-JJ`, date réelle du calendrier. **Échéance** : `AAAA-MM-JJ` ou `AAAA-MM-JJTHH:MM`.
- **Note** : texte `"valeur/barème"`, virgule ou point décimal (`"17,64/20"`, `"85/100"`), ou `null`.
- **Matière** : un `id` présent dans `matieres.json`.
- **`modules_parcours`** : ids présents dans `curriculum.json` (niveaux ou hors parcours).
- **Inconnu = `null`.** Une information absente n'est jamais devinée. Un champ marqué
  « null permis » doit quand même être présent.
- Tout champ non listé ici est refusé (fautes de frappe).

## matieres.json — liste

| Champ | Type | Requis |
|---|---|---|
| `id` | identifiant (`asm`, `crypto`, `linux`, `rust`, `ad`, `radio`, `toeic`, `python`, `powerbi`…) | oui |
| `titre` | texte | oui |
| `intervenant` | texte, null permis | oui |
| `trimestre` | `T1`, `T2` ou `T3` | oui |
| `type` | `tronc` ou `electif` | oui |
| `dossier` | chemin OneDrive complet, null permis | oui |
| `seances` | liste, vide permise | oui |
| `seances[].date` | date | oui |
| `seances[].sujet` | texte | oui |
| `seances[].supports` | liste de `{ fichier, reperes }` ; `reperes` null permis (`"slides 1-24"`) | oui |
| `modules_parcours` | liste d'ids du curriculum, vide permise | oui |

Les séances sont rangées par date croissante.

## realisations.json — liste

| Champ | Type | Requis |
|---|---|---|
| `id` | identifiant | oui |
| `date` | date de réalisation ou de rendu, null permis (signalé « à préciser ») | oui |
| `matiere` | matière | oui |
| `titre` | texte | oui |
| `fait` | liste de textes, au moins un | oui |
| `competences` | liste de textes | oui |
| `note` | note, null permis | oui |
| `preuve` | chemin du rendu ou du dépôt, null permis | oui |
| `modules_parcours` | liste d'ids du curriculum | oui |

## tp.json — liste

| Champ | Type | Requis |
|---|---|---|
| `id` | identifiant | oui |
| `matiere` | matière | oui |
| `titre` | texte | oui |
| `echeance` | échéance, null permis | oui |
| `statut` | `a_faire`, `en_cours`, `rendu`, `note` | oui |
| `note` | note, null permis | oui |
| `plateforme` | texte, null permis | oui |
| `enonce` | chemin, null permis | oui |
| `etapes` | liste de `{ t, fait }` (`fait` booléen) | oui |
| `remarques` | liste de textes (contraintes, consignes annoncées) | non |

Cohérence : `statut: "note"` exige une note ; une note avec un autre statut est signalée.
`fait` est l'état de référence : une étape `fait: true` est cochée et verrouillée dans l'app.
Les cases cochées dans l'app restent dans le navigateur (clé `formation.cyber.tp.v1`,
synchronisée avec le reste de la progression).

## controles.json — liste

| Champ | Type | Requis |
|---|---|---|
| `id` | identifiant | oui |
| `matiere` | matière | oui |
| `date` | date, null permis | oui |
| `format` | texte, null permis | oui |
| `perimetre` | liste de textes | oui |
| `a_confirmer` | texte, null permis | oui |
| `cartes` | liste de matières dont les cartes nourrissent l'examen blanc | oui |
| `statut` | `a_venir` ou `passe` | oui |
| `note` | note, null permis | oui |

Cohérence : un contrôle passé exige une date (sa note manquante est signalée) ; un contrôle
à venir ne peut pas avoir de note.

Une matière de `cartes` sans fichier `cartes/<id>.json` est signalée (alerte, pas erreur).

## cartes/&lt;id&gt;.json — objet

```json
{ "matiere": "asm", "cartes": [{ "r": "recto", "v": "verso",
  "source": "x0ne module 01", "piege": false }] }
```

| Champ | Type | Requis |
|---|---|---|
| `matiere` | matière, égale au nom du fichier | oui |
| `cartes[].r` / `cartes[].v` | texte | oui |
| `cartes[].source` | fichier + slide/page ; aucun numéro inventé | oui |
| `cartes[].piege` | booléen | non (défaut `false`) |

Même forme `{r, v}` que les cartes des modules : le moteur de boîtes est réutilisé.
Progression stockée sous `formation.cyber.esgi.cartes.v1`.

## cartes-index.json

`{ "cartes": ["asm", …] }` : l'application ne demande que les fichiers listés. Après tout
fichier de cartes ajouté ou retiré : `node outils/indexer.js`. Le validateur refuse un index
qui ne correspond plus au dossier.
