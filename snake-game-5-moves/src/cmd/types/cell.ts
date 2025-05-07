export enum CellType {
  EMPTY,
  SNAKE,
}

export type Cell = {
  row: number;
  col: number;
  cellType: CellType;
};
