import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenApiInspectorTool } from './index';

describe('OpenApiInspectorTool', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders default tool title and Petstore endpoints list', () => {
    render(<OpenApiInspectorTool />);
    expect(screen.getByText('OpenAPI / Swagger Spec Inspector')).toBeInTheDocument();
    expect(screen.getAllByText('/pets').length).toBeGreaterThan(0);
    expect(screen.getAllByText('List all pets').length).toBeGreaterThan(0);
  });

  it('switches to Raw Spec YAML tab', () => {
    render(<OpenApiInspectorTool />);

    const rawTab = screen.getByRole('button', { name: /Spec YAML/i });
    fireEvent.click(rawTab);

    expect(screen.getByPlaceholderText(/Paste your OpenAPI YAML/i)).toBeInTheDocument();
  });

  it('selects preset and updates endpoints', () => {
    render(<OpenApiInspectorTool />);

    const authPresetBtn = screen.getByRole('button', { name: /Auth & Profile API/i });
    fireEvent.click(authPresetBtn);

    expect(screen.getAllByText('/auth/login').length).toBeGreaterThan(0);
    expect(screen.getAllByText('/users/me').length).toBeGreaterThan(0);
  });
});
