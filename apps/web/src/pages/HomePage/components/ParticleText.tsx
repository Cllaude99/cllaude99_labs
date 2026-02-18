import { useEffect, useRef, useState, useCallback } from 'react';

import * as THREE from 'three';

import * as S from './ParticleText.styles';

interface ParticleTextProps {
  lines: string[];
  textColor?: string;
}

interface ParticleData {
  originalX: Float32Array;
  originalY: Float32Array;
  currentX: Float32Array;
  currentY: Float32Array;
  sizes: Float32Array;
  originalSizes: Float32Array;
  count: number;
}

const FONT_FAMILY = "'Black Han Sans', sans-serif";
const FONT_WEIGHT = 400;
const PARTICLE_TEXTURE_SIZE = 64;
const MOUSE_AREA = 250;
const RESIZE_DEBOUNCE_MS = 300;

function getBreakpoint(width: number): 'desktop' | 'tablet' | 'mobile' {
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

function getResponsiveConfig(width: number) {
  if (width >= 1024) {
    return { fontSize: 55, gap: 2, lineSpacing: 1.3 };
  }
  if (width >= 768) {
    return { fontSize: 38, gap: 3, lineSpacing: 1.35 };
  }
  return { fontSize: 22, gap: 3, lineSpacing: 1.4 };
}

function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = PARTICLE_TEXTURE_SIZE;
  canvas.height = PARTICLE_TEXTURE_SIZE;
  const ctx = canvas.getContext('2d')!;

  const half = PARTICLE_TEXTURE_SIZE / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.7, 'rgba(255,255,255,0.4)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, PARTICLE_TEXTURE_SIZE, PARTICLE_TEXTURE_SIZE);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function extractParticles(
  lines: string[],
  containerWidth: number,
  containerHeight: number,
): ParticleData | null {
  const config = getResponsiveConfig(containerWidth);
  const canvas = document.createElement('canvas');
  canvas.width = containerWidth;
  canvas.height = containerHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const font = `${FONT_WEIGHT} ${config.fontSize}px ${FONT_FAMILY}`;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const totalTextHeight = lines.length * config.fontSize * config.lineSpacing;
  const startY =
    containerHeight / 2 - totalTextHeight / 2 + config.fontSize / 2;

  // fillText + strokeText로 텍스트를 두껍게 렌더링
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  lines.forEach((line, i) => {
    const y = startY + i * config.fontSize * config.lineSpacing;
    ctx.fillText(line, containerWidth / 2, y);
    ctx.strokeText(line, containerWidth / 2, y);
  });

  const imageData = ctx.getImageData(0, 0, containerWidth, containerHeight);
  const pixels = imageData.data;

  // 먼저 파티클 개수를 카운트
  let count = 0;
  for (let y = 0; y < containerHeight; y += config.gap) {
    for (let x = 0; x < containerWidth; x += config.gap) {
      const idx = (y * containerWidth + x) * 4;
      if (pixels[idx + 3] > 128) {
        count++;
      }
    }
  }

  if (count === 0) return null;

  const originalX = new Float32Array(count);
  const originalY = new Float32Array(count);
  const currentX = new Float32Array(count);
  const currentY = new Float32Array(count);
  const sizes = new Float32Array(count);
  const originalSizes = new Float32Array(count);

  const baseSize = containerWidth >= 1024 ? 6 : containerWidth >= 768 ? 5 : 4;
  let idx = 0;

  for (let y = 0; y < containerHeight; y += config.gap) {
    for (let x = 0; x < containerWidth; x += config.gap) {
      const pixelIdx = (y * containerWidth + x) * 4;
      if (pixels[pixelIdx + 3] > 128) {
        // Canvas 좌표 → Three.js 좌표 (중심 기준)
        const tx = x - containerWidth / 2;
        const ty = -(y - containerHeight / 2);

        originalX[idx] = tx;
        originalY[idx] = ty;

        // 초기 위치: 랜덤하게 산란
        currentX[idx] = tx + (Math.random() - 0.5) * containerWidth * 0.8;
        currentY[idx] = ty + (Math.random() - 0.5) * containerHeight * 0.8;

        const alphaFactor = pixels[pixelIdx + 3] / 255;
        sizes[idx] = baseSize * (0.5 + alphaFactor * 0.5);
        originalSizes[idx] = sizes[idx];

        idx++;
      }
    }
  }

  return { originalX, originalY, currentX, currentY, sizes, originalSizes, count };
}

const ParticleText = ({ lines, textColor = '#ffffff' }: ParticleTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const particleDataRef = useRef<ParticleData | null>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, isInside: false });
  const entranceProgressRef = useRef(0);
  const breakpointRef = useRef<'desktop' | 'tablet' | 'mobile' | null>(null);
  const ghostGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const ghostMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const initScene = useCallback((skipEntrance = false) => {
    const container = containerRef.current;
    if (!container) return;

    // 기존 리소스 정리
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (geometryRef.current) geometryRef.current.dispose();
    if (materialRef.current) materialRef.current.dispose();
    if (textureRef.current) textureRef.current.dispose();
    if (ghostGeometryRef.current) ghostGeometryRef.current.dispose();
    if (ghostMaterialRef.current) ghostMaterialRef.current.dispose();
    if (rendererRef.current) {
      rendererRef.current.dispose();
      const oldCanvas = container.querySelector('canvas');
      if (oldCanvas) container.removeChild(oldCanvas);
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    breakpointRef.current = getBreakpoint(width);

    // 파티클 데이터 추출
    const particleData = extractParticles(lines, width, height);
    if (!particleData) return;
    particleDataRef.current = particleData;
    entranceProgressRef.current = skipEntrance ? 1 : 0;

    // 리사이즈 시 파티클을 원래 위치에서 바로 시작
    if (skipEntrance) {
      for (let i = 0; i < particleData.count; i++) {
        particleData.currentX[i] = particleData.originalX[i];
        particleData.currentY[i] = particleData.originalY[i];
      }
    }

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      setWebglSupported(false);
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Camera (OrthographicCamera for 2D)
    const halfW = width / 2;
    const halfH = height / 2;
    const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 1000);
    camera.position.z = 500;
    cameraRef.current = camera;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Particle texture
    const texture = createParticleTexture();
    textureRef.current = texture;

    // Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleData.count * 3);
    const colors = new Float32Array(particleData.count * 3);

    const color = new THREE.Color(textColor);

    for (let i = 0; i < particleData.count; i++) {
      positions[i * 3] = particleData.currentX[i];
      positions[i * 3 + 1] = particleData.currentY[i];
      positions[i * 3 + 2] = 0;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(particleData.sizes.slice(), 1));
    geometryRef.current = geometry;

    // ShaderMaterial
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(textColor) },
        pointTexture: { value: texture },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(color * vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Ghost particles (원래 위치에 고정, 마우스 근처에서만 희미하게 보임)
    const ghostGeometry = new THREE.BufferGeometry();
    const ghostPositions = new Float32Array(particleData.count * 3);
    for (let i = 0; i < particleData.count; i++) {
      ghostPositions[i * 3] = particleData.originalX[i];
      ghostPositions[i * 3 + 1] = particleData.originalY[i];
      ghostPositions[i * 3 + 2] = 0;
    }
    ghostGeometry.setAttribute('position', new THREE.BufferAttribute(ghostPositions, 3));
    ghostGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    ghostGeometry.setAttribute('size', new THREE.BufferAttribute(particleData.sizes.slice(), 1));
    ghostGeometryRef.current = ghostGeometry;

    const ghostMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(textColor) },
        pointTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uMouseActive: { value: 0.0 },
        uRadius: { value: MOUSE_AREA },
      },
      vertexShader: `
        uniform vec2 uMouse;
        uniform float uMouseActive;
        uniform float uRadius;
        attribute float size;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = color;
          float dist = distance(position.xy, uMouse);
          float fade = 1.0 - smoothstep(0.0, uRadius, dist);
          vAlpha = fade * uMouseActive;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          if (vAlpha < 0.01) discard;
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          gl_FragColor = vec4(color * vColor * vAlpha * 0.25, 1.0) * texColor;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });
    ghostMaterialRef.current = ghostMaterial;
    scene.add(new THREE.Points(ghostGeometry, ghostMaterial));
    const ghostMat = ghostMaterial;

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const data = particleDataRef.current;
      if (!data) return;

      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const sizeAttr = geometry.getAttribute('size') as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const sizesArr = sizeAttr.array as Float32Array;

      // 등장 애니메이션 진행
      if (entranceProgressRef.current < 1) {
        entranceProgressRef.current = Math.min(entranceProgressRef.current + 0.015, 1);
      }
      const entranceEase = entranceProgressRef.current;

      const mouse = mouseRef.current;
      const mouseArea = MOUSE_AREA;
      const isDown = mouse.isDown;
      const forceMultiplier = isDown ? 6 : 3;
      const ease = isDown ? 0.01 : 0.05;

      for (let i = 0; i < data.count; i++) {
        // 목표 위치 (원래 위치)
        const targetX = data.originalX[i];
        const targetY = data.originalY[i];

        // 현재 위치에서 목표로 easing
        data.currentX[i] += (targetX - data.currentX[i]) * (entranceEase < 1 ? 0.03 : ease);
        data.currentY[i] += (targetY - data.currentY[i]) * (entranceEase < 1 ? 0.03 : ease);

        // 마우스 인터랙션 (등장 완료 후)
        if (mouse.isInside && entranceEase >= 0.7) {
          const dx = data.currentX[i] - mouse.x;
          const dy = data.currentY[i] - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseArea) {
            const force = (1 - dist / mouseArea) * forceMultiplier;
            const angle = Math.atan2(dy, dx);
            const direction = isDown ? -1 : 1;
            data.currentX[i] += Math.cos(angle) * force * direction;
            data.currentY[i] += Math.sin(angle) * force * direction;
          }
        }

        // 사이즈 업데이트
        if (isDown && mouse.isInside) {
          const dx = data.currentX[i] - mouse.x;
          const dy = data.currentY[i] - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseArea) {
            sizesArr[i] = data.originalSizes[i] * (1 + (1 - dist / mouseArea) * 0.5);
          } else {
            sizesArr[i] += (data.originalSizes[i] - sizesArr[i]) * 0.1;
          }
        } else {
          sizesArr[i] += (data.originalSizes[i] - sizesArr[i]) * 0.1;
        }

        pos[i * 3] = data.currentX[i];
        pos[i * 3 + 1] = data.currentY[i];
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;

      // Ghost 파티클 업데이트
      ghostMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
      const ghostTarget = mouse.isInside && entranceEase >= 0.7 ? 1.0 : 0.0;
      ghostMat.uniforms.uMouseActive.value +=
        (ghostTarget - ghostMat.uniforms.uMouseActive.value) * 0.08;

      renderer.render(scene, camera);
    };

    animate();
  }, [lines, textColor]);

  useEffect(() => {
    if (!webglSupported) return;

    // Google Font 로드 + 폰트 로딩 후 초기화
    const init = async () => {
      try {
        if (!document.querySelector('link[href*="family=Black+Han+Sans"]')) {
          const link = document.createElement('link');
          link.href =
            'https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
          // 스타일시트 로딩 완료 대기
          await new Promise<void>((resolve) => {
            link.onload = () => resolve();
            link.onerror = () => resolve();
          });
        }
        await document.fonts.load(`${FONT_WEIGHT} 48px ${FONT_FAMILY}`);
        await document.fonts.ready;
      } catch {
        // 폰트 로딩 실패해도 계속 진행
      }
      initScene();
    };

    init();

    // 리사이즈: 같은 브레이크포인트면 렌더러/카메라만 갱신, 다르면 재생성
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const newBreakpoint = getBreakpoint(width);

        if (newBreakpoint !== breakpointRef.current) {
          // 브레이크포인트 변경 → 폰트 크기가 달라지므로 파티클 재생성
          initScene(true);
        }
        // 같은 브레이크포인트 → 아무것도 하지 않음
        // 캔버스는 초기 크기 고정, 브라우저 CSS 스케일링이 자동 처리
      }, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (geometryRef.current) geometryRef.current.dispose();
      if (materialRef.current) materialRef.current.dispose();
      if (textureRef.current) textureRef.current.dispose();
      if (ghostGeometryRef.current) ghostGeometryRef.current.dispose();
      if (ghostMaterialRef.current) ghostMaterialRef.current.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initScene, webglSupported]);

  // 마우스/터치 이벤트
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !webglSupported) return;

    const toThreeCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      return {
        x: clientX - rect.left - rect.width / 2,
        y: -(clientY - rect.top - rect.height / 2),
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      const coords = toThreeCoords(e.clientX, e.clientY);
      mouseRef.current.x = coords.x;
      mouseRef.current.y = coords.y;
    };

    const onMouseDown = () => {
      mouseRef.current.isDown = true;
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const onMouseEnter = () => {
      mouseRef.current.isInside = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.isInside = false;
      mouseRef.current.isDown = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const coords = toThreeCoords(e.touches[0].clientX, e.touches[0].clientY);
        mouseRef.current.x = coords.x;
        mouseRef.current.y = coords.y;
        mouseRef.current.isDown = true;
        mouseRef.current.isInside = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const coords = toThreeCoords(e.touches[0].clientX, e.touches[0].clientY);
        mouseRef.current.x = coords.x;
        mouseRef.current.y = coords.y;
      }
    };

    const onTouchEnd = () => {
      mouseRef.current.isDown = false;
      mouseRef.current.isInside = false;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [webglSupported]);

  // WebGL 미지원 폴백
  if (!webglSupported) {
    return (
      <S.FallbackWrapper>
        <S.FallbackTitle>{lines[0]}</S.FallbackTitle>
        {lines[1] && <S.FallbackSubtitle>{lines[1]}</S.FallbackSubtitle>}
      </S.FallbackWrapper>
    );
  }

  return (
    <S.Container ref={containerRef}>
      <S.ScreenReaderOnly>{lines.join(' ')}</S.ScreenReaderOnly>
      <S.GuideWrapper>
        <S.MouseIcon />
        <S.GuideText>클릭하여 인터랙션</S.GuideText>
      </S.GuideWrapper>
    </S.Container>
  );
};

export default ParticleText;
