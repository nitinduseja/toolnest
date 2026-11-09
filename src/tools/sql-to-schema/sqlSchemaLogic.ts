import { SqlColumn, SqlTable, SqlPreset } from './types';

function cleanIdentifier(raw: string): string {
  return raw.replace(/[`"[\]]/g, '').trim();
}

function toPascalCase(str: string): string {
  const clean = cleanIdentifier(str).replace(/^public\./, '');
  return clean
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function stripComments(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--.*$/gm, '')
    .trim();
}

export function mapSqlToTsType(sqlType: string): string {
  const norm = sqlType.toLowerCase();
  if (/int|serial|float|double|decimal|numeric|real/.test(norm)) return 'number';
  if (/bool/.test(norm)) return 'boolean';
  if (/date|time|timestamp/.test(norm)) return 'Date';
  if (/json/.test(norm)) return 'Record<string, unknown>';
  return 'string';
}

export function mapSqlToZodType(sqlType: string, isNullable: boolean): string {
  const norm = sqlType.toLowerCase();
  let base = 'z.string()';
  if (/int|serial|float|double|decimal|numeric|real/.test(norm)) {
    base = /int|serial/.test(norm) ? 'z.number().int()' : 'z.number()';
  } else if (/bool/.test(norm)) {
    base = 'z.boolean()';
  } else if (/date|time|timestamp/.test(norm)) {
    base = 'z.date()';
  } else if (/json/.test(norm)) {
    base = 'z.record(z.unknown())';
  } else if (/uuid/.test(norm)) {
    base = 'z.string().uuid()';
  }
  return isNullable ? `${base}.nullable()` : base;
}

export function mapSqlToPrismaType(sqlType: string, isNullable: boolean, isPk: boolean): string {
  const norm = sqlType.toLowerCase();
  let type = 'String';
  if (/bigint/.test(norm)) type = 'BigInt';
  else if (/int|serial/.test(norm)) type = 'Int';
  else if (/float|double|decimal|numeric|real/.test(norm)) type = 'Float';
  else if (/bool/.test(norm)) type = 'Boolean';
  else if (/date|time|timestamp/.test(norm)) type = 'DateTime';
  else if (/json/.test(norm)) type = 'Json';

  const nullModifier = isNullable && !isPk ? '?' : '';
  const pkAttr = isPk ? ' @id' : '';
  return `${type}${nullModifier}${pkAttr}`;
}

export function parseColumnLine(line: string): SqlColumn | null {
  const trimmed = line.trim();
  if (!trimmed || /^(primary\s+key|foreign\s+key|constraint|key|unique|index)/i.test(trimmed)) {
    return null;
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) return null;

  const rawName = parts[0];
  const rawType = parts[1];
  const isPrimaryKey = /primary\s+key/i.test(trimmed);
  const isNullable = !/not\s+null/i.test(trimmed) && !isPrimaryKey;

  return {
    name: cleanIdentifier(rawName),
    type: cleanIdentifier(rawType),
    isNullable,
    isPrimaryKey,
  };
}

export function parseSqlDdl(sql: string): SqlTable[] {
  const cleaned = stripComments(sql);
  const tableRegex = /create\s+table\s+(?:if\s+not\s+exists\s+)?([^\s(]+)\s*\(([\s\S]*?)\);/gi;
  const tables: SqlTable[] = [];
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(cleaned)) !== null) {
    const rawTableName = match[1];
    const body = match[2];
    const lines = body.split(',\n').flatMap((l) => l.split(/,(?![^(]*\))/));
    const columns: SqlColumn[] = [];

    for (const line of lines) {
      const col = parseColumnLine(line);
      if (col) columns.push(col);
    }

    if (columns.length > 0) {
      tables.push({
        name: cleanIdentifier(rawTableName),
        columns,
      });
    }
  }

  return tables;
}

export function generateTypeScript(tables: SqlTable[]): string {
  return tables
    .map((table) => {
      const interfaceName = toPascalCase(table.name);
      const cols = table.columns
        .map((col) => {
          const opt = col.isNullable ? '?' : '';
          const tsType = mapSqlToTsType(col.type);
          return `  ${col.name}${opt}: ${tsType};`;
        })
        .join('\n');
      return `export interface ${interfaceName} {\n${cols}\n}`;
    })
    .join('\n\n');
}

export function generateZod(tables: SqlTable[]): string {
  const header = `import { z } from 'zod';\n\n`;
  const body = tables
    .map((table) => {
      const name = toPascalCase(table.name);
      const cols = table.columns
        .map((col) => `  ${col.name}: ${mapSqlToZodType(col.type, col.isNullable)},`)
        .join('\n');
      return `export const ${name}Schema = z.object({\n${cols}\n});\n\nexport type ${name} = z.infer<typeof ${name}Schema>;`;
    })
    .join('\n\n');
  return header + body;
}

export function generatePrisma(tables: SqlTable[]): string {
  return tables
    .map((table) => {
      const modelName = toPascalCase(table.name);
      const cols = table.columns
        .map((col) => {
          const typeStr = mapSqlToPrismaType(col.type, col.isNullable, col.isPrimaryKey);
          return `  ${col.name} ${typeStr}`;
        })
        .join('\n');
      return `model ${modelName} {\n${cols}\n}`;
    })
    .join('\n\n');
}

export const SQL_PRESETS: SqlPreset[] = [
  {
    id: 'users-auth',
    name: 'Users & Authentication',
    description: 'User accounts, hashed passwords, roles, and session tokens.',
    ddl: `CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL
);`,
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Products & Orders',
    description: 'Products catalog, order manifests, and status tracking.',
    ddl: `CREATE TABLE products (
  id INT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  stock_quantity INT NOT NULL,
  metadata JSON
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT NOT NULL,
  total_amount DECIMAL NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL
);`,
  },
];
