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

  if (Math.abs(nx) < 0.045 && hy > -0.15) return false

  if (hy < -0.68) return false

  if (hy < -0.38 && dist > 0.62 && !cerebellum) return false

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

  const frontalBulge = hz > 0.2 && hy > -0.05
  if (frontalBulge && dist > 0.88) return false

  if (dist > 0.94) return false

  const onSurface = dist > 0.72
  if (onSurface) {
    const sulcus =
      Math.sin(hx * 14 + hy * 2) *
      Math.cos(hz * 11 - hy * 3) *
      Math.sin(hy * 9 + hz * 4)
    if (sulcus > 0.38) return false

    const secondary =
      Math.cos(hx * 9 - 1.2) * Math.sin(nz * 13 + 0.5) * Math.cos(hy * 7)
    if (secondary > 0.42 && Math.abs(hx) > 0.2) return false
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
  if (core < 0.12) return 'core'
  if (core < 0.28) return 'mid'
  if (dist > 0.68) return 'surface'
  return 'none'
}

/** Low-poly voxel brain — dual hemispheres, fissures, cerebellum, sulci */
export function generateBrainVoxels(): BrainVoxel[] {
  const voxels: BrainVoxel[] = []
  const step = 0.13
  const scale = 13.5

  for (let xi = -20; xi <= 20; xi++) {
    for (let yi = -18; yi <= 20; yi++) {
      for (let zi = -16; zi <= 16; zi++) {
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
