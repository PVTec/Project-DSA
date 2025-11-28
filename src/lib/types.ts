export interface ServerNode {
  id: string;
  name: string;
  weight: number;
  currentLoad: number;
  capacity: number;
  status: 'online' | 'offline';
}

export type Algorithm = 'wrr' | 'ch';