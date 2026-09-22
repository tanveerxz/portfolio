import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Scroll-entrance primitives. Server components — no client JS of their own.
 * One <RevealRoot /> (mounted in the root layout) observes every
 * [data-reveal] element and flips data-revealed.
 *
 * Guarantees (enforced in app/globals.css):
 *   - Visible without JavaScript and under reduced motion.
 *   - Anything already on screen at hydration is marked revealed before the
 *     hidden state can apply, so there is never a flash or an LCP delay.
 *   - Transform/opacity/clip-path only: no layout shift.
 *
 * Do NOT use on the hero <h1> (it is the LCP element and must paint as-is).
 */

type RevealKind = "up" | "fade" | "mask";

type VarStyle = CSSProperties & Record<`--${string}`, string | number>;

export interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  as?: ElementType;
  kind?: RevealKind;
  /** ms before this element starts once revealed. */
  delay?: number;
  /** px travel for kind="up". Default 28. */
  y?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Reveal({
  as: Component = "div",
  kind = "up",
  delay = 0,
  y,
  style,
  children,
  ...rest
}: RevealProps) {
  const vars: VarStyle = { ...style, "--reveal-delay": `${delay}ms` };
  if (kind === "fade") vars["--reveal-y"] = "0px";
  else if (y !== undefined) vars["--reveal-y"] = `${y}px`;
  return (
    <Component {...rest} data-reveal={kind} style={vars}>
      {children}
    </Component>
  );
}

export interface SplitLinesProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "children"> {
  as?: ElementType;
  /** Author-controlled lines. Each entry becomes one masked, rising line. */
  lines: ReactNode[];
  delay?: number;
  style?: CSSProperties;
}

/**
 * Line-by-line masked rise for headings. Lines are authored (not measured),
 * so there is no client splitting, no layout read and no CLS. Pick breaks that
 * also read well when they wrap on phones.
 */
export function SplitLines({ as: Component = "h2", lines, delay = 0, style, ...rest }: SplitLinesProps) {
  const vars: VarStyle = { ...style, "--reveal-delay": `${delay}ms` };
  return (
    <Component {...rest} data-reveal="lines" style={vars}>
      {lines.map((line, index) => (
        <span key={index} data-line="">
          <span data-line-inner="" style={{ "--i": index } as VarStyle}>
            {line}
            {index < lines.length - 1 ? " " : null}
          </span>
        </span>
      ))}
    </Component>
  );
}
