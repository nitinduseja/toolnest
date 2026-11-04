import { describe, it, expect } from 'vitest';
import { convertSvgToJsx } from './svgLogic';

describe('SVG to JSX Generator Domain Logic', () => {
  const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-activity">
  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" fill-rule="evenodd" clip-rule="evenodd" />
</svg>`;

  it('converts kebab-case attributes to camelCase React attributes', () => {
    const res = convertSvgToJsx(SAMPLE_SVG, { componentName: 'ActivityIcon' });
    expect(res.error).toBeUndefined();
    expect(res.code).toContain('strokeWidth="2"');
    expect(res.code).toContain('strokeLinecap="round"');
    expect(res.code).toContain('strokeLinejoin="round"');
    expect(res.code).toContain('fillRule="evenodd"');
    expect(res.code).toContain('clipRule="evenodd"');
    expect(res.code).toContain('className="feather feather-activity"');
  });

  it('generates TypeScript interface and props spreading', () => {
    const res = convertSvgToJsx(SAMPLE_SVG, {
      componentName: 'ActivityIcon',
      useTypescript: true,
      spreadProps: true,
    });
    expect(res.code).toContain('export interface ActivityIconProps extends React.SVGProps<SVGSVGElement>');
    expect(res.code).toContain('export const ActivityIcon: React.FC<ActivityIconProps>');
    expect(res.code).toContain('{...props}');
  });

  it('supports forwardRef option', () => {
    const res = convertSvgToJsx(SAMPLE_SVG, {
      componentName: 'ActivityIcon',
      forwardRef: true,
    });
    expect(res.code).toContain('forwardRef<SVGSVGElement, ActivityIconProps>');
    expect(res.code).toContain('ref={ref}');
    expect(res.code).toContain("ActivityIcon.displayName = 'ActivityIcon';");
  });

  it('converts inline style strings to React object syntax', () => {
    const svgWithStyle = `<svg viewBox="0 0 10 10"><rect style="fill: red; stroke-width: 1.5" /></svg>`;
    const res = convertSvgToJsx(svgWithStyle);
    expect(res.code).toContain('style={{ fill: "red", strokeWidth: "1.5" }}');
  });

  it('removes width and height when removeDimensions is true', () => {
    const res = convertSvgToJsx(SAMPLE_SVG, { removeDimensions: true });
    expect(res.code).not.toContain('width="24"');
    expect(res.code).not.toContain('height="24"');
    expect(res.code).toContain('viewBox="0 0 24 24"');
  });

  it('returns error when input is not an SVG', () => {
    const res = convertSvgToJsx('<div>Not an SVG</div>');
    expect(res.error).toBeDefined();
    expect(res.error).toContain('does not appear to contain a valid <svg>');
  });

  it('handles empty input gracefully', () => {
    const res = convertSvgToJsx('');
    expect(res.code).toBe('');
    expect(res.error).toBeUndefined();
  });
});

