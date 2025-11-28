import type { ServerNode } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerCardProps {
  server: ServerNode;
}

export function ServerCard({ server }: ServerCardProps) {
  const loadPercentage = server.capacity > 0 ? (server.currentLoad / server.capacity) * 100 : 0;
  const isOverloaded = loadPercentage > 80;
  const isWarning = loadPercentage > 60 && !isOverloaded;

  return (
    <Card className={cn(
        "bg-card border-border/80 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group",
        server.status === 'offline' && "opacity-50 bg-muted/50"
    )}>
        <div className={cn(
            "absolute top-0 right-0 h-2.5 w-2.5 m-4 rounded-full bg-green-400 shadow-lg shadow-green-400/50",
            server.status === 'offline' && "bg-gray-500 shadow-none",
            isWarning && "bg-yellow-400 shadow-yellow-400/50",
            isOverloaded && "bg-red-500 shadow-red-500/50 animate-pulse"
        )} />
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
                <Server className="text-primary" />
                <span className="truncate">{server.name}</span>
            </CardTitle>
            <CardDescription className="font-mono text-xs whitespace-nowrap bg-muted px-2 py-1 rounded">W: {server.weight}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground font-mono">
            <span>LOAD</span>
            <span>{server.currentLoad}/{server.capacity}</span>
          </div>
          <Progress 
            value={loadPercentage} 
            className={cn(
                "h-2",
                !isWarning && !isOverloaded && "[&>div]:bg-primary/80",
                isWarning && "[&>div]:bg-yellow-400",
                isOverloaded && "[&>div]:bg-red-500"
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
