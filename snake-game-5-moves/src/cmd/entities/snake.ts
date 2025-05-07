import { List, Item } from 'linked-list';
import { CellType, type Cell } from '../types/cell';

export class SnakeCell extends Item {
  private cell: Cell;

  constructor(cell: Cell) {
    super();
    this.cell = cell;
    this.cell.cellType = CellType.SNAKE;
  }

  public getCell = () => this.cell;
}

export default class Snake {
  private snakeBody: List;
  private consecutiveMoves: number = 0;

  // Handle initialise size
  constructor(initialCells: Cell[]) {
    this.snakeBody = new List();

    // Add the cells to the snake body
    for (let index = 0; index < initialCells.length; index++) {
      const element = initialCells[index];
      const snakeCell = new SnakeCell(element!);

      this.snakeBody.prepend(snakeCell);
    }
  }

  public move = (cell: Cell): { crashed: boolean } => {
    // If cell is already a node, then snake has crashed
    if (cell.cellType === CellType.SNAKE) return { crashed: true };

    // Increment the move
    this.consecutiveMoves += 1;

    // Append the new cell to the snake
    this.snakeBody.prepend(new SnakeCell(cell));

    //Remove the tail only if less than 5 moves
    if (this.consecutiveMoves < 5) {
      const oldTail: SnakeCell = this.snakeBody.tail?.detach() as SnakeCell;

      oldTail!.getCell().cellType = CellType.EMPTY;
    } else {
      // Reset the counter
      this.consecutiveMoves = 0;
    }

    return {
      crashed: false,
    };
  };

  public getHead = (): Cell | null => {
    if (this.snakeBody.size > 0) {
      return (this.snakeBody.head as SnakeCell).getCell();
    }

    return null;
  };

  public getSize = () => this.snakeBody.size;
}
