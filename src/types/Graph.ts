export interface Node {
  id: number;
  position: { x: number; y: number };
  color: string;
  visited: boolean;
  component: number;
}

export interface Edge {
  from: number;
  to: number;
}

export type NodeState = 'unvisited' | 'visiting' | 'visited';

export const NODE_COLORS = {
  UNVISITED: '#9CA3AF',
  VISITING: '#FCD34D',
  COMPONENT_1: '#10B981',
  COMPONENT_2: '#3B82F6',
  COMPONENT_3: '#EF4444',
  COMPONENT_4: '#8B5CF6',
  COMPONENT_5: '#F59E0B',
  COMPONENT_6: '#EC4899',
  COMPONENT_7: '#14B8A6',
  COMPONENT_8: '#F97316',
};

export const COMPONENT_COLORS = [
  NODE_COLORS.COMPONENT_1,
  NODE_COLORS.COMPONENT_2,
  NODE_COLORS.COMPONENT_3,
  NODE_COLORS.COMPONENT_4,
  NODE_COLORS.COMPONENT_5,
  NODE_COLORS.COMPONENT_6,
  NODE_COLORS.COMPONENT_7,
  NODE_COLORS.COMPONENT_8,
];
