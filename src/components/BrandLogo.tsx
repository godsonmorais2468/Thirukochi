import { motion } from "framer-motion";
import { layout, spring } from "../lib/motion";

/** Supplied artwork, served untouched from `public/brand`. */
const logoLockup = "/brand/thirukochi-logo.png";
const logoMark = "/brand/thirukochi-mark.png";
const logoWordmark = "/brand/thirukochi-wordmark.png";

type Variant = "lockup" | "mark" | "wordmark";

interface BrandLogoProps {
  variant?: Variant;
  /** Rendered width of the artwork in pixels. */
  width?: number;
  /**
   * Responsive width classes for the artwork, e.g. `w-[150px] lg:w-[200px]`.
   * Prefer this over a scale utility: shared-layout elements carry an inline
   * transform from Framer, which would override any `scale-*` class.
   */
  sizeClass?: string;
  /** Participates in the shared-element transition between screens. */
  shared?: boolean;
  className?: string;
}

const sources: Record<Variant, string> = {
  lockup: logoLockup,
  mark: logoMark,
  wordmark: logoWordmark,
};

const ALT = "Thirukochi Gold & Diamonds";

/** The supplied brand artwork, never redrawn, sitting on the dark ground. */
export default function BrandLogo({
  variant = "lockup",
  width = 190,
  sizeClass,
  shared = false,
  className = "",
}: BrandLogoProps) {
  const image = (
    <img
      src={sources[variant]}
      alt={ALT}
      width={width}
      style={sizeClass ? { height: "auto" } : { width, height: "auto" }}
      className={`block select-none ${sizeClass ?? ""}`}
      draggable={false}
    />
  );

  if (!shared) {
    return <div className={className}>{image}</div>;
  }

  return (
    <motion.div layoutId={layout.logo} transition={spring.screen} className={className}>
      {image}
    </motion.div>
  );
}
