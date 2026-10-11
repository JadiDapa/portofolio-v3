"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Switch } from "@/components/ui/switch";

type FieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  placeholder?: string;
};

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="db-field_error">
      {message}
    </p>
  );
}

/** Uppercase label with an optional hint line underneath. */
function Head({ id, label, hint }: { id: string; label: string; hint?: string }) {
  return (
    <div className="db-field_head">
      <label htmlFor={id} className="db-label">
        {label}
      </label>
      {hint && <p className="db-field_hint">{hint}</p>}
    </div>
  );
}

/** Label + input + validation message, wired to a react-hook-form control. */
export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  placeholder,
  type = "text",
}: FieldProps<T> & { type?: "text" | "number" | "date" | "email" }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="db-field">
          <Head id={name} label={label} hint={hint} />
          <input
            id={name}
            {...field}
            className="db-input"
            type={type}
            value={field.value ?? ""}
            placeholder={placeholder}
            aria-invalid={!!fieldState.error}
            aria-describedby={fieldState.error ? `${name}-error` : undefined}
          />
          <FieldError id={`${name}-error`} message={fieldState.error?.message} />
        </div>
      )}
    />
  );
}

/** A number input; an emptied field becomes `undefined` so schema defaults apply. */
export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  placeholder,
}: FieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="db-field">
          <Head id={name} label={label} hint={hint} />
          <input
            id={name}
            className="db-input"
            type="number"
            value={field.value ?? ""}
            onChange={(e) =>
              field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
            }
            onBlur={field.onBlur}
            placeholder={placeholder}
            aria-invalid={!!fieldState.error}
            aria-describedby={fieldState.error ? `${name}-error` : undefined}
          />
          <FieldError id={`${name}-error`} message={fieldState.error?.message} />
        </div>
      )}
    />
  );
}

export function TextAreaField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  placeholder,
  rows = "min-h-20",
}: FieldProps<T> & { rows?: string }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="db-field">
          <Head id={name} label={label} hint={hint} />
          <textarea
            id={name}
            {...field}
            value={field.value ?? ""}
            placeholder={placeholder}
            aria-invalid={!!fieldState.error}
            aria-describedby={fieldState.error ? `${name}-error` : undefined}
            className={`db-input ${rows} resize-y`}
          />
          <FieldError id={`${name}-error`} message={fieldState.error?.message} />
        </div>
      )}
    />
  );
}

/** Native select over a plain list of strings. */
export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  options,
  placeholder = "Select…",
}: FieldProps<T> & { options: string[] }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="db-field">
          <Head id={name} label={label} hint={hint} />
          <select
            id={name}
            {...field}
            value={field.value ?? ""}
            aria-invalid={!!fieldState.error}
            className="db-input"
          >
            <option value="">{placeholder}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <FieldError id={`${name}-error`} message={fieldState.error?.message} />
        </div>
      )}
    />
  );
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
}: Pick<FieldProps<T>, "control" | "name" | "label">) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <Switch id={name} checked={!!field.value} onCheckedChange={field.onChange} />
          <label htmlFor={name} className="db-label">
            {label}
          </label>
        </div>
      )}
    />
  );
}
