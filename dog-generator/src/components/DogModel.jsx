import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BREEDS } from "../useDogState";

/* ── Low-poly geometry factories ── */
const boxG = (w, h, d) => new THREE.BoxGeometry(w, h, d, 1, 1, 1);
const cylG = (rt, rb, h, s = 5) => new THREE.CylinderGeometry(rt, rb, h, s, 1);
const sphG = (r, w = 6, h = 4) => new THREE.SphereGeometry(r, w, h);
const coneG = (r, h, s = 4) => new THREE.ConeGeometry(r, h, s);
const octG = (r) => new THREE.OctahedronGeometry(r, 0);

function lmat(color) {
  return new THREE.MeshLambertMaterial({
    color: new THREE.Color(color),
    flatShading: true,
  });
}

/* ── DogMesh: pure Three.js scene built into a Group ref ── */
function buildDog(group, s) {
  // clear old children
  while (group.children.length) {
    const c = group.children[0];
    c.geometry?.dispose();
    group.remove(c);
  }

  const bp = BREEDS[s.breed];
  const mb = lmat(s.bodyColor);
  const me = lmat(s.earColor);
  const mn = lmat(s.noseColor);
  const mw = lmat("#f0f0f0");
  const mk = lmat("#0a0a0a");

  const bW = bp.bW * s.bodyWidth;
  const bH = bp.bH;
  const bD = bp.bD;
  const hS = bp.hS * s.headSize;
  const lb = bp.legBase;
  const lH = lb * s.legLen;
  const lW = bp.lW;

  function addMesh(geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    m.castShadow = m.receiveShadow = true;
    group.add(m);
    return m;
  }

  /* TORSO — 원통(CylinderGeometry), 옆으로 눕혀서 Z축 방향으로 배치 */
  const torsoR = bW * 0.5;
  const torsoGeo = cylG(torsoR, torsoR, bD, 16); // 16각형 → 둥근 원통
  torsoGeo.rotateX(Math.PI / 2); // 세로 → 가로(Z축)로 눕힘
  const torso = new THREE.Mesh(torsoGeo, mb);
  const torsoY = lb + torsoR; // 원통 반지름만큼 올려서 바닥에 맞춤
  torso.position.set(0, torsoY, 0);
  torso.castShadow = torso.receiveShadow = true;
  group.add(torso);

  /* LEGS — 4-sided cylinders, pivot at TOP → 위쪽 방향으로만 성장 */
  const ox = bW * 0.38;
  // 원통 바닥(아랫면) y 좌표 = torsoY - torsoR = lb
  const legTopY = lb; // 다리 상단은 몸통 바닥에 맞춤
  // Z 오프셋: 원통 길이(bD) 안쪽으로 배치
  const oz = bD * 0.3;
  const corners = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  corners.forEach(([sx, sz]) => {
    const lg = new THREE.Group();
    lg.position.set(sx * ox, legTopY, sz * oz);

    // 다리 mesh: local y=0이 TOP, y=-lH가 바닥
    const lmesh = new THREE.Mesh(cylG(lW * 0.75, lW, lH, 4), mb);
    lmesh.position.set(0, -lH / 2, 0);
    lmesh.castShadow = lmesh.receiveShadow = true;
    lg.add(lmesh);

    // 발바닥 — 다리 그룹 안에 넣어서 다리 길이 따라 이동
    const pm = new THREE.Mesh(octG(lW * 0.9), me);
    pm.scale.set(1.1, 0.32, 1.35);
    pm.position.set(0, -lH - lW * 0.28, 0); // 다리 끝 바로 아래
    pm.castShadow = true;
    lg.add(pm);

    group.add(lg);
  });

  /* 공통 기준점: 원통 몸통의 윗면 y좌표 */
  const torsoTop = torsoY + torsoR; // 원통 중심 + 반지름 = 윗면
  const torsoFront = -bD / 2; // 몸통 앞면(머리 방향) Z
  const torsoBack = bD / 2; // 몸통 뒷면(꼬리 방향) Z

  /* NECK — 몸통 앞면 상단에서 시작 */
  const nkH = hS * 0.28;
  const neckZ = torsoFront; // 몸통 앞면에 맞춤
  addMesh(
    cylG(hS * 0.28, bW * 0.24, nkH, 6),
    mb,
    0,
    torsoTop + nkH / 2,
    neckZ + hS * 0.05,
  );

  /* HEAD */
  const hgeo = new THREE.BoxGeometry(hS, hS * 0.9, hS, 2, 2, 2);
  const hp = hgeo.attributes.position;
  for (let i = 0; i < hp.count; i++) {
    const nx = hp.getX(i),
      ny = hp.getY(i),
      nz = hp.getZ(i);
    hp.setXYZ(
      i,
      nx * (0.9 + Math.abs(ny / hS) * 0.18),
      ny,
      nz * (0.86 + Math.abs(nx / hS) * 0.14),
    );
  }
  hgeo.computeVertexNormals();

  const hY = torsoTop + nkH + hS * 0.46;
  const hZ = neckZ + hS * 0.05;
  addMesh(hgeo, mb, 0, hY, hZ);

  /* SNOUT */
  const snD = hS * 0.26 * s.snoutLen;
  const snGeo = cylG(hS * 0.22, hS * 0.26, snD, 6);
  snGeo.rotateX(Math.PI / 2);
  const snZ = hZ - hS * 0.44 - snD / 2;
  addMesh(snGeo, me, 0, hY - hS * 0.1, snZ);
  addMesh(
    sphG(hS * 0.095, 5, 4),
    mn,
    0,
    hY - hS * 0.055,
    snZ - snD / 2 - 0.005,
  );

  /* EYES */
  const eZ = hZ - hS * 0.43;
  const eY = hY + hS * 0.09;
  [-1, 1].forEach((sx) => {
    addMesh(sphG(hS * 0.125, 5, 4), mw, sx * hS * 0.225, eY, eZ);
    addMesh(sphG(hS * 0.07, 4, 3), mk, sx * hS * 0.225, eY, eZ - hS * 0.075);
  });

  /* EARS */
  const es = s.earSize;
  const eH = hS * 0.48 * es;
  const eR = hS * 0.2 * es;
  [-1, 1].forEach((sx) => {
    const em = new THREE.Mesh(coneG(eR, eH, 4), me);
    em.position.set(sx * hS * 0.36, hY + hS * 0.38 + eH / 2, hZ + hS * 0.05);
    em.rotation.set(0.08, 0, sx * 0.25);
    em.castShadow = true;
    group.add(em);
  });

  /* TAIL — 몸통 뒷면(torsoBack) + 원통 측면 y에 항상 고정
     몸통 크기(bD, torsoR)가 바뀌어도 정확히 뒷면에 붙음 */
  const tl = s.tailLen;
  const segs = 4;
  const sH = 0.13 * tl;
  const tailGrp = new THREE.Group();
  // 꼬리 pivot: 몸통 뒷면 중앙, y는 원통 중심보다 약간 위
  tailGrp.position.set(0, torsoY + torsoR * 0.5, torsoBack);

  let accY = 0,
    accZ = 0;
  for (let i = 0; i < segs; i++) {
    const r = Math.max(0.068 - i * 0.012, 0.024);
    const angle = -0.6 - i * 0.28;
    const tm = new THREE.Mesh(cylG(r * 0.85, r, sH, 6), i < 2 ? mb : me);
    const midY = accY + (Math.sin(-angle) * sH) / 2;
    const midZ = accZ + (Math.cos(-angle) * sH) / 2; // +Z = 뒤쪽으로 뻗음
    tm.position.set(0, midY, midZ);
    tm.rotation.x = angle;
    tm.castShadow = true;
    tailGrp.add(tm);
    accY += Math.sin(-angle) * sH;
    accZ += Math.cos(-angle) * sH;
  }
  group.add(tailGrp);
}

/* ── DogModel React component ── */
export default function DogModel({ dogState }) {
  const groupRef = useRef();
  const tailGroupRef = useRef();
  const tailTime = useRef(0);

  // Rebuild dog geometry whenever state changes
  useEffect(() => {
    if (!groupRef.current) return;
    buildDog(groupRef.current, dogState);
    // buildDog이 마지막으로 add한 Group이 tailGrp
    const allGroups = groupRef.current.children.filter((c) => c.isGroup);
    tailGroupRef.current = allGroups[allGroups.length - 1] ?? null;
  }, [dogState]);

  // Tail wag animation
  useFrame((_, delta) => {
    tailTime.current += delta * 3.0;
    if (tailGroupRef.current) {
      tailGroupRef.current.rotation.z = Math.sin(tailTime.current) * 0.42;
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-4, 2, -4]}
        intensity={0.28}
        color="#c8dcff"
      />

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
  );
}
