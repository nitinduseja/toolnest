import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CssAnimationBuilderTool } from './index';

describe('CssAnimationBuilder Component', () => {
  it('renders presets, configuration controls, and generated CSS output', () => {
    render(<CssAnimationBuilderTool />);
    expect(screen.getByText('CSS Keyframes & Animation Builder')).toBeInTheDocument();
    expect(screen.getByText('Gentle Bounce')).toBeInTheDocument();
    expect(screen.getByText(/Keyframe Steps/)).toBeInTheDocument();
    expect(screen.getByText(/@keyframes gentle-bounce/)).toBeInTheDocument();
  });

  it('switches presets and updates keyframes and CSS output', () => {
    render(<CssAnimationBuilderTool />);
    fireEvent.click(screen.getByText('Wobble Shake'));
    expect(screen.getByText(/@keyframes wobble-shake/)).toBeInTheDocument();
  });

  it('toggles code export between Pure CSS and Tailwind CSS and triggers copy', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    render(<CssAnimationBuilderTool />);

    fireEvent.click(screen.getByText('Tailwind CSS'));
    expect(screen.getByText(/tailwind\.config\.js/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Copy Code'));
    await screen.findByText('Copied');
    expect(writeText).toHaveBeenCalled();
  });

  it('adds a new keyframe step and controls animation playback', () => {
    render(<CssAnimationBuilderTool />);
    fireEvent.click(screen.getByText('Add Step'));
    expect(screen.getByText('Keyframe Steps (4)')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Pause'));
    expect(screen.getByText('Play')).toBeInTheDocument();
  });
});
