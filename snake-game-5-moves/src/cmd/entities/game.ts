import { CellType, type Cell } from '../types/cell';
import Board from './board';
import Snake from './snake';

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export default class Game {
  private snake: Snake;
  private board: Board;
  private gameOver: boolean = false;
  private rowCount: number;
  private colCount: number;

  constructor(rowCount: number, columnCount: number, snakeInitialSize: number) {
    this.rowCount = rowCount;
    this.colCount = columnCount;
    this.board = new Board(rowCount, columnCount);

    const snakeCells: Cell[] = [];
    // Grow the snake horizontally
    for (let index = 0; index < snakeInitialSize; index++) {
      snakeCells.push(this.board.getCells()[0]![index]!);
    }

    this.snake = new Snake(snakeCells);
  }

  public getSnake = () => this.snake;

  public getUserMove = (direction: Direction): Cell | null => {
    // Get the current location
    const currentRow = this.snake.getHead()!.row;
    const currentCol = this.snake.getHead()!.col;

    switch (direction) {
      case Direction.UP:
        if (currentRow > 0)
          return this.board.getCells()[currentRow - 1]![currentCol]!;
        break;
      case Direction.DOWN:
        if (currentRow < this.rowCount - 1)
          return this.board.getCells()[currentRow + 1]![currentCol]!;
        break;
      case Direction.LEFT:
        if (currentCol > 0)
          return this.board.getCells()[currentRow]![currentCol - 1]!;
        break;
      case Direction.RIGHT:
        if (currentCol < this.colCount - 1)
          return this.board.getCells()[currentRow]![currentCol + 1]!;
        break;
    }

    return null;
  };

  /**
   *
   * @param Cell The next cell to move the snake
   * @returns If the game is over
   */
  public play = (cell: Cell): boolean => {
    if (cell.cellType === CellType.SNAKE) this.gameOver = true;
    else this.snake.move(cell);

    return this.gameOver;
  };
}
