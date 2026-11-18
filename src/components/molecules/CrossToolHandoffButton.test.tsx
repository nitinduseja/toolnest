import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CrossToolHandoffButton } from './CrossToolHandoffButton';
import * as handoffLib from '@/lib/handoff/crossToolHandoff';

describe('CrossToolHandoffButton', () => {
  it('renders single target button directly', () => {
    const sendSpy = vi.spyOn(handoffLib, 'sendToTool').mockReturnValue({
      sourceToolSlug: 'csv-json',
      targetToolSlug: 'data-chart',
      data: 'a,b\n1,2',
      timestamp: Date.now(),
    });

    render(
      <BrowserRouter>
        <CrossToolHandoffButton
          targets={[{ slug: 'data-chart', label: 'Visualize Chart' }]}
          getData={() => 'a,b\n1,2'}
          sourceSlug="csv-json"
        />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /visualize chart/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(sendSpy).toHaveBeenCalledWith(
      expect.anything(),
      'data-chart',
      expect.objectContaining({
        data: 'a,b\n1,2',
        label: 'Visualize Chart',
        sourceToolSlug: 'csv-json',
      })
    );
  });

  it('renders dropdown menu for multiple targets', () => {
    const sendSpy = vi.spyOn(handoffLib, 'sendToTool').mockReturnValue({
      sourceToolSlug: 'csv-json',
      targetToolSlug: 'data-chart',
      data: 'a,b\n1,2',
      timestamp: Date.now(),
    });

    render(
      <BrowserRouter>
        <CrossToolHandoffButton
          targets={[
            { slug: 'data-chart', label: 'Visualize Chart' },
            { slug: 'json-to-typescript', label: 'Generate Types' },
          ]}
          getData={() => '{"id":1}'}
          sourceSlug="json-formatter"
        />
      </BrowserRouter>
    );

    const trigger = screen.getByRole('button', { name: /send to\.\.\./i });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    const option1 = screen.getByRole('button', { name: /visualize chart/i });
    const option2 = screen.getByRole('button', { name: /generate types/i });
    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();

    fireEvent.click(option2);
    expect(sendSpy).toHaveBeenCalledWith(
      expect.anything(),
      'json-to-typescript',
      expect.objectContaining({
        data: '{"id":1}',
        label: 'Generate Types',
        sourceToolSlug: 'json-formatter',
      })
    );
  });

  it('respects disabled state', () => {
    render(
      <BrowserRouter>
        <CrossToolHandoffButton
          targets={[{ slug: 'data-chart', label: 'Visualize Chart' }]}
          getData={() => ''}
          sourceSlug="csv-json"
          disabled
        />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /visualize chart/i });
    expect(button).toBeDisabled();
  });
});
