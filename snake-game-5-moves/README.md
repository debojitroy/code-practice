# bun-bootstrap

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Requirement

Design a Snake mobile game

- Snake has a initial size of 3
- Snake grows on every 5 moves
- Game ends on crash

## Entities

### Snake

- Doubly LinkedList Body
- Head and Tail
- move(Cell) -> crashed
  - Head becomes the new Cell
  - Track moves
  - Tail is removed
  - but if 5 moves, retain the tail node
  - if next cell is already snake node, then crash

### Board

- 2 Dimensional Array
- RowCount
- ColumnCount

### Cell

- Row
- Col
- Cell State : Occupied, Empty

### Game

- Starting Board
- Snake with initial size
- getUserMove(Direction)
  - Check for edges of the board
  - returns the next cell
- play(Direction)
  - getUserMove
  - snake -> move(nextCell)
  - if crashes, game over
  - else, continue the game
