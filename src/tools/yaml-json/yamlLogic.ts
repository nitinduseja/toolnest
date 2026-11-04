import * as yaml from 'js-yaml';

export interface YamlToJsonOptions {
  indent?: number;
}

export interface JsonToYamlOptions {
  indent?: number;
}

export interface YamlConversionResult {
  output: string;
  error?: string;
}

/**
 * Converts YAML string to formatted JSON string.
 */
export function convertYamlToJson(
  yamlInput: string,
  options: YamlToJsonOptions = {}
): YamlConversionResult {
  const trimmed = yamlInput.trim();
  if (!trimmed) {
    return { output: '' };
  }

  const { indent = 2 } = options;

  try {
    const parsed = yaml.load(trimmed);
    const jsonString = JSON.stringify(parsed, null, indent);
    return { output: jsonString };
  } catch (err) {
    return {
      output: '',
      error: err instanceof Error ? err.message : 'Invalid YAML syntax',
    };
  }
}

/**
 * Converts JSON string to YAML string.
 */
export function convertJsonToYaml(
  jsonInput: string,
  options: JsonToYamlOptions = {}
): YamlConversionResult {
  const trimmed = jsonInput.trim();
  if (!trimmed) {
    return { output: '' };
  }

  const { indent = 2 } = options;

  try {
    const parsed = JSON.parse(trimmed);
    const yamlString = yaml.dump(parsed, { indent });
    return { output: yamlString };
  } catch (err) {
    return {
      output: '',
      error: err instanceof Error ? err.message : 'Invalid JSON syntax',
    };
  }
}
