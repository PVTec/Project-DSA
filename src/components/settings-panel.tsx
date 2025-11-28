import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Zap, Settings, Waypoints } from "lucide-react";
import type { ServerNode, Algorithm } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";

interface SettingsPanelProps {
  onInjectTraffic: (count: number) => void;
  isAutoInjecting: boolean;
  onToggleAutoInject: () => void;
  autoInjectInterval: number;
  onIntervalChange: (value: number) => void;
  onServerAdd: (server: Omit<ServerNode, 'id' | 'currentLoad' | 'capacity' | 'status'>) => void;
  onServerRemove: (id: string) => void;
  onWeightChange: (id: string, weight: number) => void;
  servers: ServerNode[];
  algorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
}

export function SettingsPanel({
  onInjectTraffic,
  isAutoInjecting,
  onToggleAutoInject,
  autoInjectInterval,
  onIntervalChange,
  onServerAdd,
  onServerRemove,
  onWeightChange,
  servers,
  algorithm,
  onAlgorithmChange,
}: SettingsPanelProps) {

  const [newServerName, setNewServerName] = useState("");
  const [newServerWeight, setNewServerWeight] = useState(1);
  const [injectionCount, setInjectionCount] = useState(1);
  
  const handleAdd = () => {
    if (newServerName.trim()) {
      onServerAdd({ name: newServerName.trim(), weight: newServerWeight });
      setNewServerName("");
      setNewServerWeight(1);
    }
  }

  const handleInject = () => {
    onInjectTraffic(injectionCount);
  };

  return (
    <Card className="w-full md:w-96 border-t md:border-t-0 md:border-l rounded-none md:rounded-l-lg md:rounded-r-none bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 uppercase tracking-wider text-foreground/90">
          <Settings className="w-5 h-5 text-primary" />
          Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_5rem)]">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground/80 flex items-center gap-2">
                <Waypoints className="w-4 h-4 text-primary/80" />
                Algorithm
              </h3>
              <RadioGroup value={algorithm} onValueChange={(value) => onAlgorithmChange(value as Algorithm)} className="grid grid-cols-2 gap-2">
                  <Label htmlFor="wrr" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="wrr" id="wrr" className="sr-only" />
                    <span className="font-semibold">Weighted Round Robin</span>
                  </Label>
                   <Label htmlFor="ch" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="ch" id="ch" className="sr-only" />
                    <span className="font-semibold">Consistent Hashing</span>
                  </Label>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground/80">Traffic Injection</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-24"
                  value={injectionCount}
                  onChange={(e) => setInjectionCount(Math.max(1, Number(e.target.value)))}
                  min={1}
                  disabled={isAutoInjecting}
                />
                <Button className="flex-1" onClick={handleInject} disabled={isAutoInjecting}>
                  <Zap className="mr-2 h-4 w-4" />
                  Inject Traffic
                </Button>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border p-3">
                <Switch id="auto-inject" checked={isAutoInjecting} onCheckedChange={onToggleAutoInject} />
                <Label htmlFor="auto-inject" className="flex-1">Auto-Inject Traffic</Label>
              </div>
              {isAutoInjecting && (
                <div className="space-y-2 pt-2">
                  <Label>Interval: {autoInjectInterval}ms</Label>
                  <Slider 
                    min={200} 
                    max={5000} 
                    step={100}
                    value={[autoInjectInterval]} 
                    onValueChange={(value) => onIntervalChange(value[0])}
                  />
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground/80">Manage Servers</h3>
              <div className="space-y-2 p-3 border rounded-lg">
                <Label>Add New Server</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Server Name"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                  />
                  <Input 
                    type="number"
                    className="w-20"
                    placeholder="W"
                    value={newServerWeight}
                    onChange={(e) => setNewServerWeight(Number(e.target.value))}
                    min={1}
                  />
                  <Button onClick={handleAdd} size="icon" disabled={!newServerName.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                 {servers.map(server => (
                   <div key={server.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                      <span className="flex-1 truncate font-mono text-sm">{server.name}</span>
                      <Input
                        type="number"
                        className="w-20 h-8"
                        value={server.weight}
                        onChange={(e) => onWeightChange(server.id, Number(e.target.value))}
                        min={1}
                        disabled={algorithm === 'ch'}
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onServerRemove(server.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
