
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ServerNode, Algorithm } from "@/lib/types";
import { WeightedRoundRobin } from "@/lib/wrr";
import { ConsistentHashing } from "@/lib/ch";
import { HadesSidebar } from "@/components/hades-sidebar";
import { ServerArena } from "@/components/server-arena";
import { SettingsPanel } from "@/components/settings-panel";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { HadesAssistant, AssistantMessage } from "@/components/hades-assistant";
import { hadesAssistant } from "@/ai/flows/hades-flow";

const INITIAL_SERVERS: Omit<ServerNode, "currentLoad" | "capacity" | "status" | "id">[] = [
  { name: "Titan", weight: 5 },
  { name: "Scout A", weight: 1 },
  { name: "Scout B", weight: 1 },
];

const capacityUnit = 10;
const releaseTime = 2000; // ms

export default function Home() {
  const { toast } = useToast();
  const [servers, setServers] = useState<ServerNode[]>(() =>
    INITIAL_SERVERS.map(s => ({
      ...s,
      id: uuidv4(),
      currentLoad: 0,
      capacity: s.weight * capacityUnit,
      status: 'online',
    }))
  );

  const [logs, setLogs] = useState<string[]>([]);
  const [userCounter, setUserCounter] = useState(0);
  const [isAutoInjecting, setIsAutoInjecting] = useState(false);
  const [autoInjectInterval, setAutoInjectInterval] = useState(2000);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>('wrr');
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Connection established. Greetings, Operator. The IcieNet simulation is active. Awaiting your command."
    }
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  
  const wrrRef = useRef(new WeightedRoundRobin(servers.filter(s => s.status === 'online')));
  const chRef = useRef(new ConsistentHashing(servers.filter(s => s.status === 'online')));


  useEffect(() => {
    const onlineServers = servers.filter(s => s.status === 'online');
    wrrRef.current = new WeightedRoundRobin(onlineServers);
    chRef.current = new ConsistentHashing(onlineServers);
  }, [servers]);

  const releaseLoad = useCallback((serverId: string) => {
    setServers(prevServers =>
      prevServers.map(s =>
        s.id === serverId
          ? { ...s, currentLoad: Math.max(0, s.currentLoad - 1) }
          : s
      )
    );
  }, []);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs.slice(0, 99)]);
  }, []);

  const handleInjectTraffic = useCallback((count: number = 1) => {
    try {
      for (let i = 0; i < count; i++) {
        const nextUser = userCounter + i + 1;
        const userKey = `user-${nextUser}`;

        let targetServer: { id: string; name: string } | null = null;

        if (algorithm === 'wrr') {
            targetServer = wrrRef.current.getNextServer();
        } else { // 'ch'
            targetServer = chRef.current.getNextServer(userKey);
        }
        
        if (!targetServer) {
            throw new Error("No online servers available.");
        }

        setServers(prevServers =>
          prevServers.map(s =>
            s.id === targetServer!.id
              ? { ...s, currentLoad: Math.min(s.currentLoad + 1, s.capacity) }
              : s
          )
        );
        
        addLog(`User #${nextUser} assigned to Node ${targetServer.name}.`);
        
        setTimeout(() => releaseLoad(targetServer!.id), releaseTime);
      }
      setUserCounter(prev => prev + count);

    } catch (error) {
        if (error instanceof Error) {
            addLog(`Error: ${error.message}`);
            setIsAutoInjecting(false); // Stop auto-injection on error
        }
    }
  }, [userCounter, addLog, releaseLoad, algorithm]);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAutoInjecting) {
      intervalId = setInterval(() => handleInjectTraffic(1), autoInjectInterval);
    }
    return () => clearInterval(intervalId);
  }, [isAutoInjecting, autoInjectInterval, handleInjectTraffic]);

  const handleServerAdd = (server: Omit<ServerNode, 'id' | 'currentLoad' | 'capacity' | 'status'>) => {
    setServers(prev => [...prev, {
      ...server,
      id: uuidv4(),
      currentLoad: 0,
      capacity: server.weight * capacityUnit,
      status: 'online'
    }]);
    addLog(`Control: New server "${server.name}" added with weight ${server.weight}.`);
  };

  const handleServerRemove = (id: string) => {
    const serverToRemove = servers.find(s => s.id === id);
    setServers(prev => prev.filter(s => s.id !== id));
    if (serverToRemove) {
      addLog(`Control: Server "${serverToRemove.name}" removed.`);
    }
  };

  const handleWeightChange = (id: string, weight: number) => {
    setServers(prev => prev.map(s => 
      s.id === id ? { ...s, weight, capacity: weight * capacityUnit } : s
    ));
    const server = servers.find(s => s.id === id);
    if(server) {
      addLog(`Control: Updated ${server.name} weight to ${weight}.`)
    }
  };

  const handleAssistantSubmit = async (input: string) => {
    const userMessage: AssistantMessage = { id: uuidv4(), role: 'user', content: input };
    setAssistantMessages(prev => [...prev, userMessage]);
    setIsAssistantLoading(true);

    try {
      const simulationState = {
        servers,
        logs: logs.slice(0, 10), // only send recent logs
        isAutoInjecting,
        autoInjectInterval,
        algorithm,
      };

      const result = await hadesAssistant({
        prompt: input,
        history: assistantMessages.map(m => ({ role: m.role, content: m.content })),
        simulationState,
      });
      
      const assistantResponse: AssistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: result.response,
      };
      setAssistantMessages(prev => [...prev, assistantResponse]);

    } catch (error) {
      console.error("Error calling Hades Assistant:", error);
       let errorMessage = "System Error. My core processing is experiencing a communication fault. Check console for details.";
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('503') || msg.includes('overloaded')) {
          errorMessage = "🛑 Service Overload. My connection to the core AI is currently unstable. The service is reporting high traffic. Please wait a moment and try your request again.";
        } else if (msg.includes('429') || msg.includes('quota')) {
          errorMessage = "🛑 Quota Exceeded. The request limit to my core AI has been reached. Please check your plan and billing details, or try again later.";
        }
      }
      const errorResponse: AssistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: errorMessage,
      };
      setAssistantMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsAssistantLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      <HadesSidebar logs={logs} onToggleAssistant={() => setIsAssistantOpen(p => !p)} />
      <main className="flex-1 flex flex-col">
        <div className="p-4 md:p-6 border-b border-border/50">
          <h1 className="text-xl font-bold tracking-wider uppercase text-foreground/90">Active Nodes Overview</h1>
        </div>
        <div className="flex-1 flex flex-col md:flex-row">
            <ServerArena
              servers={servers}
            />
          <SettingsPanel
            onInjectTraffic={handleInjectTraffic}
            isAutoInjecting={isAutoInjecting}
            onToggleAutoInject={() => setIsAutoInjecting(p => !p)}
            autoInjectInterval={autoInjectInterval}
            onIntervalChange={setAutoInjectInterval}
            onServerAdd={handleServerAdd}
            onServerRemove={handleServerRemove}
            onWeightChange={handleWeightChange}
            servers={servers}
            algorithm={algorithm}
            onAlgorithmChange={setAlgorithm}
          />
        </div>
      </main>
      <HadesAssistant 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        messages={assistantMessages}
        onSubmit={handleAssistantSubmit}
        isLoading={isAssistantLoading}
      />
    </div>
  );
}
