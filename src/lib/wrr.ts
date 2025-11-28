import type { ServerNode } from './types';

interface ServerForWRR extends Pick<ServerNode, 'id' | 'name' | 'weight'> {
  currentWeight: number;
}

export class WeightedRoundRobin {
  private servers: ServerForWRR[];
  private totalWeight: number;

  constructor(servers: Pick<ServerNode, 'id' | 'name' | 'weight' | 'status'>[]) {
    this.servers = servers.filter(s => s.status === 'online').map(s => ({ id: s.id, name: s.name, weight: s.weight, currentWeight: 0 }));
    this.totalWeight = this.servers.reduce((sum, server) => sum + server.weight, 0);

    if (this.totalWeight === 0 && this.servers.length > 0) {
      // Fallback for all zero weights
      this.servers.forEach(s => s.weight = 1);
      this.totalWeight = this.servers.length;
    }
  }

  public getNextServer(): Pick<ServerNode, 'id' | 'name' | 'weight'> {
    if (this.servers.length === 0) {
      throw new Error("No online servers available to handle the request.");
    }

    let bestServer: ServerForWRR | null = null;
    let maxWeight = -Infinity;

    for (const server of this.servers) {
        server.currentWeight += server.weight;
        if (server.currentWeight > maxWeight) {
            maxWeight = server.currentWeight;
            bestServer = server;
        }
    }
    
    // This should not happen if there are servers, but as a safeguard.
    if (!bestServer) {
      bestServer = this.servers[0];
    }
    
    bestServer.currentWeight -= this.totalWeight;
    
    const { currentWeight, ...result } = bestServer;
    return result;
  }
}
