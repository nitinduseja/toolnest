/**
 * Pure domain logic for converting raw SVG markup into standard React JSX / TSX functional components.
 */

export interface SvgToJsxOptions {
  componentName?: string;
  useTypescript?: boolean;
  forwardRef?: boolean;
  removeDimensions?: boolean;
  spreadProps?: boolean;
  iconMode?: boolean; // sets width="1em" height="1em"
}

export interface SvgConversionResult {
  code: string;
  error?: string;
}

const ATTRIBUTE_MAP: Record<string, string> = {
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'clip-path': 'clipPath',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'xmlns:xlink': 'xmlnsXlink',
  'xlink:href': 'xlinkHref',
  'xlink:title': 'xlinkTitle',
  'xml:space': 'xmlSpace',
  class: 'className',
  for: 'htmlFor',
};

function toPascalCase(str: string): string {
  if (!str) return 'Icon';
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Parses inline CSS style string into a React JSX style object string.
 */
function parseStyleToJsx(styleStr: string): string {
  const rules = styleStr.split(';').filter((r) => r.trim());
  const objPairs: string[] = [];
  for (const rule of rules) {
    const colonIdx = rule.indexOf(':');
    if (colonIdx === -1) continue;
    const prop = rule.slice(0, colonIdx).trim();
    const val = rule.slice(colonIdx + 1).trim();
    const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    objPairs.push(`${camelProp}: ${JSON.stringify(val)}`);
  }
  return `{{ ${objPairs.join(', ')} }}`;
}

export function convertSvgToJsx(
  svgContent: string,
  options: SvgToJsxOptions = {}
): SvgConversionResult {
  const trimmed = svgContent.trim();
  if (!trimmed) {
    return { code: '' };
  }

  if (!trimmed.includes('<svg') || !trimmed.includes('</svg>')) {
    return {
      code: '',
      error: 'Input does not appear to contain a valid <svg>...</svg> element.',
    };
  }

  const {
    componentName = 'SvgIcon',
    useTypescript = true,
    forwardRef = false,
    removeDimensions = false,
    spreadProps = true,
    iconMode = false,
  } = options;

  let cleanedSvg = trimmed;

  // Strip XML declarations and DOCTYPE
  cleanedSvg = cleanedSvg.replace(/<\?xml[\s\S]*?\?>/gi, '');
  cleanedSvg = cleanedSvg.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
  cleanedSvg = cleanedSvg.trim();

  // Replace kebab-case attributes with React camelCase attributes
  for (const [kebab, camel] of Object.entries(ATTRIBUTE_MAP)) {
    const regex = new RegExp(`\\b${kebab}=`, 'gi');
    cleanedSvg = cleanedSvg.replace(regex, `${camel}=`);
  }

  // Convert style="..." to style={{ ... }}
  cleanedSvg = cleanedSvg.replace(/\bstyle="([^"]*)"/gi, (_, styleVal) => {
    return `style=${parseStyleToJsx(styleVal)}`;
  });

  // Handle dimensions
  if (removeDimensions) {
    cleanedSvg = cleanedSvg.replace(/<svg\b([^>]*)\bwidth="[^"]*"/i, '<svg$1');
    cleanedSvg = cleanedSvg.replace(/<svg\b([^>]*)\bheight="[^"]*"/i, '<svg$1');
  } else if (iconMode) {
    cleanedSvg = cleanedSvg.replace(/<svg\b([^>]*)\bwidth="[^"]*"/i, '<svg$1');
    cleanedSvg = cleanedSvg.replace(/<svg\b([^>]*)\bheight="[^"]*"/i, '<svg$1');
    cleanedSvg = cleanedSvg.replace(/<svg\b/, '<svg width="1em" height="1em"');
  }

  // Inject {...props} and/or ref={ref}
  if (spreadProps || forwardRef) {
    let injection = '';
    if (forwardRef) injection += ' ref={ref}';
    if (spreadProps) injection += ' {...props}';
    cleanedSvg = cleanedSvg.replace(/<svg\b/, `<svg${injection}`);
  }

  // Clean double spaces in <svg tag
  cleanedSvg = cleanedSvg.replace(/<svg\s+/g, '<svg ');

  const name = toPascalCase(componentName);

  let output = '';

  if (forwardRef) {
    if (useTypescript) {
      output = `import React, { forwardRef } from 'react';

export interface ${name}Props extends React.SVGProps<SVGSVGElement> {}

export const ${name} = forwardRef<SVGSVGElement, ${name}Props>((props, ref) => (
  ${cleanedSvg}
));

${name}.displayName = '${name}';

export default ${name};
`;
    } else {
      output = `import React, { forwardRef } from 'react';

export const ${name} = forwardRef((props, ref) => (
  ${cleanedSvg}
));

${name}.displayName = '${name}';

export default ${name};
`;
    }
  } else {
    if (useTypescript) {
      output = `import React from 'react';

export interface ${name}Props extends React.SVGProps<SVGSVGElement> {}

export const ${name}: React.FC<${name}Props> = (${spreadProps ? 'props' : ''}) => (
  ${cleanedSvg}
);

export default ${name};
`;
    } else {
      output = `import React from 'react';

export const ${name} = (${spreadProps ? 'props' : ''}) => (
  ${cleanedSvg}
);

export default ${name};
`;
    }
  }

  return { code: output.trim() };
}

