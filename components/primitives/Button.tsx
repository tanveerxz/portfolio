import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { Beam } from "@/components/effects/beam/Beam";
import { Magnetic } from "@/components/effects/Magnetic";
import { MetalRing } from "@/components/effects/metal/MetalRing";
import { cn } from "@/lib/utils";

/**
 * The one Button. DESIGN.md › Components › Buttons.
 *
 * Server-compatible. Effects are opt-in props that wrap the rendered control
 * in client-only layers; the control itself is always plain server HTML.
 *
 *   effect="metal"  — liquid-metal ring. The page's ONE primary action per
 *                     viewport (hero CTA). Pair with variant="silver".
 *   effect="beam"   — travelling border beam. A featured secondary action.
 *   magnetic        — pointer magnetism (fine pointers, full motion only).
 *   arrow           — trailing arrow that advances on hover.
 *
 * THE FOCUS RING IS NOT IN THIS FILE'S CLASS STRINGS ON PURPOSE. It is applied
 * by `data-focus-ring`, written after the props spread, and styled unlayered
 * in app/globals.css — no variant, className or spread can remove it.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex items-center justify-center gap-2 whitespace-nowrap align-middle",
    "rounded-full border border-transparent font-sans font-medium tracking-[-0.01em]",
    "select-none touch-manipulation",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-base ease-out-quint",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /* Filled periwinkle. Surface-0 ink measures 11.9:1 on --accent. */
        primary:
          "bg-accent text-inverse shadow-[var(--shadow-action)] hover:bg-accent-hover",
        /* Dark pill with silver ink: the body under a metal ring. */
        silver:
          "bg-surface-1 text-primary shadow-[var(--shadow-silver)] hover:bg-surface-2",
        /* Kept for existing call-sites. Same as primary. */
        flagship: "bg-flagship text-inverse hover:bg-flagship-hover",
        secondary:
          "bg-surface-2 text-primary border-strong hover:bg-surface-3",
        ghost: "bg-transparent text-secondary hover:bg-surface-2 hover:text-primary",
        link: "rounded-none bg-transparent text-accent underline decoration-from-font underline-offset-4 hover:text-accent-hover",
      },
      size: {
        sm: "min-h-[44px] px-4 text-sm",
        md: "min-h-[48px] px-6 text-sm",
        lg: "min-h-[56px] px-8 text-body",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [{ variant: "link", class: "min-h-0 p-0" }],
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;
export type ButtonEffect = "none" | "metal" | "beam";

const RADIUS: Record<ButtonSize, number> = { sm: 22, md: 24, lg: 28 };

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  effect?: ButtonEffect;
  magnetic?: boolean;
  arrow?: boolean;
  /** effect="beam" only: "ocean" (periwinkle, primary) or "mono" (silver). */
  beamTone?: "mono" | "ocean";
}

type ButtonAsButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
    external?: undefined;
  };

type ButtonAsAnchorProps = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    /** Providing `href` renders an anchor instead of a `<button>`. */
    href: string;
    /** Opens in a new tab with `rel="noreferrer noopener"`. */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

function isAnchor(props: ButtonProps): props is ButtonAsAnchorProps {
  return props.href !== undefined;
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="relative -mr-1 inline-flex h-[1em] w-[1.1em] items-center justify-center overflow-hidden"
    >
      <span className="transition-transform duration-slow ease-out group-hover/button:translate-x-[120%]">→</span>
      <span className="absolute -translate-x-[120%] transition-transform duration-slow ease-out group-hover/button:translate-x-0">
        →
      </span>
    </span>
  );
}

function withEffects(
  control: ReactNode,
  {
    effect = "none",
    magnetic = false,
    size = "md",
    beamTone = "ocean",
  }: Pick<ButtonOwnProps, "effect" | "magnetic" | "size" | "beamTone">,
) {
  let node = control;
  if (effect === "metal") node = <MetalRing>{node}</MetalRing>;
  else if (effect === "beam")
    node = (
      <Beam
        kind="compact"
        tone={beamTone}
        radius={RADIUS[size]}
        strength={0.9}
        duration={3.2}
        as="span"
        className="inline-flex rounded-full"
      >
        {node}
      </Beam>
    );
  if (magnetic) node = <Magnetic>{node}</Magnetic>;
  return node;
}

export function Button(props: ButtonProps) {
  if (isAnchor(props)) {
    const {
      href,
      external = false,
      variant,
      size,
      fullWidth,
      className,
      children,
      effect,
      magnetic,
      arrow,
      beamTone,
      ...rest
    } = props;

    const classes = cn(buttonVariants({ variant, size, fullWidth }), className);
    const isInternal = !external && (href.startsWith("/") || href.startsWith("#"));
    const content = (
      <>
        {children}
        {arrow ? <Arrow /> : null}
      </>
    );

    const control = isInternal ? (
      <Link {...rest} href={href} className={classes} data-focus-ring="">
        {content}
      </Link>
    ) : (
      <a
        {...rest}
        href={href}
        className={classes}
        target={external ? "_blank" : rest.target}
        rel={external ? "noreferrer noopener" : rest.rel}
        data-focus-ring=""
      >
        {content}
      </a>
    );
    return withEffects(control, { effect, magnetic, size: size ?? "md", beamTone });
  }

  const {
    variant,
    size,
    fullWidth,
    className,
    children,
    effect,
    magnetic,
    arrow,
    beamTone,
    type = "button",
    ...rest
  } = props;

  const control = (
    <button
      {...rest}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      data-focus-ring=""
    >
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
  return withEffects(control, { effect, magnetic, size: size ?? "md", beamTone });
}

export { buttonVariants };
