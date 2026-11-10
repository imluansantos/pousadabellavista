'use client';

// DriftWall — baseado no componente do React Bits
// (https://reactbits.dev/components/drift-wall): mesmo plano 3D inclinado,
// mesmas classes, máscara, véu, "lift" no hover e parallax do cursor.
//
// DIFERENÇA (pedido do site): em vez de cada coluna girar em loop sozinha,
// TODAS as fotos formam UMA fita contínua que serpenteia pelas colunas, como
// um filme antigo dobrado em sanfona:
//
//   coluna 1 sobe ↑ → dobra no topo → coluna 2 desce ↓ → dobra na base →
//   coluna 3 sobe ↑ → … → última coluna → volta à primeira.
//
// Uma foto que sai pelo topo da coluna 1 entra pelo topo da coluna 2 (à
// direita), e assim por diante. As dobras ficam fora da área visível (o
// plano é bem mais alto que a seção e as bordas são esmaecidas pela
// máscara), então só se vê o "meio" de cada trecho da fita.
//
// Como as colunas fazem parte da mesma fita, o hover pausa a fita inteira
// (pausar uma coluna só quebraria a continuidade).

import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

export interface DriftWallItem {
  image: string;
  title?: string | undefined;
  href?: string | undefined;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  parallax?: number;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_ITEMS: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return {
    image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
    title: `Tile ${i + 1}`
  };
});

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = 'up',
  parallax = 0.6,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = '#060010',
  className = '',
  style
}: DriftWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const progressRef = useRef(0); // posição da fita ao longo do caminho (px)
  const velocityRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(false);
  // o mural só anima enquanto aparece na tela (e com a aba visível): fora
  // dela o loop para, poupando CPU/GPU e bateria no celular
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNaTela(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setNaTela(Boolean(e?.isIntersecting)), {
      rootMargin: '120px 0px'
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry?.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const unit = tileHeight + gap; // altura de uma foto na fita
  const colWidth = tileWidth + gap;

  // A fita: a lista de fotos repetida o suficiente para que cada trecho
  // (coluna) seja bem mais alto que a área visível — assim as dobras do
  // topo e da base nunca aparecem.
  const strip = useMemo<DriftWallItem[]>(() => {
    if (!items.length) return [];
    let repeats = 1;
    while ((items.length * repeats * unit) / columns < containerHeight * 1.8 + unit * 2) repeats++;
    return Array.from({ length: items.length * repeats }, (_, k) => items[k % items.length]!);
  }, [items, columns, unit, containerHeight]);

  const segment = (strip.length * unit) / columns; // comprimento de cada trecho (coluna)
  const pathLength = segment * columns;

  /** posição (x, y) no plano da foto k para um avanço `progress` da fita */
  const placeTile = useCallback(
    (k: number, progress: number) => {
      const x = (((k * unit + progress) % pathLength) + pathLength) % pathLength;
      const col = Math.min(columns - 1, Math.floor(x / segment));
      const local = x - col * segment;
      // colunas pares sobem (entram pela base), ímpares descem (entram pelo topo)
      const y = col % 2 === 0 ? segment - local - unit : local - unit;
      return `translate3d(${col * colWidth}px, ${y}px, 0)`;
    },
    [unit, pathLength, columns, segment, colWidth]
  );

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    if (!naTela) return;
    const baseVelocity = speed * (direction === 'up' ? 1 : -1);

    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced && pathLength > 0) {
        // foto em destaque (hover/foco) → a fita inteira desacelera até parar
        const target = activeIdRef.current !== null ? 0 : baseVelocity;
        const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
        velocityRef.current += (target - velocityRef.current) * ease;
        progressRef.current = (progressRef.current + velocityRef.current * dt) % pathLength;

        for (let k = 0; k < tileRefs.current.length; k++) {
          const el = tileRefs.current[k];
          if (el) el.style.transform = placeTile(k, progressRef.current);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [naTela, speed, direction, parallax, reduced, pathLength, placeTile, applyPlaneTransform]);

  const activate = useCallback((id: string): void => {
    activeIdRef.current = id;
    setActiveId(id);
  }, []);
  const release = useCallback((): void => {
    activeIdRef.current = null;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null;
      if (!tile) return;
      const id = tile.dataset['tileId'] ?? null;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback((): void => {
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const maskStyle =
    'radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%), ' +
    'linear-gradient(to top, #000 var(--dw-edge), transparent 100%)';

  const cssVars = useMemo<CSSProperties>(
    () =>
      ({
        '--dw-tile-w': `${tileWidth}px`,
        '--dw-tile-h': `${tileHeight}px`,
        '--dw-gap': `${gap}px`,
        '--dw-radius': `${radius}px`,
        '--dw-lift': `${lift}px`,
        '--dw-dim': dim,
        '--dw-gray': grayscale ? 1 : 0,
        '--dw-overlay': overlayColor,
        '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        WebkitMaskImage: maskStyle,
        maskImage: maskStyle,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
        ...style
      }) as CSSProperties,
    [tileWidth, tileHeight, gap, radius, lift, dim, grayscale, overlayColor, fade, perspective, maskStyle, style]
  );

  const tileClass = cx(
    'group/tile absolute left-0 top-0 block cursor-pointer outline-none will-change-transform',
    'w-[calc(var(--dw-tile-w)+var(--dw-gap))] h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]'
  );
  const innerClass = cx(
    'pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-[#0b0b12]',
    'rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [transform:translateZ(0)]',
    'transition-[transform,opacity,box-shadow] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))]',
    'group-[.is-active]/tile:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)]',
    'group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:translateZ(var(--dw-lift))]',
    'group-focus-visible/tile:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7),0_0_0_2px_rgba(255,255,255,0.9)]'
  );
  const imgClass = cx(
    'block h-full w-full select-none object-cover',
    // sem filtro em repouso (filtro em dezenas de fotos em movimento pesa no
    // celular); o leve realce de cor fica só na foto em destaque
    grayscale && '[filter:grayscale(1)]',
    'transition-[filter] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.05)] group-focus-visible/tile:[filter:grayscale(0)_saturate(1.05)]'
  );
  const overlayClass = cx(
    'pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.42]',
    'transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:opacity-0 group-focus-visible/tile:opacity-0'
  );

  const renderTile = (item: DriftWallItem, k: number) => {
    const id = String(k);
    const inner = (
      <span className={innerClass}>
        <img
          src={item.image}
          alt={item.title ?? ''}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={imgClass}
        />
        <span className={overlayClass} aria-hidden="true" />
      </span>
    );
    const commonProps = {
      className: cx(tileClass, activeId === id && 'is-active'),
      style: { transform: placeTile(k, progressRef.current) },
      'data-tile-id': id,
      ref: (el: HTMLElement | null) => {
        tileRefs.current[k] = el;
      },
      onFocus: () => activate(id),
      onBlur: release
    };
    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    );
  };

  // mantém o array de refs do tamanho da fita atual
  tileRefs.current.length = strip.length;

  return (
    <div
      ref={containerRef}
      className={cx('relative h-full w-full overflow-hidden', className)}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Galeria de fotos em movimento"
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 cursor-pointer [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
        style={{ width: columns * colWidth, height: segment }}
      >
        {strip.map((item, k) => renderTile(item, k))}
      </div>
    </div>
  );
};

export default DriftWall;
