import type { ServerNode } from "@/lib/types";
import { ServerCard } from "./server-card";
import { ScrollArea } from "./ui/scroll-area";

interface ServerArenaProps {
  servers: ServerNode[];
}

export function ServerArena({ servers }: ServerArenaProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 md:p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {servers.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </ScrollArea>
  );
}
