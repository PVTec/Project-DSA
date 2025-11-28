import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bot, Rss } from "lucide-react";
import { cn } from "@/lib/utils";

interface HadesSidebarProps {
  logs: string[];
  onToggleAssistant: () => void;
}

export function HadesSidebar({ logs, onToggleAssistant }: HadesSidebarProps) {
  return (
    <aside className="flex flex-col w-full shrink-0 md:w-80 md:h-screen border-b md:border-b-0 md:border-r bg-card/50 text-card-foreground">
      <div className="p-4 h-16 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-widest text-primary animate-glow">HADES PROTOCOL</h2>
      </div>
      <Separator />
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          Greetings, Operator. I am HADES. This console displays system logs. Configure settings and inject traffic to begin the simulation.
        </p>
      </div>
      <Separator />
      <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
              <Rss className="w-4 h-4 text-primary" />
              <span>SYSTEM LOG</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 relative" onClick={onToggleAssistant}>
              <Bot className="h-4 w-4" />
              <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary/90"></span>
              </span>
          </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 pt-0">
          <div className="flex flex-col-reverse gap-2">
            {logs.map((log, index) => (
              <p key={index} className="font-mono text-xs text-foreground/80 break-words">
                <span className="text-primary/80">&gt; </span>{log}
              </p>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
