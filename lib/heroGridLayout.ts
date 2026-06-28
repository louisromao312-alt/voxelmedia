export const HERO_BLOCK = 42
export const HERO_CELL = HERO_BLOCK - 6
export const HERO_PAD = 3

export type GridCell = {
  key: string
  col: number
  row: number
  left: number
  top: number
  lx: number
  ly: number
}

export type HeroGridLayout = {
  cols: number
  rows: number
  height: number
  cells: GridCell[]
}

/** Straight bottom edge — only full tiles, aligned to hero bottom */
export function buildHeroGrid(viewportW: number, viewportH: number): HeroGridLayout {
  const cols = Math.ceil(viewportW / HERO_BLOCK)
  const heroH = viewportH * 0.88
  const rows = Math.max(1, Math.floor(heroH / HERO_BLOCK))

  const cells: GridCell[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = col * HERO_BLOCK
      const top = row * HERO_BLOCK
      cells.push({
        key: `${row}-${col}`,
        col,
        row,
        left,
        top,
        lx: left + HERO_BLOCK / 2,
        ly: top + HERO_BLOCK / 2,
      })
    }
  }

  return { cols, rows, height: rows * HERO_BLOCK, cells }
}
