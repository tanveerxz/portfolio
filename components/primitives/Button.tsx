import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

/**
 * The one Button. build/00-foundation.md §4.
 *
 * THE FOCUS RING IS NOT IN THIS FILE'S CLASS STRINGS ON PURPOSE.
 * It is applied by the `data-focus-ring` attribute, which is set on the
 * rendered element *after* the props spread and is not part of `className`.
 * The matching rule lives unlayered at the bottom of `app/globals.css`, so:
 *   - no `variant` can drop it (variants only contribute class names);
 *   - no consumer `className` can merge it away (twMerge only sees classes);
 *   - no `{...rest}` spread can overwrite the attribute (it is written last).
 * The old build's primary CTA shipped `focus:outline-none` with no
 * replacement. That is structurally unreachable here.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap align-middle",
    "rounded-md border border-transparent font-sans font-medium",
    "select-none",
    "transition-colors duration-base ease-standard",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /* Filled accent uses surface-0 ink, not white (§3): white on
         * --accent measures 3.22:1 and fails; surface-0 ink is 6.23:1. */
        primary: "bg-accent text-inverse hover:bg-accent-hover",
        /* Flagship tier only — the reserved green (§3). */
        flagship: "bg-flagship text-inverse hover:bg-flagship-hover",
        secondary:
          "bg-surface-2 text-primary border-strong hover:bg-surface-3",
        ghost: "bg-transparent text-secondary hover:bg-surface-2 hover:text-primary",
        link: "bg-transparent text-accent underline decoration-from-font underline-offset-4 hover:text-accent-hover",
      },
      /* Padding-driven, so the control height follows the type token
       * instead of needing an off-scale fixed height. */
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-sm",
        lg: "px-6 py-3 text-body-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      /* `link` is text, not a box — it opts out of the size box entirely.
       * Declared here so it lands after the size classes and wins the merge. */
      { variant: "link", class: "p-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
    external?: undefined;
  };

type ButtonAsAnchorProps = ButtonOwnProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  > & {
    /** Providing `href` renders an anchor instead of a `<button>`. */
    href: string;
    /** Opens in a new tab with `rel="noreferrer noopener"`. */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

function isAnchor(props: ButtonProps): props is ButtonAsAnchorProps {
  return props.href !== undefined;
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
      ...rest
    } = props;

    const classes = cn(
      buttonVariants({ variant, size, fullWidth }),
      className,
    );
    const isInternal =
      !external && (href.startsWith("/") || href.startsWith("#"));

    if (isInternal) {
      return (
        <Link {...rest} href={href} className={classes} data-focus-ring="">
          {children}
        </Link>
      );
    }

    return (
      <a
        {...rest}
        href={href}
        className={classes}
        target={external ? "_blank" : rest.target}
        rel={external ? "noreferrer noopener" : rest.rel}
        data-focus-ring=""
      >
        {children}
      </a>
    );
  }

  const {
    variant,
    size,
    fullWidth,
    className,
    children,
    type = "button",
    ...rest
  } = props;

  return (
    <button
      {...rest}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      data-focus-ring=""
    >
      {children}
    </button>
  );
}
