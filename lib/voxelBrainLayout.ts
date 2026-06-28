export type BrainVoxel = {
  x: number
  y: number
  z: number
  glow: 'core' | 'mid' | 'surface' | 'none'
}

function isInBrain(nx: number, ny: number, nz: number): boolean {
  const side = nx >= 0 ? 1 : -1
  const hx = nx - side * 0.09
  const hy = ny + 0.02
  const hz = nz

  const ex = 1.02
  const ey = 0.86
  const ez = 0.92
  const dist = (hx / ex) ** 2 + (hy / ey) ** 2 + (hz / ez) ** 2

  const cerebellum =
    ((hx / 0.42) ** 2 +
      ((hy + 0.48) / 0.2) ** 2 +
      ((hz + 0.32) / 0.34) ** 2) < 1 &&
    hy < -0.12 &&
    hz < 0.05

  if (cerebellum) return true
  if (dist > 1) return false
  if (Math.abs(nx) < 0.05 && hy > -0.15) return false
  if (hy < -0.68) return false
  if (hy < -0.38 && dist > 0.62) return false

  if (
    hy > -0.28 &&
    hy < 0.22 &&
    Math.abs(hx) > 0.52 &&
    hz > -0.05 &&
    hz < 0.38 &&
    dist > 0.68
  ) {
    return false
  }

  if (hz > 0.38 && hy < 0.15 && Math.abs(hx) > 0.18) return false
  if (hz > 0.2 && hy > -0.05 && dist > 0.88) return false
  if (dist > 0.94) return false

  if (dist > 0.72) {
    const sulcus =
      Math.sin(hx * 10 + hy * 2) *
      Math.cos(hz * 8 - hy * 3) *
      Math.sin(hy * 7 + hz * 3)
    if (sulcus > 0.4) return false
  }

  return true
}

function glowLevel(
  hx: number,
  hy: number,
  hz: number,
  dist: number,
): BrainVoxel['glow'] {
  const core = hx * hx * 1.1 + hy * hy + hz * hz
  if (core < 0.14) return 'core'
  if (core < 0.32) return 'mid'
  if (dist > 0.68) return 'surface'
  return 'none'
}

/** Coarse low-poly brain — fewer voxels for performance */
export function generateBrainVoxels(): BrainVoxel[] {
  const voxels: BrainVoxel[] = []
  const step = 0.28
  const scale = 42

  for (let xi = -13; xi <= 13; xi++) {
    for (let yi = -11; yi <= 13; yi++) {
      for (let zi = -10; zi <= 10; zi++) {
        const nx = xi * step
        const ny = yi * step
        const nz = zi * step

        if (!isInBrain(nx, ny, nz)) continue

        const side = nx >= 0 ? 1 : -1
        const hx = nx - side * 0.09
        const hy = ny + 0.02
        const hz = nz
        const dist =
          (hx / 1.02) ** 2 + (hy / 0.86) ** 2 + (hz / 0.92) ** 2

        voxels.push({
          x: xi * scale,
          y: yi * scale,
          z: zi * scale,
          glow: glowLevel(hx, hy, hz, dist),
        })
      }
    }
  }

  return voxels
}
