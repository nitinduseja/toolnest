import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubnetCalculatorTool } from './index';

describe('SubnetCalculator Component', () => {
  it('renders default 192.168.1.1/24 details and preset controls', () => {
    render(<SubnetCalculatorTool />);
    expect(screen.getByText('Subnet & CIDR IP Calculator')).toBeInTheDocument();
    expect(screen.getByText('/24')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.0/24')).toBeInTheDocument();
  });

  it('applies CIDR preset and switches between details and VLSM planner tabs', () => {
    render(<SubnetCalculatorTool />);
    fireEvent.click(screen.getByText('10.0.0.0/16 (Corporate)'));
    expect(screen.getByText('/16')).toBeInTheDocument();
    expect(screen.getByText('10.0.0.0/16')).toBeInTheDocument();

    fireEvent.click(screen.getByText('VLSM Subnet Planner'));
    expect(screen.getByText('ADD SUBNET PARTITION (VLSM)')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });
});
