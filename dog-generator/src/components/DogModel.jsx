import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BREEDS } from '../useDogState'

/* ── Low-poly geometry factories ── */
const boxG   = (w, h, d) => new THREE.BoxGeometry(w, h, d, 1, 1, 1)
const cylG   = (rt, rb, h, s = 5) => new THREE.CylinderGeometry(rt, rb, h, s, 1)
const sphG   = (r, w = 6, h = 4) => new THREE.SphereGeometry(r, w, h)
const coneG  = (r, h, s = 4) => new THREE.ConeGeometry(r, h, s)
const octG   = (r) => new THREE.OctahedronGeometry(r, 0)

function lmat(color) {
  return new THREE.MeshLambertMaterial({ color: new THREE.Color(color), flatShading: true })
}

/* ── DogMesh: pure Three.js scene built into a Group ref ── */
function buildDog(group, s) {
  // clear old children
  while (group.children.length) {
    const c = group.children[0]
    c.geometry?.dispose()
    group.remove(c)
  }

  const bp = BREEDS[s.breed]
  const mb = lmat(s.bodyColor)
  const me = lmat(s.earColor)
  const mn = lmat(s.noseColor)
  const mw = lmat('#f0f0f0')
  const mk = lmat('#0a0a0a')

  const bW = bp.bW * s.bodyWidth
  const bH = bp.bH
  const bD = bp.bD
  const hS = bp.hS * s.headSize
  const lb = bp.legBase
  const lH = lb * s.legLen
  const lW = bp.lW

  function addMesh(geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.rotation.set(rx, ry, rz)
    m.castShadow = m.receiveShadow = true
    group.add(m)
    return m
  }

  /* TORSO — 8-sided cylinder scaled on Z */
  const torso = new THREE.Mesh(cylG(bW * 0.50, bW * 0.56, bH, 8), mb)
  torso.scale.z = bD / (bW * 0.53)
  torso.position.set(0, lb + bH / 2, 0)
  torso.castShadow = torso.receiveShadow = true
  group.add(torso)

  /* LEGS — 4-sided cylinders, pivot at TOP → growth is upward */
  const ox = bW * 0.33
  const oz = bD * 0.30
  const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]]
  corners.forEach(([sx, sz]) => {
    const lg = new THREE.Group()
    lg.position.set(sx * ox, lb, sz * oz)

    const lmesh = new THREE.Mesh(cylG(lW * 0.75, lW, lH, 4), mb)
    lmesh.position.set(0, -lH / 2, 0)
    lmesh.castShadow = lmesh.receiveShadow = true
    lg.add(lmesh)
    group.add(lg)

    // Paw — squished octahedron, always near ground
    const pm = new THREE.Mesh(octG(lW * 0.9), me)
    pm.scale.set(1.1, 0.32, 1.35)
    pm.position.set(sx * ox, 0.06, sz * oz)
    pm.castShadow = true
    group.add(pm)
  })

  /* NECK — tapered 6-sided cylinder */
  const nkH = hS * 0.28
  addMesh(cylG(hS * 0.28, bW * 0.24, nkH, 6), mb, 0, lb + bH + nkH / 2, -bD * 0.26)

  /* HEAD — faceted box with vertex distortion */
  const hgeo = new THREE.BoxGeometry(hS, hS * 0.90, hS, 2, 2, 2)
  const hp = hgeo.attributes.position
  for (let i = 0; i < hp.count; i++) {
    const nx = hp.getX(i), ny = hp.getY(i), nz = hp.getZ(i)
    hp.setXYZ(i,
      nx * (0.90 + Math.abs(ny / hS) * 0.18),
      ny,
      nz * (0.86 + Math.abs(nx / hS) * 0.14)
    )
  }
  hgeo.computeVertexNormals()

  const hY = lb + bH + nkH + hS * 0.46
  const hZ = -bD * 0.26 - hS * 0.01
  addMesh(hgeo, mb, 0, hY, hZ)

  /* SNOUT — hexagonal prism, length driven by snoutLen */
  const snD = hS * 0.26 * s.snoutLen
  const snGeo = cylG(hS * 0.22, hS * 0.26, snD, 6)
  snGeo.rotateX(Math.PI / 2)
  const snZ = hZ - hS * 0.44 - snD / 2
  addMesh(snGeo, me, 0, hY - hS * 0.10, snZ)
  // Nose tip
  addMesh(sphG(hS * 0.095, 5, 4), mn, 0, hY - hS * 0.055, snZ - snD / 2 - 0.005)

  /* EYES */
  const eZ = hZ - hS * 0.43
  const eY = hY + hS * 0.09
  ;[-1, 1].forEach((sx) => {
    addMesh(sphG(hS * 0.125, 5, 4), mw, sx * hS * 0.225, eY, eZ)
    addMesh(sphG(hS * 0.07, 4, 3), mk, sx * hS * 0.225, eY, eZ - hS * 0.075)
  })

  /* EARS — 4-sided cones */
  const es = s.earSize
  const eH = hS * 0.48 * es
  const eR = hS * 0.20 * es
  ;[-1, 1].forEach((sx) => {
    const em = new THREE.Mesh(coneG(eR, eH, 4), me)
    em.position.set(sx * hS * 0.36, hY + hS * 0.38 + eH / 2, hZ + hS * 0.05)
    em.rotation.set(0.08, 0, sx * 0.25)
    em.castShadow = true
    group.add(em)
  })

  /* TAIL — segmented curved cylinders */
  const tl = s.tailLen
  const segs = 4
  const sH = 0.13 * tl
  const tailGrp = new THREE.Group()
  tailGrp.position.set(0, lb + bH * 0.52, bD * 0.47)

  let accY = 0, accZ = 0
  for (let i = 0; i < segs; i++) {
    const r = Math.max(0.065 - i * 0.012, 0.022)
    const angle = -0.55 - i * 0.30
    const tm = new THREE.Mesh(cylG(r * 0.85, r, sH, 4), i < 2 ? mb : me)
    const midY = accY + Math.sin(-angle) * sH / 2
    const midZ = accZ - Math.cos(-angle) * sH / 2
    tm.position.set(0, midY, midZ)
    tm.rotation.x = angle
    tm.castShadow = true
    tailGrp.add(tm)
    accY += Math.sin(-angle) * sH
    accZ -= Math.cos(-angle) * sH
  }
  group.add(tailGrp)
}

/* ── DogModel React component ── */
export default function DogModel({ dogState }) {
  const groupRef = useRef()
  const tailGroupRef = useRef()
  const tailTime = useRef(0)

  // Rebuild dog geometry whenever state changes
  useEffect(() => {
    if (!groupRef.current) return
    buildDog(groupRef.current, dogState)
    // Cache tail group ref for animation
    tailGroupRef.current = groupRef.current.children.find(
      (c) => c.isGroup && c.children.length > 1
    )
  }, [dogState])

  // Tail wag animation
  useFrame((_, delta) => {
    tailTime.current += delta * 3.0
    if (tailGroupRef.current) {
      tailGroupRef.current.rotation.z = Math.sin(tailTime.current) * 0.42
    }
  })

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.50} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 2, -4]} intensity={0.28} color="#c8dcff" />

      {/* Shadow ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.07} />
      </mesh>

      {/* Dog group — geometry is built imperatively in useEffect */}
      <group ref={groupRef} />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={12}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.75}
        target={[0, 1.0, 0]}
      />
    </>
  )
}
