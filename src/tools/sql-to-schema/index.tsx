import React, { useState, useMemo } from 'react';
import { SchemaTarget } from './types';
import {
  parseSqlDdl,
  generateTypeScript,
  generateZod,
  generatePrisma,
  SQL_PRESETS,
} from './sqlSchemaLogic';
import { SqlPresetsBar } from './SqlPresetsBar';
import { Icon } from '@/components/atoms/Icon';

export const SqlToSchema: React.FC = () => {
  const [ddl, setDdl] = useState<string>(SQL_PRESETS[0].ddl);
  const [target, setTarget] = useState<SchemaTarget>('typescript');
  const [copied, setCopied] = useState<boolean>(false);

  const tables = useMemo(() => parseSqlDdl(ddl), [ddl]);

  const totalCols = useMemo(() => tables.reduce((acc, t) => acc + t.columns.length, 0), [tables]);

  const generatedCode = useMemo(() => {
    if (tables.length === 0) return '';
    switch (target) {
      case 'zod':
        return generateZod(tables);
      case 'prisma':
        return generatePrisma(tables);
      default:
        return generateTypeScript(tables);
    }
  }, [tables, target]);

  const handleCopy = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon name="Database" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              SQL DDL to TypeScript / Zod / Prisma Converter
            </h1>
            <p className="text-xs text-text-secondary sm:text-sm">
              Convert SQL CREATE TABLE definitions directly into type-safe TypeScript interfaces,
              Zod schemas, and Prisma models.
            </p>
          </div>
        </div>
      </div>

      <SqlPresetsBar onSelect={setDdl} />

      {/* Editor & Preview Split View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SQL DDL Input */}
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="sql-ddl-input"
              className="text-xs font-semibold uppercase tracking-wider text-text-tertiary"
            >
              SQL CREATE TABLE DDL
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary">
                {tables.length} table{tables.length === 1 ? '' : 's'}, {totalCols} cols
              </span>
              <button
                type="button"
                onClick={() => setDdl('')}
                className="text-xs text-text-tertiary hover:text-red-500"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            id="sql-ddl-input"
            rows={16}
            value={ddl}
            onChange={(e) => setDdl(e.target.value)}
            placeholder="Paste your CREATE TABLE statements here..."
            className="w-full resize-y rounded-lg border border-border/60 bg-surface-secondary/70 p-3 font-mono text-xs text-text-primary focus:border-primary focus:outline-none"
          />
        </div>

        {/* Generated Schema Output */}
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {(['typescript', 'zod', 'prisma'] as SchemaTarget[]).map((tgt) => (
                <button
                  key={tgt}
                  type="button"
                  onClick={() => setTarget(tgt)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition ${
                    target === tgt
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:bg-surface-secondary'
                  }`}
                >
                  {tgt}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!generatedCode}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-40"
            >
              <Icon name={copied ? 'Check' : 'Copy'} className="h-3.5 w-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {generatedCode ? (
            <pre className="h-[21rem] overflow-auto rounded-lg bg-surface-secondary/70 p-3 font-mono text-xs text-text-primary">
              <code>{generatedCode}</code>
            </pre>
          ) : (
            <div className="flex h-[21rem] flex-col items-center justify-center rounded-lg border border-dashed border-border/70 p-6 text-center text-text-tertiary">
              <Icon name="Database" className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm font-medium">No valid CREATE TABLE statements detected.</p>
              <p className="mt-1 text-xs">
                Paste SQL DDL or pick a preset schema above to generate models.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SqlToSchema;
