import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIsDesktop } from "../hooks/useMediaQuery";

const BG_LANDSCAPE = "/brand/bg-ribbons.jpg";
const BG_PORTRAIT = "/brand/bg-ribbons-portrait.jpg";

interface Orb {
  size: number;
  x: string;
  y: string;
  tint: string;
  drift: [number, number];
  duration: number;
  delay: number;
}

const orbs: Orb[] = [
  { size: 420, x: "-20%", y: "-12%", tint: "rgba(217, 168, 58, 0.16)", drift: [26, 32], duration: 36, delay: 0 },
  { size: 340, x: "58%", y: "62%", tint: "rgba(154, 123, 79, 0.18)", drift: [-24, -26], duration: 44, delay: 5 },
];

/** Deterministic particle field: transform and opacity only. */
const particles = Array.from({ length: 12 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  return {
    left: `${(r * 100).toFixed(2)}%`,
    top: `${(((i * 41) % 100) + r * 4).toFixed(2)}%`,
    size: 1 + (i % 3) * 0.6,
    rise: 24 + (i % 5) * 12,
    duration: 18 + (i % 7) * 4,
    delay: (i % 9) * 1.6,
    opacity: 0.14 + (i % 4) * 0.09,
  };
});

function LuxuryBackgroundBase() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-wine-950">
      {/* Photographic gold-ribbon plate, drifting very slowly */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${isDesktop ? BG_LANDSCAPE : BG_PORTRAIT})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          scale: 1.08,
        }}
        animate={reduced ? undefined : { x: [0, -14, 0], y: [0, 10, 0] }}
        transition={{ duration: 48, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Maroon wash: ties the photograph to the brand ground */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 84% at 50% 34%, rgba(84,0,0,0.16) 0%, rgba(46,2,2,0.3) 48%, rgba(18,0,0,0.58) 100%)",
        }}
      />

      {/* Legibility scrim: darkest where copy and cards sit */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(186deg, rgba(12,0,0,0.34) 0%, rgba(12,0,0,0.06) 28%, rgba(12,0,0,0.26) 64%, rgba(10,0,0,0.62) 100%)",
        }}
      />

      {/* Slow radial gold lighting */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle at 50% 50%, ${orb.tint} 0%, rgba(0,0,0,0) 68%)`,
            filter: "blur(48px)",
          }}
          animate={reduced ? undefined : { x: [0, orb.drift[0], 0], y: [0, orb.drift[1], 0] }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating gold particles */}
      {!reduced &&
        particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: "radial-gradient(circle, #FBF1C9 0%, rgba(249,223,50,0.6) 45%, rgba(249,223,50,0) 72%)",
            }}
            animate={{ y: [0, -p.rise, 0], opacity: [0, p.opacity, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

      {/* Jewellery-fine grain */}
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      {/* Vignette and floor shadow */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 160px 60px rgba(0,0,0,0.6), inset 0 -90px 120px -60px rgba(0,0,0,0.8)" }}
      />
    </div>
  );
}

export default memo(LuxuryBackgroundBase);
