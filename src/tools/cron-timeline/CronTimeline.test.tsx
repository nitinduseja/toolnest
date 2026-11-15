import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CronTimelineTool from './index';

describe('CronTimelineTool Component', () => {
  it('renders timezone selector, stat badges, and timeline tabs', () => {
    render(<CronTimelineTool />);
    expect(screen.getByText('Timezone:')).toBeInTheDocument();
    expect(screen.getByText('Active Jobs')).toBeInTheDocument();
    expect(screen.getByText('Runs Next 24h')).toBeInTheDocument();
    expect(screen.getByText('Timeline Gantt')).toBeInTheDocument();
    expect(screen.getByText(/Load Heatmap & Collisions/i)).toBeInTheDocument();
    expect(screen.getByText('Upcoming Stream')).toBeInTheDocument();
  });

  it('switches view horizon to 7 days', () => {
    render(<CronTimelineTool />);
    const sevenDaysBtn = screen.getByText('7 Days');
    fireEvent.click(sevenDaysBtn);
    expect(screen.getByText(/Execution Timeline \(7 Days\)/i)).toBeInTheDocument();
  });

  it('switches tabs to Load Heatmap and Upcoming Stream', () => {
    render(<CronTimelineTool />);
    const heatmapTab = screen.getByText(/Load Heatmap & Collisions/i);
    fireEvent.click(heatmapTab);
    expect(screen.getByText(/24-Hour Load Heatmap/i)).toBeInTheDocument();

    const upcomingTab = screen.getByText('Upcoming Stream');
    fireEvent.click(upcomingTab);
    expect(screen.getByText(/Upcoming Execution Stream/i)).toBeInTheDocument();
  });

  it('toggles job active status and updates active stats', () => {
    render(<CronTimelineTool />);
    const toggleButtons = screen.getAllByTitle(/Disable Job/i);
    expect(toggleButtons.length).toBeGreaterThan(0);
    fireEvent.click(toggleButtons[0]);
    // The first job should now be disabled
    expect(screen.getByTitle(/Enable Job/i)).toBeInTheDocument();
  });

  it('opens and closes the Import Crontab modal', () => {
    render(<CronTimelineTool />);
    const importBtn = screen.getByText('Import Crontab');
    fireEvent.click(importBtn);
    expect(screen.getByRole('heading', { name: 'Import Crontab' })).toBeInTheDocument();

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(screen.queryByRole('heading', { name: 'Import Crontab' })).not.toBeInTheDocument();
  });

  it('copies crontab output to clipboard', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<CronTimelineTool />);
    const exportBtn = screen.getByText('Export Crontab');
    fireEvent.click(exportBtn);
    expect(writeTextMock).toHaveBeenCalled();
  });
});
