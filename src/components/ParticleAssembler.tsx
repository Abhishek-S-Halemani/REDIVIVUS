import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ParticleAssemblerProps {
  onEnterApp: () => void;
}

interface Particle3DData {
  id: number;
  type: 'bottle' | 'paper_roll' | 'pink_roll' | 'cardboard' | 'crushed_paper' | 'juice_can';
  typeName: string;
  icon: string;
  group: THREE.Group;
  shadowMesh: THREE.Mesh;
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  startX: number;
  startY: number;
  startZ: number;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  delay: number;
  scale: number;
  isHovered: boolean;
}

// Procedural texture for ground contact shadows
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(20, 25, 20, 0.55)');
  grad.addColorStop(0.4, 'rgba(20, 25, 20, 0.25)');
  grad.addColorStop(1, 'rgba(20, 25, 20, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Procedural texture for paper roll
function createPaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#f8f6f0';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#e8e4d8';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 256; i += 12) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Procedural texture for Cardboard Box with recycle stamp
function createCardboardBoxTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#c8965d';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, 2, 1);
  }

  ctx.fillStyle = '#3d2510';
  ctx.font = 'bold 64px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('♻ RECYCLABLE', 256, 280);
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KRAFT ECO BOX', 256, 330);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Procedural texture for Juice Can Label
function createJuiceCanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#ea580c');
  grad.addColorStop(0.5, '#f97316');
  grad.addColorStop(1, '#c2410c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 18);
  ctx.fillRect(0, 238, 512, 18);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ORANGE JUICE', 256, 115);
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('🍊 100% NATURAL', 256, 175);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 1. Plastic Water Bottle
function createPlasticBottleMesh(): THREE.Group {
  const group = new THREE.Group();

  const bottleGeo = new THREE.CylinderGeometry(0.35, 0.38, 1.3, 20, 10);
  const pos = bottleGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const x = pos.getX(i);
    const z = pos.getZ(i);
    if (y > 0.35) {
      const factor = Math.max(0.3, 1 - (y - 0.35) * 1.6);
      pos.setX(i, x * factor);
      pos.setZ(i, z * factor);
    }
    if (y > -0.2 && y < 0.2) {
      const rib = 1 + Math.sin(y * 22) * 0.05;
      pos.setX(i, x * rib);
      pos.setZ(i, z * rib);
    }
  }
  bottleGeo.computeVertexNormals();

  const bottleMat = new THREE.MeshPhysicalMaterial({
    color: 0xc2f3ec,
    transmission: 0.88,
    opacity: 0.9,
    transparent: true,
    roughness: 0.12,
    ior: 1.45,
    thickness: 0.4,
    clearcoat: 0.8,
  });
  const bodyMesh = new THREE.Mesh(bottleGeo, bottleMat);
  group.add(bodyMesh);

  const capGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.22, 16);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.25 });
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.y = 0.76;
  group.add(capMesh);

  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 256;
  labelCanvas.height = 128;
  const lctx = labelCanvas.getContext('2d')!;
  lctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  lctx.fillRect(0, 0, 256, 128);
  lctx.fillStyle = '#0d9488';
  lctx.font = 'bold 28px sans-serif';
  lctx.textAlign = 'center';
  lctx.fillText('♻ ECO PET', 128, 70);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;

  const labelGeo = new THREE.CylinderGeometry(0.385, 0.385, 0.45, 20, 1, true);
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.y = -0.05;
  group.add(labelMesh);

  return group;
}

// 2. White Paper Roll
function createPaperRollMesh(): THREE.Group {
  const group = new THREE.Group();

  const rollGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.1, 24);
  const paperTex = createPaperTexture();
  const rollMat = new THREE.MeshStandardMaterial({
    color: 0xf8f6f0,
    roughness: 0.65,
    map: paperTex,
  });
  const rollMesh = new THREE.Mesh(rollGeo, rollMat);
  group.add(rollMesh);

  const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.12, 24, 1, true);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xa87848,
    roughness: 0.85,
    side: THREE.DoubleSide,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  const sheetGeo = new THREE.PlaneGeometry(0.55, 0.85, 10, 10);
  const pos = sheetGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, Math.sin(x * 3.5) * 0.12 + (x + 0.2) * 0.1);
  }
  sheetGeo.computeVertexNormals();
  const sheetMat = new THREE.MeshStandardMaterial({
    color: 0xfcfaf5,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });
  const sheetMesh = new THREE.Mesh(sheetGeo, sheetMat);
  sheetMesh.position.set(0.38, -0.1, 0.08);
  sheetMesh.rotation.y = Math.PI / 4;
  group.add(sheetMesh);

  return group;
}

// 3. Pink Toilet Paper / Paper Roll
function createPinkPaperRollMesh(): THREE.Group {
  const group = new THREE.Group();

  const rollGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.05, 24);
  const rollMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.6,
  });
  const rollMesh = new THREE.Mesh(rollGeo, rollMat);
  group.add(rollMesh);

  const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.07, 24, 1, true);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xbe185d,
    roughness: 0.85,
    side: THREE.DoubleSide,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  const sheetGeo = new THREE.PlaneGeometry(0.5, 0.8, 8, 8);
  const pos = sheetGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, Math.sin(x * 3) * 0.1);
  }
  sheetGeo.computeVertexNormals();
  const sheetMat = new THREE.MeshStandardMaterial({
    color: 0xfbcfe8,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });
  const sheetMesh = new THREE.Mesh(sheetGeo, sheetMat);
  sheetMesh.position.set(0.36, -0.1, 0.08);
  sheetMesh.rotation.y = Math.PI / 4;
  group.add(sheetMesh);

  return group;
}

// 4. Cardboard Box
function createCardboardBoxMesh(): THREE.Group {
  const group = new THREE.Group();

  const boxGeo = new THREE.BoxGeometry(0.85, 0.75, 0.85);
  const boxTex = createCardboardBoxTexture();
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0xc8965d,
    roughness: 0.8,
    map: boxTex,
  });
  const boxMesh = new THREE.Mesh(boxGeo, boxMat);
  group.add(boxMesh);

  const tapeGeo = new THREE.PlaneGeometry(0.87, 0.2);
  const tapeMat = new THREE.MeshStandardMaterial({
    color: 0x926030,
    roughness: 0.4,
    metalness: 0.15,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const tapeMesh = new THREE.Mesh(tapeGeo, tapeMat);
  tapeMesh.rotation.x = -Math.PI / 2;
  tapeMesh.position.y = 0.376;
  group.add(tapeMesh);

  return group;
}

// 5. Crushed Origami Paper Ball
function createCrushedPaperMesh(): THREE.Group {
  const group = new THREE.Group();

  const paperGeo = new THREE.IcosahedronGeometry(0.48, 2);
  const pos = paperGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const disp = 1 + (Math.sin(x * 10 + y * 6) + Math.cos(z * 8)) * 0.14;
    pos.setXYZ(i, x * disp, y * disp, z * disp);
  }
  paperGeo.computeVertexNormals();

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xf4efe6,
    roughness: 0.9,
    flatShading: true,
  });
  const paperMesh = new THREE.Mesh(paperGeo, paperMat);
  group.add(paperMesh);

  return group;
}

// 6. Juice Can
function createJuiceCanMesh(): THREE.Group {
  const group = new THREE.Group();

  const canGeo = new THREE.CylinderGeometry(0.36, 0.36, 1.05, 24);
  const juiceTex = createJuiceCanTexture();
  const canMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.55,
    map: juiceTex,
  });
  const canMesh = new THREE.Mesh(canGeo, canMat);
  group.add(canMesh);

  const rimGeo = new THREE.TorusGeometry(0.36, 0.028, 8, 24);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.15,
  });
  const topRim = new THREE.Mesh(rimGeo, rimMat);
  topRim.rotation.x = Math.PI / 2;
  topRim.position.y = 0.525;
  group.add(topRim);

  const bottomRim = new THREE.Mesh(rimGeo, rimMat);
  bottomRim.rotation.x = Math.PI / 2;
  bottomRim.position.y = -0.525;
  group.add(bottomRim);

  const tabGeo = new THREE.BoxGeometry(0.1, 0.02, 0.18);
  const tabMesh = new THREE.Mesh(tabGeo, rimMat);
  tabMesh.position.set(0.06, 0.535, 0);
  group.add(tabMesh);

  return group;
}

export const ParticleAssembler: React.FC<ParticleAssemblerProps> = ({ onEnterApp }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle3DData[]>([]);
  const isTextHoveredRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  const mousePosRef = useRef<{ x: number; y: number; worldX: number; worldY: number; active: boolean }>({
    x: -1000,
    y: -1000,
    worldX: -1000,
    worldY: -1000,
    active: false,
  });

  const [isTextHovered, setIsTextHovered] = useState<boolean>(false);

  // Generate 25 perimeter points closely packed around REDIVIVUS
  const generate25PerimeterTargets = useCallback(() => {
    const targets: { x: number; y: number; z: number }[] = [];
    const letterX = [-5.2, -3.9, -2.6, -1.3, 0.0, 1.3, 2.6, 3.9, 5.2];

    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * Math.PI * 2;
      const letterIdx = i % letterX.length;
      const baseX = letterX[letterIdx];
      const offsetX = Math.cos(angle) * (0.85 + (i % 3) * 0.15);
      const offsetY = Math.sin(angle) * (1.1 + (i % 2) * 0.25);
      const targetZ = -0.6 - (i % 5) * 0.25;

      targets.push({
        x: baseX + offsetX * 0.7,
        y: offsetY * 0.85,
        z: targetZ,
      });
    }

    return targets;
  }, []);

  // Initialize Three.js Scene, Camera, Renderer & 25 particles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 14);

    // 2. RENDERER WITH SRGB & ACES FILMIC TONE MAPPING
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    container.appendChild(renderer.domElement);

    // 3. STUDIO ENVIRONMENT & LIGHTING RIG
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const keyLight = new THREE.DirectionalLight(0xfff8e7, 2.2);
    keyLight.position.set(5, 8, 10);
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x0d9488, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.5);
    rimLight.position.set(-8, -4, -5);
    scene.add(rimLight);

    // 4. GROUND CONTACT SHADOW SETUP
    const shadowTexture = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);

    // 5. CREATE 3D WASTE PARTICLES WITH GROUND CONTACT SHADOWS
    const targets = generate25PerimeterTargets();
    const particlesData: Particle3DData[] = [];

    const wasteTypes: Array<{
      type: 'bottle' | 'paper_roll' | 'pink_roll' | 'cardboard' | 'crushed_paper' | 'juice_can';
      name: string;
      icon: string;
      createMesh: () => THREE.Group;
    }> = [
      { type: 'bottle', name: 'Translucent Water Bottle', icon: '🍾', createMesh: createPlasticBottleMesh },
      { type: 'paper_roll', name: 'White Paper Roll', icon: '🧻', createMesh: createPaperRollMesh },
      { type: 'pink_roll', name: 'Pink Eco Toilet Paper', icon: '🧻', createMesh: createPinkPaperRollMesh },
      { type: 'cardboard', name: 'Kraft Cardboard Box', icon: '📦', createMesh: createCardboardBoxMesh },
      { type: 'crushed_paper', name: 'Origami Paper Ball', icon: '📄', createMesh: createCrushedPaperMesh },
      { type: 'juice_can', name: 'Aluminum Juice Can', icon: '🥫', createMesh: createJuiceCanMesh },
    ];

    for (let i = 0; i < 25; i++) {
      const target = targets[i];
      const waste = wasteTypes[i % wasteTypes.length];
      const group = waste.createMesh();

      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 12;
      const startX = Math.cos(angle) * radius;
      const startY = Math.sin(angle) * radius;
      const startZ = -10 + (Math.random() - 0.5) * 20;

      group.position.set(startX, startY, startZ);

      const rotX = Math.random() * Math.PI * 2;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = Math.random() * Math.PI * 2;
      group.rotation.set(rotX, rotY, rotZ);

      scene.add(group);

      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.set(startX, -1.8, startZ);
      scene.add(shadowMesh);

      particlesData.push({
        id: i,
        type: waste.type,
        typeName: waste.name,
        icon: waste.icon,
        group,
        shadowMesh,
        x: startX,
        y: startY,
        z: startZ,
        targetX: target.x,
        targetY: target.y,
        targetZ: target.z,
        startX,
        startY,
        startZ,
        vx: 0,
        vy: 0,
        vz: 0,
        rotX,
        rotY,
        rotZ,
        vRotX: (Math.random() - 0.5) * 0.08,
        vRotY: (Math.random() - 0.5) * 0.08,
        vRotZ: (Math.random() - 0.5) * 0.08,
        delay: i * 0.08,
        scale: 0.95 + Math.random() * 0.25,
        isHovered: false,
      });
    }

    particlesRef.current = particlesData;

    // 6. ANIMATION LOOP WITH DAMPED SPRING PHYSICS & HOVER INTERACTIVITY
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      const isTextHovered = isTextHoveredRef.current;
      const mouse = mousePosRef.current;

      particlesData.forEach((p) => {
        if (elapsed < p.delay) return;

        // Damped spring physics towards target
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dz = p.targetZ - p.z;

        const spring = 0.008;
        const friction = 0.92;

        p.vx = (p.vx + dx * spring) * friction;
        p.vy = (p.vy + dy * spring) * friction;
        p.vz = (p.vz + dz * spring) * friction;

        // MOUSE HOVER DISTANCE & PHYSICAL IMPULSE REACTION
        let mouseDist = 999;
        let repelX = 0;
        let repelY = 0;
        let hoverPopZ = 0;
        let targetScale = p.scale;

        if (mouse.active) {
          const mdx = p.x - mouse.worldX;
          const mdy = p.y - mouse.worldY;
          mouseDist = Math.hypot(mdx, mdy);

          // Within 2.4 world units radius of cursor: Interactive Hover Pop!
          if (mouseDist < 2.4) {
            p.isHovered = true;
            const force = (1 - mouseDist / 2.4) * 0.35;
            repelX = (mdx / (mouseDist || 1)) * force;
            repelY = (mdy / (mouseDist || 1)) * force;

            // Apply playful spin impulse
            p.vRotX += (Math.random() - 0.5) * 0.08;
            p.vRotY += 0.06;
            p.vRotZ += (Math.random() - 0.5) * 0.08;

            hoverPopZ = 0.6;
            targetScale = p.scale * 1.35;
          } else {
            p.isHovered = false;
          }
        }

        // Text hover global lift
        let textHoverLiftY = 0;
        let textHoverLiftZ = 0;
        if (isTextHovered) {
          textHoverLiftY = Math.sin(time * 0.003 + p.id) * 0.18;
          textHoverLiftZ = 0.25;
        }

        p.vx += repelX;
        p.vy += repelY;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        p.rotX += p.vRotX;
        p.rotY += p.vRotY;
        p.rotZ += p.vRotZ;

        p.vRotX *= 0.95;
        p.vRotY *= 0.95;
        p.vRotZ *= 0.95;

        const floatWave = Math.sin(time * 0.002 + p.id * 0.5) * 0.08;
        const currentY = p.y + floatWave + textHoverLiftY;
        const currentZ = p.z + textHoverLiftZ + hoverPopZ;

        p.group.position.set(p.x, currentY, currentZ);
        p.group.rotation.set(p.rotX, p.rotY, p.rotZ);
        p.group.scale.setScalar(targetScale);

        // Update ground contact shadow position & scale/opacity based on height
        const floorY = -1.8;
        const heightAboveFloor = Math.max(0, currentY - floorY);

        p.shadowMesh.position.set(p.x, floorY, currentZ);
        const shadowScale = Math.max(0.6, 1.0 + heightAboveFloor * 0.18);
        p.shadowMesh.scale.set(shadowScale, shadowScale, 1);

        const shadowMat = p.shadowMesh.material as THREE.MeshBasicMaterial;
        shadowMat.opacity = Math.max(0.04, Math.min(0.48, 0.48 - heightAboveFloor * 0.12));
      });

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [generate25PerimeterTargets]);

  // Track Mouse Pointer Position in 3D World Space for Hover Physics
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert screen coordinates to 3D world space (Z = -0.8 depth plane)
    const normX = (x / rect.width) * 2 - 1;
    const normY = -(y / rect.height) * 2 + 1;

    // World units projection at camera Z = 14
    const worldX = normX * 6.8;
    const worldY = normY * 4.2;

    mousePosRef.current = {
      x,
      y,
      worldX,
      worldY,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    mousePosRef.current.active = false;
  };

  const handleMouseEnterText = () => {
    isTextHoveredRef.current = true;
    setIsTextHovered(true);
  };

  const handleMouseLeaveText = () => {
    isTextHoveredRef.current = false;
    setIsTextHovered(false);
  };

  // Trigger physics scatter burst before entering app
  const handleEnter = () => {
    particlesRef.current.forEach((p) => {
      const angle = Math.random() * Math.PI * 2;
      const force = 8 + Math.random() * 10;
      p.vx = Math.cos(angle) * force;
      p.vy = Math.sin(angle) * force;
      p.vz = (Math.random() - 0.5) * force;
      p.vRotX = (Math.random() - 0.5) * 0.4;
      p.vRotY = (Math.random() - 0.5) * 0.4;
    });

    setTimeout(() => {
      onEnterApp();
    }, 380);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-screen bg-[#efe8d5] flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* Warm Gold Radial Luminous Stage Glow in Center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(254, 245, 225, 0.85) 0%, rgba(239, 232, 213, 0.5) 55%, rgba(239, 232, 213, 0) 80%)',
        }}
      />

      {/* 3D WebGL Canvas for Interactive Backdrop Particles & Ground Shadows */}
      <div ref={containerRef} className="absolute inset-0 z-10 w-full h-full pointer-events-none" />

      {/* Foreground 100% Solid REDIVIVUS Logo Centerpiece Button */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto">
        <button
          onClick={handleEnter}
          onMouseEnter={handleMouseEnterText}
          onMouseLeave={handleMouseLeaveText}
          className="group relative flex flex-col items-center focus:outline-none cursor-pointer transition-transform duration-300 active:scale-95"
          aria-label="Enter REDIVIVUS Platform"
        >
          {/* Central Logo Text: Deep Mediterranean Teal */}
          <h1
            className={`font-sans text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight transition-all duration-300 ${
              isTextHovered ? 'text-[#0d9488] scale-105' : 'text-[#0f5c56]'
            }`}
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              filter: isTextHovered
                ? 'drop-shadow(0px 12px 28px rgba(13, 148, 136, 0.45))'
                : 'drop-shadow(0px 8px 24px rgba(15, 92, 86, 0.22))',
            }}
          >
            REDIVIVUS
          </h1>

          {/* Hover instruction pill (matches frame 00:06-00:08 in reference video) */}
          <div
            className={`mt-4 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#0d9488]/20 shadow-md text-[11px] font-bold tracking-widest text-[#0f5c56] transition-all duration-300 ${
              isTextHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
            }`}
          >
            ✦ CLICK REDIVIVUS TO ENTER PLATFORM ✦
          </div>
        </button>
      </div>
    </div>
  );
};
