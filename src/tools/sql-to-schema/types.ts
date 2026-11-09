export interface SqlColumn {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  defaultValue?: string;
}

export interface SqlTable {
  name: string;
  columns: SqlColumn[];
}

export type SchemaTarget = 'typescript' | 'zod' | 'prisma' | 'drizzle';

export interface SqlPreset {
  id: string;
  name: string;
  description: string;
  ddl: string;
}
