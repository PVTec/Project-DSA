import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface HadesAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AssistantMessage[];
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export function HadesAssistant({ isOpen, onClose, messages, onSubmit, isLoading }: HadesAssistantProps) {
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to get the viewport. 
        const viewport = scrollAreaRef.current.children[1] as HTMLDivElement;
        if(viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center gap-2"><Bot />HADES Assistant</SheetTitle>
          <SheetDescription>Your guide to the HADES Protocol.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
                {messages.map(message => (
                <div key={message.id} className={cn("flex items-start gap-3", message.role === 'user' && 'justify-end')}>
                    {message.role === 'assistant' && (
                    <div className="bg-primary rounded-full p-2">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    )}
                    <div className={cn(
                        "p-3 rounded-lg max-w-sm break-words",
                        message.role === 'assistant' ? "bg-card border" : "bg-primary text-primary-foreground"
                    )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                    <div className="bg-muted rounded-full p-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    )}
                </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                         <div className="bg-primary rounded-full p-2">
                            <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="p-3 rounded-lg bg-card border">
                            <div className="flex items-center gap-2 text-sm">
                                <Loader className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    </div>
                 )}
            </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about load balancing..."
                disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
            </form>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
