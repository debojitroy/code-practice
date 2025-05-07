import { describe, expect, test } from 'bun:test';
import { Game, Move } from './index';
import { CellType } from './types/cell';
import { fakeTimers } from './test/helpers/fakeTimers';

const clock = fakeTimers();

describe('Game', () => {
  test('should initialise board', () => {
    const rowCount = 5;
    const colCount = 5;
    const snakeLength = 3;

    const game = new Game(rowCount, colCount, snakeLength);
    const grid = game.getBoard().getGrid();

    expect(grid.length).toEqual(5);
  });

  test('should initialise the snake', () => {
    const rowCount = 5;
    const colCount = 5;
    const snakeLength = 3;

    const game = new Game(rowCount, colCount, snakeLength);

    // snake head should be at (0,2)
    expect(game.getSnake().getSnakeHead()).toEqual({
      row: 0,
      col: 2,
      cellType: CellType.Snake,
    });
  });

  test('should be game over if the snake moves into body', () => {
    const rowCount = 5;
    const colCount = 5;
    const snakeLength = 3;

    const game = new Game(rowCount, colCount, snakeLength);

    // Snake -> ***
    // If the snake moves left, it should crash
    expect(game.play(Move.Left)).toBeTrue();
  });

  test('should move the snake if the next cell is NOT body', () => {
    const rowCount = 5;
    const colCount = 5;
    const snakeLength = 3;

    const game = new Game(rowCount, colCount, snakeLength);

    // Snake -> ***
    // If the snake moves right, it should be fine
    expect(game.play(Move.Right)).toBeFalse();
    expect(game.getSnake().getSnakeHead()!).toEqual({
      row: 0,
      col: 3,
      cellType: CellType.Snake,
    });
  });

  test('should grow the snake every 5 seconds', () => {
    const rowCount = 5;
    const colCount = 5;
    const snakeLength = 3;

    const game = new Game(rowCount, colCount, snakeLength);

    expect(game.getSnake().getSnakeLength()).toEqual(3);

    clock.tick(5100);

    expect(game.getSnake().getSnakeLength()).toEqual(4);

    clock.tick(5100);

    expect(game.getSnake().getSnakeLength()).toEqual(5);
  });
});
