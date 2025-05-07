import { List, Item } from 'linked-list';
import { CellType, type Cell } from '../types/cell';

export class SnakeCell extends Item {
  private cell: Cell;
  constructor(cell: Cell) {
    super();
    this.cell = cell;
    this.cell.cellType = CellType.Snake;
  }

  public getCell = () => this.cell;
}

export default class Snake {
  private snakeBody: List<SnakeCell> = new List();

  constructor(initCells: Cell[]) {
    // Initialise the snake
    initCells.forEach((cell) => {
      this.snakeBody.prepend(new SnakeCell(cell));
    });
  }

  public getSnakeLength = () => this.snakeBody.size;

  public getSnakeHead = () =>
    this.snakeBody.head ? this.snakeBody.head.getCell() : null;

  public moveSnake = (cell: Cell): boolean => {
    if (cell.cellType === CellType.Snake) return true;

    // Move the head to the new location
    this.snakeBody.prepend(new SnakeCell(cell));

    // Remove the tail
    const oldTail = this.snakeBody.tail?.detach();

    if (oldTail) {
      oldTail.getCell().cellType = CellType.Empty;
    }

    return false;
  };

  public growSnake = (cell: Cell) =>
    this.snakeBody.prepend(new SnakeCell(cell));
}
