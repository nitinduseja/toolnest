import { ColorTheme, DataPreset } from './types';

export const THEME_PALETTES: Record<ColorTheme, string[]> = {
  indigo: ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#4F46E5', '#4338CA', '#3730A3', '#312E81'],
  emerald: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#059669', '#047857', '#065F46', '#064E3B'],
  amber: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#D97706', '#B45309', '#92400E', '#78350F'],
  sunset: ['#F43F5E', '#FB7185', '#FB923C', '#FBBF24', '#E11D48', '#BE123C', '#9F1239', '#881337'],
  cyber: ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981', '#14B8A6', '#F59E0B'],
};

export const DATA_PRESETS: DataPreset[] = [
  {
    id: 'saas-metrics',
    name: 'SaaS Monthly Performance',
    description: '12-month revenue, user growth, and operational costs.',
    defaultDimension: 'Month',
    defaultMetric: 'Revenue',
    defaultType: 'bar',
    rawCsv: `Month,Revenue,NewUsers,ChurnRate,ServerCost
Jan,12500,340,2.1,1200
Feb,14200,420,1.9,1350
Mar,18900,580,2.4,1600
Apr,21400,640,1.8,1750
May,24800,720,1.5,1900
Jun,28500,850,1.7,2100
Jul,31200,910,1.6,2300
Aug,35600,1050,1.4,2500
Sep,39800,1180,1.5,2750
Oct,44500,1320,1.3,3100
Nov,49200,1490,1.2,3400
Dec,56000,1680,1.1,3900`,
  },
  {
    id: 'server-nodes',
    name: 'Cluster Nodes Resource Usage',
    description: 'CPU, Memory, and Network IO across microservice host nodes.',
    defaultDimension: 'Node',
    defaultMetric: 'CPU_Percent',
    defaultType: 'bar',
    rawCsv: `Node,CPU_Percent,Memory_GB,IOPS,Network_MBps
node-alpha,42,14.5,2800,85
node-beta,78,28.2,5600,190
node-gamma,35,11.8,2100,64
node-delta,91,30.4,7200,240
node-epsilon,58,18.6,4100,130
node-zeta,64,22.0,4800,155
node-eta,22,8.4,1400,42`,
  },
  {
    id: 'ecommerce-categories',
    name: 'E-Commerce Category Share',
    description: 'Gross sales volume, units sold, and returns across categories.',
    defaultDimension: 'Category',
    defaultMetric: 'GrossSales',
    defaultType: 'donut',
    rawCsv: `Category,GrossSales,UnitsSold,AvgMargin,ReturnRate
Electronics,84500,1420,24,6.2
Apparel,52300,2850,48,9.4
Home & Kitchen,38900,1640,36,4.1
Books & Media,18200,1980,52,1.8
Sports & Outdoors,29400,980,41,3.5
Beauty & Personal,24600,1860,55,2.9`,
  },
];
