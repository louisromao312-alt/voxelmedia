export type BrainVoxel = {
  x: number
  y: number
  z: number
  glow: 'core' | 'mid' | 'surface' | 'none'
}

/** Normalised brain space: x = lateral, y = superior, z = anterior */
type Vec3 = { x: number; y: number; z: number }

function ellipsoid(p: Vec3, c: Vec3, rx: number, ry: number, rz: number): number {
  const dx = (p.x - c.x) / rx
  const dy = (p.y - c.y) / ry
  const dz = (p.z - c.z) / rz
  return dx * dx + dy * dy + dz * dz
}

function inCerebralHemisphere(p: Vec3, side: -1 | 1): boolean {
  const cx = side * 0.56
  const hp: Vec3 = { x: p.x - cx, y: p.y, z: p.z }

  let rx = 0.48
  let ry = 0.56
  let rz = 0.5

  // Frontal lobe — broad forehead, forward extension
  if (p.z > 0.05) {
    const t = Math.min(1, (p.z - 0.05) / 0.38)
    rz += 0.14 * t
    if (p.y > -0.1) rx += 0.05 * t
  }

  // Parietal dome
  if (p.y > 0.12) {
    const t = Math.min(1, (p.y - 0.12) / 0.38)
    ry += 0.08 * t
    rx += 0.05 * t
  }

  // Temporal lobes — lateral wings at mid-level
  if (p.y > -0.34 && p.y < 0.1 && p.z > -0.18 && p.z < 0.28) {
    rx += 0.09
  }

  // Occipital lobe — back of cerebrum
  if (p.z < -0.1 && p.y > -0.2) {
    const t = Math.min(1, (-p.z - 0.1) / 0.3)
    rz += 0.08 * t
  }

  const d = ellipsoid(hp, { x: 0, y: 0, z: 0 }, rx, ry, rz)
  if (d > 1) return false

  // Longitudinal fissure — deep groove between hemispheres
  const fissure = 0.05 + Math.max(0, p.y) * 0.085
  if (Math.abs(p.x) < fissure && p.y > -0.42) return false

  // Inferior surface — curved cut under hemispheres
  if (p.y < -0.36) {
    const under = ellipsoid(
      hp,
      { x: 0, y: -0.1, z: -0.04 },
      rx * 0.84,
      ry * 0.5,
      rz * 0.8,
    )
    if (under > 1) return false
  }

  // Sylvian fissure hint — lateral indent
  if (
    d > 0.55 &&
    p.y > -0.22 &&
    p.y < 0.06 &&
    p.z > 0.02 &&
    p.z < 0.28 &&
    Math.abs(hp.x) > 0.22 &&
    Math.abs(hp.x) < 0.38
  ) {
    const indent = Math.sin((p.z - 0.02) * 12) * Math.cos(p.y * 8)
    if (indent > 0.35) return false
  }

  // Surface sulci — light texture only
  if (d > 0.78) {
    const groove =
      Math.sin(hp.x * 8 + p.y * 2) *
      Math.cos(p.z * 7 - p.y * 2.5) *
      Math.sin(p.y * 6)
    if (groove > 0.48) return false
  }

  return true
}

function inCerebellum(p: Vec3, side: -1 | 1): boolean {
  const cx = side * 0.28
  const cy = -0.5
  const cz = -0.34
  const hp: Vec3 = { x: p.x - cx, y: p.y - cy, z: p.z - cz }

  const d = ellipsoid(hp, { x: 0, y: 0, z: 0 }, 0.32, 0.22, 0.26)
  if (d > 1) return false

  // Only below and behind cerebrum
  if (p.y > -0.26 || p.z > -0.04) return false

  // Vermis — central gap between cerebellar hemispheres
  if (Math.abs(p.x) < 0.065 && p.y > -0.58) return false

  return true
}

function inBrainStem(p: Vec3): boolean {
  if (p.y > -0.3 || Math.abs(p.x) > 0.12) return false

  const upper = ellipsoid(p, { x: 0, y: -0.38, z: -0.04 }, 0.11, 0.1, 0.1)
  const lower = ellipsoid(p, { x: 0, y: -0.62, z: -0.06 }, 0.08, 0.2, 0.09)

  return upper <= 1 || lower <= 1
}

function inCorpusCallosum(p: Vec3): boolean {
  if (p.y < 0.34 || Math.abs(p.x) > 0.16) return false
  return ellipsoid(p, { x: 0, y: 0.5, z: -0.04 }, 0.14, 0.055, 0.2) <= 1
}

function isInBrain(p: Vec3): boolean {
  if (inBrainStem(p)) return true
  if (inCerebellum(p, -1) || inCerebellum(p, 1)) return true
  if (inCorpusCallosum(p)) return true
  if (inCerebralHemisphere(p, -1) || inCerebralHemisphere(p, 1)) return true
  return false
}

function glowLevel(p: Vec3): BrainVoxel['glow'] {
  const side: -1 | 1 = p.x >= 0 ? 1 : -1
  const cx = side * 0.56
  const hp: Vec3 = { x: p.x - cx, y: p.y, z: p.z }
  const shell = ellipsoid(hp, { x: 0, y: 0, z: 0 }, 0.48, 0.56, 0.5)

  const r2 = p.x * p.x * 0.9 + p.y * p.y + p.z * p.z * 0.95
  if (r2 < 0.1) return 'core'
  if (r2 < 0.24) return 'mid'
  if (shell > 0.7) return 'surface'
  return 'none'
}

const STEP = 0.12
export const BRAIN_BLOCK_SIZE = 22

const X_RANGE = Math.ceil(3.3 / STEP)
const Y_RANGE = Math.ceil(3.74 / STEP)
const Z_RANGE = Math.ceil(2.86 / STEP)

/** Anatomical voxel brain — dual hemispheres, fissure, cerebellum, brain stem */
export function generateBrainVoxels(): BrainVoxel[] {
  const voxels: BrainVoxel[] = []

  for (let xi = -X_RANGE; xi <= X_RANGE; xi++) {
    for (let yi = -Y_RANGE; yi <= Y_RANGE; yi++) {
      for (let zi = -Z_RANGE; zi <= Z_RANGE; zi++) {
        const p: Vec3 = {
          x: xi * STEP,
          y: yi * STEP,
          z: zi * STEP,
        }

        if (!isInBrain(p)) continue

        voxels.push({
          x: xi * BRAIN_BLOCK_SIZE,
          y: -yi * BRAIN_BLOCK_SIZE,
          z: zi * BRAIN_BLOCK_SIZE,
          glow: glowLevel(p),
        })
      }
    }
  }

  return voxels
}
