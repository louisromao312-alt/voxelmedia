export type BrainVoxel = {
  x: number
  y: number
  z: number
  highlight: boolean
}

/** Deterministic low-poly voxel brain — two hemispheres + cerebellum bump */
export function generateBrainVoxels(): BrainVoxel[] {
  const voxels: BrainVoxel[] = []
  const step = 0.17
  const scale = 9.8

  for (let xi = -15; xi <= 15; xi++) {
    for (let yi = -13; yi <= 15; yi++) {
      for (let zi = -13; zi <= 13; zi++) {
        const nx = xi * step
        const ny = yi * step
        const nz = zi * step

        const side = nx >= 0 ? 1 : -1
        const hx = nx - side * 0.11
        const hy = ny + 0.04
        const hz = nz

        const dist = hx * hx * 1.12 + hy * hy * 0.92 + hz * hz * 1.04
        if (dist > 0.64) continue

        if (Math.abs(nx) < 0.055 && hy > -0.22) continue

        if (hy < -0.52) continue

        if (hz > 0.32 && hy < 0.05 && Math.abs(hx) > 0.22) continue

        const cerebellum =
          hz < -0.18 && hy > -0.42 && hy < -0.1 && Math.abs(hx) < 0.32
        if (!cerebellum && dist > 0.54 && hy < -0.05) continue

        const highlight = (xi * 7 + yi * 13 + zi * 5) % 11 === 0

        voxels.push({
          x: xi * scale,
          y: yi * scale,
          z: zi * scale,
          highlight,
        })
      }
    }
  }

  return voxels
}
