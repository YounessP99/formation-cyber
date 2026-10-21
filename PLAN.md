# Plan de travail

## Les trois règles

**1. Un module à la fois.**
On ne génère le module suivant qu'une fois l'évaluation du précédent validée (4 sur 5).
Pas d'avance prise « pour gagner du temps ». Un module généré et non travaillé ne vaut rien.

**2. Au stylo.**
Les conversions et les calculs se font sur papier. Pas de tête, pas de calculatrice.
Le critère de maîtrise : savoir le refaire demain, sans relire le cours.

**3. Tous les jours, même vingt minutes.**
Vingt minutes six jours de suite battent trois heures le dimanche. La répétition espacée est
ce qui fait tenir une notion ; une session longue et isolée s'oublie en une semaine.

---

## Le cycle d'un module

1. **Lire** le cours en entier, sans sauter les blocs techniques.
2. **Refaire les exemples au stylo** pendant la lecture. Chaque exemple déroulé dans le cours
   doit être recopié et retrouvé soi-même.
3. **Faire les exercices** de chaque section. Cliquer « Autre énoncé » jusqu'à enchaîner
   trois réussites d'affilée sans hésiter.
4. **Passer l'évaluation.** 4 sur 5 exigés.
5. Si échec : reprendre les sections ratées, puis relancer. Autant de fois que nécessaire,
   sans passer au module suivant.
6. Si réussite : `git add -A` puis `git commit -m "n0-X valide"`, et générer le suivant.

---

## Générer le module suivant

Deux fenêtres PowerShell ouvertes dans `C:\Dev\formation-cyber`.

Dans la première, le serveur :

    python -m http.server

Dans la seconde, Claude Code :

    claude

Puis, l'un après l'autre :

    Écris le module n0-2 en suivant la skill module-cyber

    Relis n0-2 avec la skill relire-module, et corrige ce qui est bloquant

La relecture n'est pas optionnelle. Un module jamais relu contient statistiquement une
erreur — et c'est une erreur qui sera apprise par cœur.

Rafraîchir ensuite la page du navigateur avec F5.

---

## L'ordre des modules

Niveau 0, dans cet ordre strict, parce que chacun dépend du précédent :

| Module | Titre | Ce qu'il débloque |
|---|---|---|
| n0-1 | Binaire et hexadécimal | assembleur, crypto, masques réseau |
| n0-2 | Le modèle TCP/IP | tout le reste du réseau |
| n0-3 | Adressage IP et sous-réseaux | segmentation, pare-feu |
| n0-4 | TCP et UDP en détail | scans, spoofing |
| n0-5 | DNS, DHCP, ARP, NAT | usurpation, exfiltration |
| n0-6 | Routage et commutation | architecture réseau |

Ne pas sauter un module parce que son titre semble familier. La familiarité n'est pas
la maîtrise, et l'évaluation tranche.

---

## En cas de blocage

Noter précisément où ça coince — la section, la phrase, l'étape du calcul — et le dire.
Un blocage signalé est corrigé dans le module, donc dans les suivants. Un blocage tu
le gardes pour toi devient un trou définitif.

---

## Ce qui ne compte pas

Le temps passé. Le nombre de modules générés. La taille du projet.

Ce qui compte : le nombre d'évaluations validées, et la capacité à refaire un calcul
une semaine plus tard sans aide.
