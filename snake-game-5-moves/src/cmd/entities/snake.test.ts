import { describe, test, expect } from 'bun:test';
import Snake from './snake';
import { CellType, type Cell } from '../types/cell';

describe('Snake', () => {
  test('must be initialsed with incoming size of cells', () => {
    const tail: Cell = {
      row: 0,
      col: 1,
      cellType: CellType.EMPTY,
    };

    const head: Cell = {
      row: 0,
      col: 1,
      cellType: CellType.EMPTY,
    };

    const cells: Cell[] = [tail, head];

    const snake = new Snake(cells);

    expect(tail.cellType).toEqual(CellType.SNAKE);
    expect(head.cellType).toEqual(CellType.SNAKE);
  });

  test('must move the snake to next cell', () => {
    // Incoming cell must become the head
    // The tail cell must be now empty
    const tail: Cell = {
      row: 0,
      col: 1,
      cellType: CellType.EMPTY,
    };

    const head: Cell = {
      row: 0,
      col: 1,
      cellType: CellType.EMPTY,
    };

    const cells: Cell[] = [tail, head];

    const snake = new Snake(cells);

    const nextCell: Cell = {
      row: 0,
      col: 2,
      cellType: CellType.EMPTY,
    };

    snake.move(nextCell);

    expect(snake.getHead()).toEqual({
      row: nextCell.row,
      col: nextCell.col,
      cellType: CellType.SNAKE,
    });

    expect(tail.cellType).toEqual(CellType.EMPTY);
  });

  test('must grow after 5 moves', () => {
    // After 5 moves the size of the snake must grow by 1 cell
    const tail: Cell = {
      row: 0,
      col: 1,
      cellType: CellType.EMPTY,
    };

    const head: Cell = {
      row: 0,
      col: 1,
      cellType: CellType.EMPTY,
    };

    const cells: Cell[] = [tail, head];

    const snake = new Snake(cells);

    // Move 5 moves
    for (let index = 2; index < 7; index++) {
      const element: Cell = {
        row: 0,
        col: index,
        cellType: CellType.EMPTY,
      };

      snake.move(element);
    }

    expect(snake.getSize()).toEqual(3);

    // Move another 3 moves
    for (let index = 100; index < 102; index++) {
      const element: Cell = {
        row: 0,
        col: index,
        cellType: CellType.EMPTY,
      };

      snake.move(element);
    }

    // The size shouldnt grow
    expect(snake.getSize()).toEqual(3);
  });

  test('must crash if the next cell is a snake cell', () => {
    const tail: Cell = {
      row: 0,
      col: 1,
      cellType: CellType.EMPTY,
    };

    const head: Cell = {
      row: 0,
      col: 1,
      cellType: CellType.EMPTY,
    };

    const cells: Cell[] = [tail, head];

    const snake = new Snake(cells);

    // Next cell is the tail, it must crash
    const moveResult = snake.move(tail);

    expect(moveResult).toEqual({ crashed: true });
  });
});
