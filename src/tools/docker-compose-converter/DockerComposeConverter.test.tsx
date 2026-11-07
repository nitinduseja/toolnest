import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DockerComposeConverterTool } from './index';

describe('DockerComposeConverterTool Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders the header, preset bar, and initial converted yaml', () => {
    render(<DockerComposeConverterTool />);

    expect(screen.getByText('Docker Run to Compose Converter')).toBeInTheDocument();
    expect(screen.getByText('Popular Docker Run Presets')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL Database')).toBeInTheDocument();
  });

  it('updates compose YAML when selecting a preset', () => {
    render(<DockerComposeConverterTool />);

    const postgresPreset = screen.getByText('PostgreSQL Database');
    fireEvent.click(postgresPreset);

    // Verify postgres image is in the parsed pills and yaml
    expect(screen.getByText('postgres:16-alpine')).toBeInTheDocument();
  });

  it('copies generated YAML when copy button is clicked', async () => {
    render(<DockerComposeConverterTool />);

    const copyBtn = screen.getByRole('button', { name: /copy yaml/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
