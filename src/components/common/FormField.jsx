/**
 * Thin wrapper that pairs a label + input/select/textarea (passed as
 * children) with a consistent error message, for use with react-hook-form's
 * register() + formState.errors.
 */
export default function FormField({ label, error, required, children, hint }) {
  return (
    <div>
      {label && (
        <label className="label">
          {label} {required && <span className="text-clay-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
