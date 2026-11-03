/**
 * Types for the SVG Optimizer & Minifier tool.
 */

export interface SvgOptimizeOptions {
  removeDoctype: boolean;
  removeComments: boolean;
  removeMetadata: boolean;
  removeEditorData: boolean;
  cleanIds: boolean;
  collapseWhitespace: boolean;
  roundCoordinates: boolean;
  precision: number;
  removeXmlProcInst: boolean;
}

export interface SvgOptimizationStats {
  originalBytes: number;
  optimizedBytes: number;
  savedBytes: number;
  savingsPercentage: number;
}
