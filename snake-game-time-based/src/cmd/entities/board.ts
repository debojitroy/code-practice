import { CellType, type Cell } from '../types/cell';

export default class Board {
  private rowCount: number;
  private colCount: number;
  private cells: Cell[][];

  constructor(rowCount: number, colCount: number) {
    this.rowCount = rowCount;
    this.colCount = colCount;

    this.cells = [];

    //Initialise the Grid
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row: Cell[] = [];
      for (let colIndex = 0; colIndex < colCount; colIndex++) {
        const cell: Cell = {
          row: rowIndex,
          col: colIndex,
          cellType: CellType.Empty,
        };

        row.push(cell);
      }

      this.cells.push(row);
    }
  }

  // Expose the grid
  public getGrid = () => this.cells;
}
