import Board from './entities/board';
import Snake from './entities/snake';
import { CellType, type Cell } from './types/cell';

export enum Move {
  Up,
  Down,
  Right,
  Left,
}

export class Game {
  private snake: Snake;
  private board: Board;
  private lastSnakeGrowTime = Date.now();

  constructor(rowCount: number, colCount: number, snakeInitLength: number) {
    this.board = new Board(rowCount, colCount);

    const initCells: Cell[] = [];
    // Grow the snake horizontally
    for (let index = 0; index < snakeInitLength; index++) {
      const row = this.board.getGrid()[0];

      initCells.push(row![index]!);
    }

    this.snake = new Snake(initCells);

    setInterval(() => {
      this.growSnake();
    }, 1000);
  }

  public getBoard = () => this.board;

  public getSnake = () => this.snake;

  public play = (move: Move): boolean => {
    const nextCell = this.getNextCell(move);

    // Check if the next cell is Snake body
    if (nextCell && nextCell.cellType === CellType.Snake) return true;

    // Otherwise move the snake
    this.snake.moveSnake(nextCell!);

    return false;
  };

  /**
   * Grow snake every 5 seconds
   * Try horizontal growth
   * otherwise vertical growth
   */
  private growSnake = () => {
    const currentTime = Date.now();

    if (currentTime - this.lastSnakeGrowTime >= 5000) {
      const snakeGrew =
        this.tryGrowingSnake(Move.Right) ||
        this.tryGrowingSnake(Move.Left) ||
        this.tryGrowingSnake(Move.Up) ||
        this.tryGrowingSnake(Move.Down);

      if (snakeGrew) this.lastSnakeGrowTime = currentTime;
    }
  };

  private tryGrowingSnake = (move: Move) => {
    let nextCell = this.getNextCell(move);

    if (nextCell && nextCell.cellType !== CellType.Snake) {
      this.snake.growSnake(nextCell);
      return true;
    }

    return false;
  };

  private getNextCell = (move: Move): Cell | null => {
    // Check for board edges
    const currentHead = this.snake.getSnakeHead()!;

    switch (move) {
      case Move.Up:
        if (currentHead.row === 0) {
          // Cannot move up
          break;
        } else {
          return this.board.getGrid()[currentHead.row - 1]![currentHead.col]!;
        }
      case Move.Down:
        if (currentHead.row === this.board.getGrid().length - 1) {
          // Cannot move down
          break;
        } else {
          return this.board.getGrid()[currentHead.row + 1]![currentHead.col]!;
        }
      case Move.Right:
        if (currentHead.col === this.board.getGrid()[0]!.length - 1) {
          // Cannot move Right
          break;
        } else {
          return this.board.getGrid()[currentHead.row]![currentHead.col + 1]!;
        }
      case Move.Left:
        if (currentHead.col === 0) {
          // Cannot move Left
          break;
        } else {
          return this.board.getGrid()[currentHead.row]![currentHead.col - 1]!;
        }
    }

    return null;
  };
}
