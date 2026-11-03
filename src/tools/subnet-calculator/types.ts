/**
 * Types for the Subnet & CIDR IP Calculator.
 */

export type IpClass = 'A' | 'B' | 'C' | 'D' | 'E';
export type IpType = 'Public' | 'Private' | 'Loopback' | 'Link-Local' | 'Multicast' | 'Reserved';

export interface SubnetDetails {
  ip: string;
  cidr: number;
  netmask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: IpClass;
  ipType: IpType;
  binaryIp: string;
  binaryNetmask: string;
  binaryNetwork: string;
}

export interface VlsmRequest {
  id: string;
  name: string;
  neededHosts: number;
}

export interface VlsmSubnet {
  id: string;
  name: string;
  neededHosts: number;
  allocatedHosts: number;
  cidr: number;
  netmask: string;
  networkAddress: string;
  firstUsableIp: string;
  lastUsableIp: string;
  broadcastAddress: string;
}
