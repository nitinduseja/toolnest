import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserAgentParserTool } from './index';

describe('UserAgentParserTool', () => {
  it('renders initial UA inspection data', () => {
    render(<UserAgentParserTool />);
    expect(screen.getByText('User-Agent & Client Hints Parser')).toBeInTheDocument();
    expect(screen.getByTestId('ua-browser-name')).toBeInTheDocument();
    expect(screen.getByTestId('ua-os-name')).toBeInTheDocument();
    expect(screen.getByTestId('ua-device-type')).toBeInTheDocument();
    expect(screen.getByTestId('ua-engine-name')).toBeInTheDocument();
  });

  it('updates parsed output when selecting a preset', () => {
    render(<UserAgentParserTool />);

    const botPresetBtn = screen.getByRole('button', { name: /Googlebot Smartphone/i });
    fireEvent.click(botPresetBtn);

    expect(screen.getByTestId('ua-device-type')).toHaveTextContent('Bot');
    expect(
      screen.getByText(/Automated Crawler \/ Search Engine Bot Detected:/i)
    ).toBeInTheDocument();
  });

  it('updates parsed output when user edits textarea input', () => {
    render(<UserAgentParserTool />);

    const textarea = screen.getByPlaceholderText(/Paste or enter any User-Agent string here/i);
    fireEvent.change(textarea, {
      target: {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
      },
    });

    expect(screen.getByTestId('ua-browser-name')).toHaveTextContent('Safari');
    expect(screen.getByTestId('ua-os-name')).toHaveTextContent('iOS');
    expect(screen.getByTestId('ua-device-type')).toHaveTextContent('Mobile');
  });
});
