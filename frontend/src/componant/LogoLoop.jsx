import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";

// Animation configuration constants
const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const toCssLength = (value) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;

const cx = (...parts) => parts.filter(Boolean).join(" ");

// Hook to track container and content width
const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener("resize", handleResize);
      callback();
      return () => window.removeEventListener("resize", handleResize);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();
    return () => observers.forEach((o) => o?.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

// Hook to ensure all images are loaded before measuring
const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remaining = images.length;
    const handleLoad = () => {
      remaining -= 1;
      if (remaining === 0) onLoad();
    };

    images.forEach((img) => {
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener("load", handleLoad, { once: true });
        img.addEventListener("error", handleLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleLoad);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

// Hook to run smooth animation
const useAnimationLoop = (
  trackRef,
  targetVelocity,
  seqWidth,
  isHovered,
  pauseOnHover
) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    if (prefersReduced) {
      track.style.transform = "translate3d(0, 0, 0)";
      return () => {
        lastTimestampRef.current = null;
      };
    }

    const animate = (timestamp) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;

      const easing = 1 - Math.exp(-delta / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easing;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * delta;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;

        track.style.transform = `translate3d(${-nextOffset}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover, trackRef]);
};

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = "left",
    width = "100%",
    logoHeight = 28,
    gap = 32,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    ariaLabel = "Partner logos",
    className,
    style,
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const dir = direction === "left" ? 1 : -1;
      const sign = speed < 0 ? -1 : 1;
      return magnitude * dir * sign;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth =
        seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) +
          ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, []);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [
      logos,
      gap,
      logoHeight,
    ]);
    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);
    useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover);

    const cssVars = useMemo(
      () => ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
        ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const handleEnter = () => pauseOnHover && setIsHovered(true);
    const handleLeave = () => pauseOnHover && setIsHovered(false);

    const renderLogoItem = useCallback(
      (item, key) => {
        const isNode = "node" in item;

        const content = isNode ? (
          <span
            className={cx(
              "inline-flex items-center",
              scaleOnHover &&
                "transition-transform duration-300 group-hover/item:scale-120"
            )}
          >
            {item.node}
          </span>
        ) : (
          <img
            className={cx(
              "h-[var(--logoloop-logoHeight)] w-auto object-contain block",
              scaleOnHover &&
                "transition-transform duration-300 group-hover/item:scale-120"
            )}
            src={item.src}
            alt={item.alt ?? ""}
          />
        );

        return (
          <li
            className={cx(
              "flex-none mr-[var(--logoloop-gap)] text-[length:var(--logoloop-logoHeight)]",
              scaleOnHover && "group/item"
            )}
            key={key}
          >
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer">
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        );
      },
      [scaleOnHover]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, i) => (
          <ul
            className="flex items-center"
            key={`copy-${i}`}
            aria-hidden={i > 0}
            ref={i === 0 ? seqRef : undefined}
          >
            {logos.map((item, idx) => renderLogoItem(item, `${i}-${idx}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    return (
      <div
        ref={containerRef}
        className={cx(
          "relative overflow-x-hidden group",
          "dark:[--logoloop-fadeColorAuto:#0b0b0b]",
          className
        )}
        style={{ width: toCssLength(width) ?? "100%", ...cssVars, ...style }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {fadeOut && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_right,var(--logoloop-fadeColor,#fff)_0%,transparent_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_left,var(--logoloop-fadeColor,#fff)_0%,transparent_100%)]" />
          </>
        )}
        <div
          className="flex w-max will-change-transform select-none"
          ref={trackRef}
        >
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = "LogoLoop";

export default LogoLoop;
