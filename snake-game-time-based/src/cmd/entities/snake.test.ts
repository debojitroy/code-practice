import { describe, test, expect } from 'bun:test';
import Snake from './snake';
import { CellType, type Cell } from '../types/cell';

describe('Snake', () => {
  test('should have the length of init cells', () => {
    const cells: Cell[] = [
      {
        row: 0,
        col: 0,
        cellType: CellType.Empty,
      },
      {
        row: 0,
        col: 1,
        cellType: CellType.Empty,
      },
      {
        row: 0,
        col: 1,
        cellType: CellType.Empty,
      },
    ];

    const snake = new Snake(cells);
    expect(snake.getSnakeLength()).toEqual(3);
  });

  test('should mark init cells as Snake cells', () => {
    const cells: Cell[] = [
      {
        row: 0,
        col: 0,
        cellType: CellType.Empty,
      },
      {
        row: 0,
        col: 1,
        cellType: CellType.Empty,
      },
      {
        row: 0,
        col: 1,
        cellType: CellType.Empty,
      },
    ];

    const snake = new Snake(cells);

    cells.forEach((cell) => {
      expect(cell.cellType).toEqual(CellType.Snake);
    });
  });

  test('should move snake head to the next cell and empty the tail cell', () => {
    const initialTail = {
      row: 0,
      col: 0,
      cellType: CellType.Empty,
    };

    const initialHead = {
      row: 0,
      col: 1,
      cellType: CellType.Empty,
    };

    const snake = new Snake([initialTail, initialHead]);

    const newHead = {
      row: 0,
      col: 2,
      cellType: CellType.Empty,
    };

    snake.moveSnake(newHead);

    expect(snake.getSnakeHead()?.row).toEqual(newHead.row);
    expect(snake.getSnakeHead()?.col).toEqual(newHead.col);
    expect(newHead.cellType).toEqual(CellType.Snake);
    expect(initialTail.cellType).toEqual(CellType.Empty);
  });

  test('should crash if the next cell is snake body', () => {
    const cells: Cell[] = [
      {
        row: 0,
        col: 0,
        cellType: CellType.Empty,
      },
      {
        row: 0,
        col: 1,
        cellType: CellType.Empty,
      },
      {
        row: 0,
        col: 1,
        cellType: CellType.Empty,
      },
    ];

    const snake = new Snake(cells);

    expect(snake.moveSnake(snake.getSnakeHead()!)).toBeTrue();
  });

  test('should NOT crash if the next cell is NOT snake body', () => {
    const cells: Cell[] = [
      {
        row: 0,
        col: 0,
        cellType: CellType.Empty,
      },
      {
        row: 0,
        col: 1,
        cellType: CellType.Empty,
      },
      {
        row: 0,
        col: 1,
        cellType: CellType.Empty,
      },
    ];

    const snake = new Snake(cells);

    expect(
      snake.moveSnake({ row: 0, col: 2, cellType: CellType.Empty })
    ).toBeFalse();
  });
});
