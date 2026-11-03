import { IpClass, IpType, SubnetDetails, VlsmRequest, VlsmSubnet } from './types';

export function ipv4ToUint32(ip: string): number {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return 0;
  let res = 0;
  for (const part of parts) {
    const num = Number(part);
    if (isNaN(num) || num < 0 || num > 255) return 0;
    res = ((res << 8) + num) >>> 0;
  }
  return res;
}

export function uint32ToIpv4(uint: number): string {
  return [(uint >>> 24) & 255, (uint >>> 16) & 255, (uint >>> 8) & 255, uint & 255].join('.');
}

export function cidrToUint32Mask(cidr: number): number {
  if (cidr <= 0) return 0;
  if (cidr >= 32) return 0xffffffff >>> 0;
  return (0xffffffff << (32 - cidr)) >>> 0;
}

export function uint32ToBinaryString(uint: number): string {
  const octets: string[] = [];
  for (let i = 3; i >= 0; i--) {
    const oct = (uint >>> (i * 8)) & 255;
    octets.push(oct.toString(2).padStart(8, '0'));
  }
  return octets.join('.');
}

export function parseCidrInput(input: string): { ip: string; cidr: number } | null {
  const clean = input.trim();
  if (!clean) return null;
  const parts = clean.split('/');
  const ip = parts[0].trim();
  const octets = ip.split('.');
  if (octets.length !== 4) return null;
  for (const o of octets) {
    const n = Number(o);
    if (isNaN(n) || n < 0 || n > 255 || (o.length > 1 && o.startsWith('0'))) return null;
  }
  let cidr = 24;
  if (parts.length > 1) {
    const parsedCidr = Number(parts[1].trim());
    if (isNaN(parsedCidr) || parsedCidr < 0 || parsedCidr > 32) return null;
    cidr = parsedCidr;
  }
  return { ip, cidr };
}

export function determineIpClass(uint: number): IpClass {
  const firstOctet = (uint >>> 24) & 255;
  if (firstOctet <= 127) return 'A';
  if (firstOctet <= 191) return 'B';
  if (firstOctet <= 223) return 'C';
  if (firstOctet <= 239) return 'D';
  return 'E';
}

export function determineIpType(uint: number): IpType {
  const first = (uint >>> 24) & 255;
  const second = (uint >>> 16) & 255;
  if (first === 10) return 'Private';
  if (first === 172 && second >= 16 && second <= 31) return 'Private';
  if (first === 192 && second === 168) return 'Private';
  if (first === 127) return 'Loopback';
  if (first === 169 && second === 254) return 'Link-Local';
  if (first >= 224 && first <= 239) return 'Multicast';
  if (first >= 240) return 'Reserved';
  return 'Public';
}

function calculateHostCounts(cidr: number): { total: number; usable: number } {
  if (cidr === 32) return { total: 1, usable: 1 };
  if (cidr === 31) return { total: 2, usable: 2 };
  const total = Math.pow(2, 32 - cidr);
  const usable = Math.max(0, total - 2);
  return { total, usable };
}

function getUsableIpRange(
  networkUint: number,
  broadcastUint: number,
  cidr: number
): { first: string; last: string } {
  if (cidr === 32) {
    return { first: uint32ToIpv4(networkUint), last: uint32ToIpv4(networkUint) };
  }
  if (cidr === 31) {
    return { first: uint32ToIpv4(networkUint), last: uint32ToIpv4(broadcastUint) };
  }
  return {
    first: uint32ToIpv4((networkUint + 1) >>> 0),
    last: uint32ToIpv4((broadcastUint - 1) >>> 0),
  };
}

export function calculateSubnetDetails(ip: string, cidr: number): SubnetDetails {
  const ipUint = ipv4ToUint32(ip);
  const maskUint = cidrToUint32Mask(cidr);
  const wildcardUint = ~maskUint >>> 0;
  const networkUint = (ipUint & maskUint) >>> 0;
  const broadcastUint = (networkUint | wildcardUint) >>> 0;

  const { total, usable } = calculateHostCounts(cidr);
  const { first, last } = getUsableIpRange(networkUint, broadcastUint, cidr);

  return {
    ip,
    cidr,
    netmask: uint32ToIpv4(maskUint),
    wildcardMask: uint32ToIpv4(wildcardUint),
    networkAddress: uint32ToIpv4(networkUint),
    broadcastAddress: uint32ToIpv4(broadcastUint),
    firstUsableIp: first,
    lastUsableIp: last,
    totalHosts: total,
    usableHosts: usable,
    ipClass: determineIpClass(ipUint),
    ipType: determineIpType(ipUint),
    binaryIp: uint32ToBinaryString(ipUint),
    binaryNetmask: uint32ToBinaryString(maskUint),
    binaryNetwork: uint32ToBinaryString(networkUint),
  };
}

export function hostsToCidr(neededHosts: number): number {
  if (neededHosts <= 1) return 30;
  const totalNeeded = neededHosts + 2;
  let bits = 0;
  while (Math.pow(2, bits) < totalNeeded && bits < 32) {
    bits++;
  }
  return 32 - bits;
}

export function calculateVlsm(
  baseIp: string,
  baseCidr: number,
  requests: VlsmRequest[]
): VlsmSubnet[] {
  const sorted = [...requests].sort((a, b) => b.neededHosts - a.neededHosts);
  let currentUint = (ipv4ToUint32(baseIp) & cidrToUint32Mask(baseCidr)) >>> 0;
  const results: VlsmSubnet[] = [];

  for (const req of sorted) {
    const subCidr = hostsToCidr(req.neededHosts);
    const subMask = cidrToUint32Mask(subCidr);
    const wildcard = ~subMask >>> 0;
    const netUint = currentUint;
    const bcastUint = (netUint | wildcard) >>> 0;
    const allocated = Math.pow(2, 32 - subCidr) - 2;
    const { first, last } = getUsableIpRange(netUint, bcastUint, subCidr);

    results.push({
      id: req.id,
      name: req.name,
      neededHosts: req.neededHosts,
      allocatedHosts: Math.max(0, allocated),
      cidr: subCidr,
      netmask: uint32ToIpv4(subMask),
      networkAddress: uint32ToIpv4(netUint),
      firstUsableIp: first,
      lastUsableIp: last,
      broadcastAddress: uint32ToIpv4(bcastUint),
    });

    currentUint = (bcastUint + 1) >>> 0;
  }

  return results;
}
