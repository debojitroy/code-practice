export enum CellType {
  Empty,
  Snake,
}

export type Cell = {
  row: number;
  col: number;
  cellType: CellType;
};
