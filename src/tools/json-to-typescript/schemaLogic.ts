/**
 * Pure domain logic to convert JSON payloads into TypeScript Interfaces,
 * Type Aliases, and Zod Validation Schemas.
 */

export interface SchemaGeneratorOptions {
  rootName?: string;
  outputFormat?: 'interface' | 'type' | 'zod';
  exportTypes?: boolean;
}

function toPascalCase(str: string): string {
  if (!str) return 'Root';
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function sanitizeKey(key: string): string {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
    return key;
  }
  return JSON.stringify(key);
}

/**
 * Generates TypeScript interface or type definitions from JSON.
 */
export function generateTypeScript(
  jsonInput: string,
  options: SchemaGeneratorOptions = {}
): { code: string; error?: string } {
  const { rootName = 'RootObject', outputFormat = 'interface', exportTypes = true } = options;
  const prefix = exportTypes ? 'export ' : '';

  let parsed: unknown;
  try {
    const trimmed = jsonInput.trim();
    if (!trimmed) {
      return { code: '' };
    }
    parsed = JSON.parse(trimmed);
  } catch (err) {
    return {
      code: '',
      error: err instanceof Error ? `Invalid JSON: ${err.message}` : 'Invalid JSON input',
    };
  }

  const generatedTypes: Map<string, string> = new Map();

  function inferType(val: unknown, suggestedName: string): string {
    if (val === null) return 'null';
    if (typeof val === 'string') return 'string';
    if (typeof val === 'number') return 'number';
    if (typeof val === 'boolean') return 'boolean';

    if (Array.isArray(val)) {
      if (val.length === 0) return 'unknown[]';
      // Sample element types
      const types = Array.from(
        new Set(val.map((item, idx) => inferType(item, `${suggestedName}Item${idx}`)))
      );
      if (types.length === 1) {
        return `${types[0]}[]`;
      }
      return `(${types.join(' | ')})[]`;
    }

    if (typeof val === 'object') {
      const typeName = toPascalCase(suggestedName);
      const entries = Object.entries(val as Record<string, unknown>);
      const fields: string[] = [];

      for (const [key, propVal] of entries) {
        const propType = inferType(propVal, `${typeName}_${toPascalCase(key)}`);
        fields.push(`  ${sanitizeKey(key)}: ${propType};`);
      }

      const body = `{\n${fields.join('\n')}\n}`;
      let definition = '';
      if (outputFormat === 'type') {
        definition = `${prefix}type ${typeName} = ${body};`;
      } else {
        definition = `${prefix}interface ${typeName} ${body}`;
      }

      generatedTypes.set(typeName, definition);
      return typeName;
    }

    return 'unknown';
  }

  const mainTypeName = toPascalCase(rootName);
  inferType(parsed, mainTypeName);

  // Return generated types in logical order (dependencies first, or root last)
  const codeBlocks = Array.from(generatedTypes.values()).reverse();
  return { code: codeBlocks.join('\n\n') };
}

/**
 * Generates Zod validation schemas from JSON.
 */
export function generateZodSchema(
  jsonInput: string,
  options: SchemaGeneratorOptions = {}
): { code: string; error?: string } {
  const { rootName = 'RootSchema', exportTypes = true } = options;
  const prefix = exportTypes ? 'export ' : '';

  let parsed: unknown;
  try {
    const trimmed = jsonInput.trim();
    if (!trimmed) {
      return { code: '' };
    }
    parsed = JSON.parse(trimmed);
  } catch (err) {
    return {
      code: '',
      error: err instanceof Error ? `Invalid JSON: ${err.message}` : 'Invalid JSON input',
    };
  }

  const generatedSchemas: Map<string, string> = new Map();

  function inferZodType(val: unknown, suggestedName: string): string {
    if (val === null) return 'z.null()';
    if (typeof val === 'string') return 'z.string()';
    if (typeof val === 'number') return 'z.number()';
    if (typeof val === 'boolean') return 'z.boolean()';

    if (Array.isArray(val)) {
      if (val.length === 0) return 'z.array(z.unknown())';
      const distinctTypes = Array.from(
        new Set(val.map((item, idx) => inferZodType(item, `${suggestedName}Item${idx}`)))
      );
      if (distinctTypes.length === 1) {
        return `z.array(${distinctTypes[0]})`;
      }
      return `z.array(z.union([${distinctTypes.join(', ')}]))`;
    }

    if (typeof val === 'object') {
      const schemaName = `${toPascalCase(suggestedName)}Schema`;
      const entries = Object.entries(val as Record<string, unknown>);
      const fields: string[] = [];

      for (const [key, propVal] of entries) {
        const fieldZod = inferZodType(propVal, `${suggestedName}_${toPascalCase(key)}`);
        fields.push(`  ${sanitizeKey(key)}: ${fieldZod},`);
      }

      const body = `z.object({\n${fields.join('\n')}\n});`;
      const typeInference = `${prefix}type ${toPascalCase(suggestedName)} = z.infer<typeof ${schemaName}>;`;
      const schemaDef = `${prefix}const ${schemaName} = ${body}\n${typeInference}`;

      generatedSchemas.set(schemaName, schemaDef);
      return schemaName;
    }

    return 'z.unknown()';
  }

  const baseName = rootName.replace(/Schema$/, '');
  inferZodType(parsed, baseName);

  const importLine = `import { z } from 'zod';\n\n`;
  const codeBlocks = Array.from(generatedSchemas.values()).reverse();
  return { code: importLine + codeBlocks.join('\n\n') };
}
