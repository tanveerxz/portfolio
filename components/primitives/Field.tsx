"use client";

import { ChevronDown } from "lucide-react";
import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Label + control + description + error, wired for assistive technology by
 * construction. build/00-foundation.md §4.
 *
 * `htmlFor`/`id`, `aria-describedby` and `aria-invalid` are computed here and
 * are not accepted as props — a caller cannot forget them, and cannot supply
 * a wrong one. The `role="alert"` region is always in the DOM (an empty
 * block box, zero height) so a screen reader announces an error the moment
 * it appears rather than only on the next focus move.
 *
 * This is a client component solely because `useId` is a hook (§7).
 */

export interface FieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FieldBaseProps {
  /** Always rendered. Use `hideLabel` for a visually hidden but present label. */
  label: string;
  description?: string;
  /** Presence of a string puts the field into its invalid state. */
  error?: string;
  /** Override the generated id. Wiring is still computed, never passed in. */
  id?: string;
  className?: string;
  controlClassName?: string;
  hideLabel?: boolean;
  /** Extra node rendered next to the label (a counter, a hint link). */
  labelAdornment?: ReactNode;
}

type ManagedAttributes =
  | "id"
  | "className"
  | "aria-describedby"
  | "aria-invalid";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  ManagedAttributes
>;
type NativeTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  ManagedAttributes
>;
type NativeSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  ManagedAttributes | "children"
>;

export type FieldProps =
  | (FieldBaseProps & { control?: "input" } & NativeInputProps)
  | (FieldBaseProps & { control: "textarea" } & NativeTextareaProps)
  | (FieldBaseProps & {
      control: "select";
      options: readonly FieldOption[];
      placeholder?: string;
    } & NativeSelectProps);

const CONTROL_BASE = [
  "w-full rounded-md bg-surface-2 px-3 py-3",
  "font-sans text-body text-primary",
  "placeholder:text-secondary",
  "border border-control",
  "transition-colors duration-fast ease-standard",
  "hover:bg-surface-3",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const CONTROL_INVALID = "border-danger";

export function Field(props: FieldProps) {
  const reactId = useId();

  const {
    label,
    description,
    error,
    id,
    className,
    controlClassName,
    hideLabel = false,
    labelAdornment,
  } = props;

  const controlId = id ?? `${reactId}-control`;
  const descriptionId = `${reactId}-description`;
  const errorId = `${reactId}-error`;

  const isInvalid = typeof error === "string" && error.length > 0;

  const describedBy =
    [description ? descriptionId : null, isInvalid ? errorId : null]
      .filter((value): value is string => value !== null)
      .join(" ") || undefined;

  const controlClasses = cn(
    CONTROL_BASE,
    isInvalid && CONTROL_INVALID,
    controlClassName,
  );

  let control: ReactNode;

  if (props.control === "textarea") {
    const {
      label: _label,
      description: _description,
      error: _error,
      id: _id,
      className: _className,
      controlClassName: _controlClassName,
      hideLabel: _hideLabel,
      labelAdornment: _labelAdornment,
      control: _control,
      rows = 6,
      ...rest
    } = props;

    control = (
      <textarea
        {...rest}
        rows={rows}
        id={controlId}
        className={cn(controlClasses, "min-h-24 resize-y")}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        data-focus-ring=""
      />
    );
  } else if (props.control === "select") {
    const {
      label: _label,
      description: _description,
      error: _error,
      id: _id,
      className: _className,
      controlClassName: _controlClassName,
      hideLabel: _hideLabel,
      labelAdornment: _labelAdornment,
      control: _control,
      options,
      placeholder,
      defaultValue,
      ...rest
    } = props;

    control = (
      <div className="relative">
        <select
          {...rest}
          defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          id={controlId}
          className={cn(controlClasses, "appearance-none pr-12")}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          data-focus-ring=""
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
        />
      </div>
    );
  } else {
    const {
      label: _label,
      description: _description,
      error: _error,
      id: _id,
      className: _className,
      controlClassName: _controlClassName,
      hideLabel: _hideLabel,
      labelAdornment: _labelAdornment,
      control: _control,
      type = "text",
      ...rest
    } = props;

    control = (
      <input
        {...rest}
        type={type}
        id={controlId}
        className={controlClasses}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        data-focus-ring=""
      />
    );
  }

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div
        className={cn(
          "mb-2 flex items-baseline justify-between gap-3",
          hideLabel && "sr-only",
        )}
      >
        <label htmlFor={controlId} className="text-sm font-medium text-primary">
          {label}
          {props.required ? (
            <span className="text-danger" aria-hidden="true">
              {" *"}
            </span>
          ) : null}
        </label>
        {labelAdornment ? (
          <span className="text-sm text-secondary">{labelAdornment}</span>
        ) : null}
      </div>

      {description ? (
        <p id={descriptionId} className="mb-2 text-sm text-secondary">
          {description}
        </p>
      ) : null}

      {control}

      {/* Always present, empty when valid: an empty block box has no height,
          so there is no layout jump, and the live region exists before the
          error text arrives. */}
      <div id={errorId} role="alert" className="text-sm text-danger">
        {isInvalid ? <span className="mt-2 block">{error}</span> : null}
      </div>
    </div>
  );
}
