import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge doesn't read tailwind.config.ts, so the custom fontSize keys
// must be registered or `text-body` is mistaken for a colour and silently
// drops `text-inverse` (e.g. Button primary + lg lost its dark label).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display", "h1", "h2", "h3", "body-lg", "body", "mono",
            "step--2", "step--1", "step-0", "step-1", "step-2",
            "step-3", "step-4", "step-5", "step-6",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
