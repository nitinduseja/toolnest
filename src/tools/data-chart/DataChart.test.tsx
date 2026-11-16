import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DataChartTool from './index';

describe('DataChartTool Component', () => {
  it('renders title, record count, and default controls', () => {
    render(<DataChartTool />);
    expect(screen.getByText('Data Pivot & Chart Visualizer')).toBeInTheDocument();
    expect(screen.getByText(/12 records/i)).toBeInTheDocument();
    expect(screen.getByText('Chart View')).toBeInTheDocument();
    expect(screen.getByText('Data Table')).toBeInTheDocument();
    expect(screen.getByText('Dimension (X-Axis)')).toBeInTheDocument();
    expect(screen.getByText('Metric (Y-Axis)')).toBeInTheDocument();
  });

  it('switches between Chart View and Data Table view', () => {
    render(<DataChartTool />);
    const tableBtn = screen.getByText('Data Table');
    fireEvent.click(tableBtn);
    expect(screen.getByPlaceholderText('Search records...')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();

    const chartBtn = screen.getByText('Chart View');
    fireEvent.click(chartBtn);
    expect(screen.getByText('Dimension (X-Axis)')).toBeInTheDocument();
  });

  it('switches chart type to Line and Donut', () => {
    render(<DataChartTool />);
    const lineBtn = screen.getByRole('button', { name: 'Line' });
    fireEvent.click(lineBtn);

    const donutBtn = screen.getByRole('button', { name: 'Donut' });
    fireEvent.click(donutBtn);

    const container = screen.getByTestId('chart-svg-container');
    expect(container).toBeInTheDocument();
  });

  it('opens and closes the Import Data modal', () => {
    render(<DataChartTool />);
    const importBtn = screen.getByText('Import Data');
    fireEvent.click(importBtn);
    expect(screen.getByRole('heading', { name: 'Import Custom Dataset' })).toBeInTheDocument();

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(
      screen.queryByRole('heading', { name: 'Import Custom Dataset' })
    ).not.toBeInTheDocument();
  });

  it('copies SVG markup to clipboard', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<DataChartTool />);
    const copySvgBtn = screen.getByText('Copy SVG');
    fireEvent.click(copySvgBtn);
    expect(writeTextMock).toHaveBeenCalled();
  });
});
