// A simple hashing function. In a real-world scenario, a more robust hash like SHA-1 or MurmurHash would be used.
function simpleHash(str: string, max: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % max;
}


interface RingNode {
    id: string;
    name: string;
    hash: number;
}

export class ConsistentHashing {
    private ring: RingNode[] = [];
    private readonly ringSize = 360; // Represents a 360-degree ring

    constructor(servers: { id: string; name: string; status: 'online' | 'offline' }[]) {
        this.rebuildRing(servers);
    }

    private rebuildRing(servers: { id: string; name: string; status: 'online' | 'offline' }[]) {
        this.ring = [];
        servers.forEach(server => {
            if (server.status === 'online') {
                this.addServer(server);
            }
        });
    }

    addServer(server: { id: string; name: string; }): void {
        const hash = simpleHash(server.id, this.ringSize);
        this.ring.push({ ...server, hash });
        this.ring.sort((a, b) => a.hash - b.hash);
    }

    removeServer(serverId: string): void {
        this.ring = this.ring.filter(node => node.id !== serverId);
        // The ring remains sorted
    }
    
    getNextServer(requestKey: string): RingNode | null {
        if (this.ring.length === 0) {
            return null;
        }

        const requestHash = simpleHash(requestKey, this.ringSize);

        // Find the first server with a hash greater than or equal to the request's hash
        for (const server of this.ring) {
            if (server.hash >= requestHash) {
                return server;
            }
        }
        
        // If no server is found, wrap around to the first server on the ring
        return this.ring[0];
    }
}
