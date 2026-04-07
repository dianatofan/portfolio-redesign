import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './BounceCards.css';

export default function BounceCards({
  className = '',
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)'
  ],
  enableHover = true
}) {
  const containerRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    index: null,
    originX: 0,
    originY: 0
  });
  const dragOffsetsRef = useRef(new Map());
  const hoveredIndexRef = useRef(null);
  const [cardDimensions, setCardDimensions] = useState({ width: 200, height: 260 });

  // Update card dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setCardDimensions({ width: 100, height: 130 });
      } else if (width <= 640) {
        setCardDimensions({ width: 120, height: 156 });
      } else if (width <= 768) {
        setCardDimensions({ width: 140, height: 182 });
      } else if (width <= 1024) {
        setCardDimensions({ width: 160, height: 208 });
      } else {
        setCardDimensions({ width: 200, height: 260 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getDragOffset = index => dragOffsetsRef.current.get(index) || { x: 0, y: 0 };

  const buildTransform = (baseTransform, dragOffset, scale = 1) => {
    const normalizedBase = baseTransform === 'none' ? '' : baseTransform;
    const dragTransform = ` translate(${dragOffset.x}px, ${dragOffset.y}px)`;
    const scaleTransform = scale !== 1 ? ` scale(${scale})` : '';
    return `${normalizedBase}${dragTransform}${scaleTransform}`.trim();
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.card',
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = transformStr => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (baseTransform, offsetX) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = hoveredIdx => {
    if (!enableHover || !containerRef.current) return;

    hoveredIndexRef.current = hoveredIdx;
    const q = gsap.utils.selector(containerRef);

    // Responsive push offset based on screen size
    const width = window.innerWidth;
    let offsetX = 60;
    if (width <= 480) {
      offsetX = 30;
    } else if (width <= 640) {
      offsetX = 35;
    } else if (width <= 768) {
      offsetX = 40;
    } else if (width <= 1024) {
      offsetX = 50;
    }

    images.forEach((_, i) => {
      const target = q(`.card-${i}`);
      gsap.killTweensOf(target);

      const baseTransform = transformStyles[i] || 'none';
      const dragOffset = getDragOffset(i);

      if (i === hoveredIdx) {
        // Add hovered class for border transition
        target[0]?.classList.add('hovered');

        const noRotationTransform = getNoRotationTransform(baseTransform);
        gsap.to(target, {
          transform: buildTransform(noRotationTransform, dragOffset, 1.35),
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto'
        });
      } else {
        // Remove hovered class from siblings
        target[0]?.classList.remove('hovered');

        const offset = i < hoveredIdx ? -offsetX : offsetX;
        const pushedTransform = getPushedTransform(baseTransform, offset);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(target, {
          transform: buildTransform(pushedTransform, dragOffset),
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto'
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;

    hoveredIndexRef.current = null;
    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
      const target = q(`.card-${i}`);
      gsap.killTweensOf(target);

      // Remove hovered class
      target[0]?.classList.remove('hovered');

      const baseTransform = transformStyles[i] || 'none';
      const dragOffset = getDragOffset(i);
      gsap.to(target, {
        transform: buildTransform(baseTransform, dragOffset),
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto'
      });
    });
  };

  const handlePointerDown = (event, index) => {
    if (!containerRef.current) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const dragOffset = getDragOffset(index);
    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      index,
      originX: dragOffset.x,
      originY: dragOffset.y
    };
  };

  const handlePointerMove = event => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    // Get container bounds
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const cardWidth = cardDimensions.width;
    const cardHeight = cardDimensions.height;

    // Calculate max bounds (keep card within container)
    const maxX = (containerRect.width - cardWidth) / 2;
    const maxY = (containerRect.height - cardHeight) / 2;

    // Constrain the drag offset to stay within bounds
    let nextX = dragState.originX + deltaX;
    let nextY = dragState.originY + deltaY;

    nextX = Math.max(-maxX, Math.min(maxX, nextX));
    nextY = Math.max(-maxY, Math.min(maxY, nextY));

    dragOffsetsRef.current.set(dragState.index, { x: nextX, y: nextY });

    const q = gsap.utils.selector(containerRef);
    const target = q(`.card-${dragState.index}`);
    const baseTransform = transformStyles[dragState.index] || 'none';
    const dragOffset = getDragOffset(dragState.index);
    const isHovered = hoveredIndexRef.current === dragState.index;
    const scale = isHovered ? 1.35 : 1;
    const base = isHovered ? getNoRotationTransform(baseTransform) : baseTransform;

    gsap.set(target, {
      transform: buildTransform(base, dragOffset, scale)
    });
  };

  const handlePointerUp = event => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || dragState.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStateRef.current = {
      isDragging: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      index: null,
      originX: 0,
      originY: 0
    };
  };

  return (
    <div
      className={`bounceCardsContainer ${className}`}
      ref={containerRef}
      style={{
        position: 'relative',
        height: containerHeight
      }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`card card-${idx}`}
          style={{
            transform: buildTransform(transformStyles[idx] ?? 'none', getDragOffset(idx))
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
          onPointerDown={event => handlePointerDown(event, idx)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img
            className="image"
            src={src}
            alt={`card-${idx}`}
            loading={idx < 2 ? 'eager' : 'lazy'}
            fetchPriority={idx < 2 ? 'high' : 'auto'}
            decoding="async"
            width="900"
            height="1170"
          />
        </div>
      ))}
    </div>
  );
}
