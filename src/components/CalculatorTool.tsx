"use client";

import { useId, useState } from "react";
import { CalcInputError } from "@/lib/calc/common";
import { formatNumber, getCalculator, isFieldActive, type CalcValues, type ResultRow } from "@/lib/calc/registry";

const INPUT =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export function CalculatorTool({ slug }: { slug: string }) {
  const calc = getCalculator(slug);
  const baseId = useId();
  const [raw, setRaw] = useState<Record<string, string>>(() =>
    Object.fromEntries(calc.fields.map((f) => [f.key, String(f.default)])),
  );

  const values: CalcValues = {};
  let error: string | null = null;
  for (const field of calc.fields) {
    if (field.kind === "select") values[field.key] = raw[field.key];
  }
  for (const field of calc.fields) {
    if (field.kind !== "number" || !isFieldActive(field, values)) continue;
    const text = raw[field.key].trim();
    const n = text === "" ? NaN : Number(text);
    if (!Number.isFinite(n)) error ??= `Enter a number for ${field.label.toLowerCase()}.`;
    values[field.key] = n;
  }

  let rows: ResultRow[] = [];
  if (!error) {
    try {
      rows = calc.compute(values);
    } catch (e) {
      if (!(e instanceof CalcInputError)) throw e;
      error = e.message;
    }
  }

  const primary = rows.filter((r) => r.primary);
  const details = rows.filter((r) => !r.primary);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_minmax(16rem,22rem)]">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {calc.fields
          .filter((f) => isFieldActive(f, values))
          .map((field) => {
            const id = `${baseId}-${field.key}`;
            return (
              <div key={field.key} className="flex flex-col gap-1">
                <label htmlFor={id} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {field.label}
                  {field.kind === "number" && field.unit && (
                    <span className="font-normal text-zinc-500 dark:text-zinc-400"> ({field.unit})</span>
                  )}
                </label>
                {field.kind === "number" ? (
                  <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={field.step ?? "any"}
                    value={raw[field.key]}
                    onChange={(e) => setRaw((r) => ({ ...r, [field.key]: e.target.value }))}
                    className={INPUT}
                  />
                ) : (
                  <select
                    id={id}
                    value={raw[field.key]}
                    onChange={(e) => setRaw((r) => ({ ...r, [field.key]: e.target.value }))}
                    className={INPUT}
                  >
                    {field.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
                {field.help && <p className="text-xs text-zinc-500 dark:text-zinc-400">{field.help}</p>}
              </div>
            );
          })}
      </form>

      <section
        aria-live="polite"
        aria-label="Result"
        className="flex flex-col gap-4 rounded-lg bg-emerald-50 p-5 dark:bg-emerald-950/30"
      >
        {error ? (
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {primary.map((r) => (
                <div key={r.key}>
                  <p className="text-sm text-emerald-900 dark:text-emerald-200">{r.label}</p>
                  <p className="text-3xl font-semibold text-emerald-950 dark:text-emerald-50">
                    {formatNumber(r.value, r.digits)} <span className="text-lg font-medium">{r.unit}</span>
                  </p>
                </div>
              ))}
            </div>
            {details.length > 0 && (
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t border-emerald-200 pt-3 text-sm dark:border-emerald-900">
                {details.map((r) => (
                  <div key={r.key} className="contents">
                    <dt className="text-emerald-900 dark:text-emerald-200">{r.label}</dt>
                    <dd className="text-right font-medium text-emerald-950 dark:text-emerald-50">
                      {formatNumber(r.value, r.digits)} {r.unit}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}
        <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80">
          Estimate only. Check the coverage or yield printed on the product before you buy.
        </p>
      </section>
    </div>
  );
}
