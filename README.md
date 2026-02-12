# Texas Hold'em Poker Hand Comparison

Projet TDD — Loris LABARRE & Mohamed Rida BENTAMA SERROUKH

## Objectif

Évaluer et comparer les mains au Texas Hold'em. Donné :
- 5 cartes communautaires (board)
- 2 cartes privées par joueur (hole cards)

→ Déterminer la meilleure main de 5 cartes pour chaque joueur et comparer.

## Notation des cartes

- **Rangs** : 2, 3, 4, 5, 6, 7, 8, 9, T (10), J, Q, K, A
- **Couleurs** : s (spades), h (hearts), d (diamonds), c (clubs)

Exemple : `As` = Ace of spades, `Th` = 10 of hearts

## Règles

- Source : https://en.wikipedia.org/wiki/List_of_poker_hands
- Pas de doublons : on suppose que les cartes en entrée sont uniques

## Hand categories (du plus fort au plus faible)

1. Straight flush
2. Four of a kind
3. Full house
4. Flush
5. Straight
6. Three of a kind
7. Two pair
8. One pair
9. High card

## Ordre des chosen5 (pour tests déterministes)

- **Straight / Straight flush** : du plus haut au plus bas (wheel = 5,4,3,2,A)
- **Four of a kind** : les 4 cartes du carré, puis kicker
- **Full house** : les 3 du brelan, puis les 2 de la paire
- **Flush / High card** : rangs décroissants
- **Three of a kind** : triplet, puis 2 kickers décroissants
- **Two pair** : paire haute, paire basse, kicker
- **One pair** : paire, puis 3 kickers décroissants

## Input

On suppose qu'il n'y a pas de doublons dans les cartes en entrée (pas de validation).

## Lancer les tests

```bash
npm test
```
