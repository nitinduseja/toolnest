import { describe, it, expect } from 'vitest';
import {
  ipv4ToUint32,
  uint32ToIpv4,
  cidrToUint32Mask,
  uint32ToBinaryString,
  parseCidrInput,
  determineIpClass,
  determineIpType,
  calculateSubnetDetails,
  hostsToCidr,
  calculateVlsm,
} from './subnetLogic';

describe('subnetLogic', () => {
  describe('ipv4ToUint32 and uint32ToIpv4', () => {
    it('round-trips standard IPv4 addresses', () => {
      const ips = ['192.168.1.1', '10.0.0.1', '172.16.254.1', '255.255.255.255', '0.0.0.0'];
      for (const ip of ips) {
        expect(uint32ToIpv4(ipv4ToUint32(ip))).toBe(ip);
      }
    });

    it('handles invalid addresses gracefully', () => {
      expect(ipv4ToUint32('invalid')).toBe(0);
      expect(ipv4ToUint32('256.0.0.1')).toBe(0);
      expect(ipv4ToUint32('1.2.3')).toBe(0);
    });
  });

  describe('cidrToUint32Mask', () => {
    it('computes correct subnet masks', () => {
      expect(uint32ToIpv4(cidrToUint32Mask(24))).toBe('255.255.255.0');
      expect(uint32ToIpv4(cidrToUint32Mask(16))).toBe('255.255.0.0');
      expect(uint32ToIpv4(cidrToUint32Mask(8))).toBe('255.0.0.0');
      expect(uint32ToIpv4(cidrToUint32Mask(30))).toBe('255.255.255.252');
      expect(uint32ToIpv4(cidrToUint32Mask(32))).toBe('255.255.255.255');
      expect(uint32ToIpv4(cidrToUint32Mask(0))).toBe('0.0.0.0');
    });
  });

  describe('uint32ToBinaryString', () => {
    it('formats binary octets correctly', () => {
      expect(uint32ToBinaryString(ipv4ToUint32('192.168.1.1'))).toBe(
        '11000000.10101000.00000001.00000001'
      );
    });
  });

  describe('parseCidrInput', () => {
    it('parses valid IP and CIDR prefix', () => {
      expect(parseCidrInput('192.168.1.50/24')).toEqual({ ip: '192.168.1.50', cidr: 24 });
      expect(parseCidrInput('10.0.0.1/8')).toEqual({ ip: '10.0.0.1', cidr: 8 });
      expect(parseCidrInput('172.16.0.1')).toEqual({ ip: '172.16.0.1', cidr: 24 });
    });

    it('rejects invalid inputs', () => {
      expect(parseCidrInput('')).toBeNull();
      expect(parseCidrInput('999.1.1.1/24')).toBeNull();
      expect(parseCidrInput('192.168.1.1/35')).toBeNull();
    });
  });

  describe('determineIpClass and determineIpType', () => {
    it('identifies classes correctly', () => {
      expect(determineIpClass(ipv4ToUint32('10.0.0.1'))).toBe('A');
      expect(determineIpClass(ipv4ToUint32('172.16.0.1'))).toBe('B');
      expect(determineIpClass(ipv4ToUint32('192.168.1.1'))).toBe('C');
      expect(determineIpClass(ipv4ToUint32('224.0.0.1'))).toBe('D');
      expect(determineIpClass(ipv4ToUint32('240.0.0.1'))).toBe('E');
    });

    it('identifies private, public, loopback, and multicast types', () => {
      expect(determineIpType(ipv4ToUint32('10.0.0.1'))).toBe('Private');
      expect(determineIpType(ipv4ToUint32('172.20.0.1'))).toBe('Private');
      expect(determineIpType(ipv4ToUint32('192.168.0.1'))).toBe('Private');
      expect(determineIpType(ipv4ToUint32('127.0.0.1'))).toBe('Loopback');
      expect(determineIpType(ipv4ToUint32('169.254.1.1'))).toBe('Link-Local');
      expect(determineIpType(ipv4ToUint32('8.8.8.8'))).toBe('Public');
      expect(determineIpType(ipv4ToUint32('224.0.0.5'))).toBe('Multicast');
    });
  });

  describe('calculateSubnetDetails', () => {
    it('calculates full subnet details for a /24', () => {
      const details = calculateSubnetDetails('192.168.1.100', 24);
      expect(details.netmask).toBe('255.255.255.0');
      expect(details.wildcardMask).toBe('0.0.0.255');
      expect(details.networkAddress).toBe('192.168.1.0');
      expect(details.broadcastAddress).toBe('192.168.1.255');
      expect(details.firstUsableIp).toBe('192.168.1.1');
      expect(details.lastUsableIp).toBe('192.168.1.254');
      expect(details.totalHosts).toBe(256);
      expect(details.usableHosts).toBe(254);
    });

    it('calculates /30 point-to-point subnet correctly', () => {
      const details = calculateSubnetDetails('10.0.0.1', 30);
      expect(details.netmask).toBe('255.255.255.252');
      expect(details.totalHosts).toBe(4);
      expect(details.usableHosts).toBe(2);
      expect(details.firstUsableIp).toBe('10.0.0.1');
      expect(details.lastUsableIp).toBe('10.0.0.2');
    });
  });

  describe('VLSM calculation', () => {
    it('allocates subnets in descending order of needed hosts', () => {
      const subnets = calculateVlsm('192.168.1.0', 24, [
        { id: '1', name: 'Engineering', neededHosts: 50 },
        { id: '2', name: 'Sales', neededHosts: 25 },
        { id: '3', name: 'DMZ', neededHosts: 10 },
      ]);

      expect(subnets).toHaveLength(3);
      expect(subnets[0].name).toBe('Engineering');
      expect(subnets[0].cidr).toBe(26); // 62 usable
      expect(subnets[0].networkAddress).toBe('192.168.1.0');

      expect(subnets[1].name).toBe('Sales');
      expect(subnets[1].cidr).toBe(27); // 30 usable
      expect(subnets[1].networkAddress).toBe('192.168.1.64');

      expect(subnets[2].name).toBe('DMZ');
      expect(subnets[2].cidr).toBe(28); // 14 usable
      expect(subnets[2].networkAddress).toBe('192.168.1.96');
    });

    it('calculates prefix for requested host count', () => {
      expect(hostsToCidr(50)).toBe(26);
      expect(hostsToCidr(25)).toBe(27);
      expect(hostsToCidr(1)).toBe(30);
    });
  });
});
