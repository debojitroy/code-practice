import { CellType, type Cell } from '../types/cell';

export default class Board {
  private rowCount: number;
  private columnCount: number;
  private cells: Cell[][];

  constructor(rowCount: number, colCount: number) {
    this.rowCount = rowCount;
    this.columnCount = colCount;
    this.cells = [];

    // Initialise all the cells of the board
    for (let row = 0; row < rowCount; row++) {
      const rowArray: Cell[] = [];
      for (let col = 0; col < colCount; col++) {
        const boardCell: Cell = {
          row,
          col,
          cellType: CellType.EMPTY,
        };

        rowArray.push(boardCell);
      }

      this.cells.push(rowArray);
    }
  }

  public getCells = () => this.cells;
}
