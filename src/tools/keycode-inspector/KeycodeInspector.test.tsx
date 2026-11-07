import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KeycodeInspectorTool } from './index';

describe('KeycodeInspectorTool', () => {
  it('renders default Enter key details', () => {
    render(<KeycodeInspectorTool />);
    expect(screen.getByTestId('hero-keycode')).toHaveTextContent('13');
    expect(screen.getByTestId('hero-key-display')).toHaveTextContent('↵ Enter');
    expect(screen.getByText('Keycode & Keyboard Event Inspector')).toBeInTheDocument();
  });

  it('updates display when physical window keydown is fired', () => {
    render(<KeycodeInspectorTool />);

    fireEvent.keyDown(window, {
      key: 'k',
      code: 'KeyK',
      keyCode: 75,
      which: 75,
      ctrlKey: true,
    });

    expect(screen.getByTestId('hero-keycode')).toHaveTextContent('75');
    expect(screen.getByTestId('hero-key-display')).toHaveTextContent('k');
    expect(screen.getByText('KeyK')).toBeInTheDocument();
  });

  it('simulates key click via virtual keypad', () => {
    render(<KeycodeInspectorTool />);

    const spaceButton = screen.getByRole('button', { name: /Space ␣/i });
    fireEvent.click(spaceButton);

    expect(screen.getByTestId('hero-keycode')).toHaveTextContent('32');
    expect(screen.getByTestId('hero-key-display')).toHaveTextContent('Space');
  });

  it('opens code snippet modal and displays generated code', () => {
    render(<KeycodeInspectorTool />);

    const snippetBtn = screen.getByRole('button', { name: /Generate Code/i });
    fireEvent.click(snippetBtn);

    expect(screen.getByText('Event Listener Snippet')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Event Listener Snippet')).not.toBeInTheDocument();
  });
});
