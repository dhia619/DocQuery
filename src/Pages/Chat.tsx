import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarFooter, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SendHorizontalIcon, BotIcon } from "lucide-react";
import { useState, useEffect, useRef, FormEvent } from "react";
import axios from "axios";
import { Navbar } from "@/components/NavBar/NavBar";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-message',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault();

    const trimmedMessage = currentMessage.trim();
    if (!trimmedMessage) return;

    const userMessage: Message = {
      id: generateId(),
      text: trimmedMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    inputRef.current?.focus();

    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        message: trimmedMessage,
      }, {
        timeout: 10000,
      });

      const botMessage: Message = {
        id: generateId(),
        text: response.data.reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      toast({
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
    <SidebarProvider className="w-full min-h-screen flex bg-background text-foreground">
      <AppSidebar collapsible="icon" variant="floating" className="bg-background text-forground"/>

      <SidebarInset className="bg-background text-foreground">
        <header className="flex h-14 shrink-0 items-center gap-2 ">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 py-10">
          <div 
            className="mx-auto h-[calc(100vh-250px)] w-full max-w-3xl 
            rounded-xl bg-accent overflow-y-auto flex flex-col-reverse"
          >
            {messages.length > 0 ? (
              <div className="space-y-3 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.sender === "user"
                        ? "justify-end" 
                        : "justify-start"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <BotIcon className="w-6 h-6 mt-2"/>
                    )}
                    <div
                      className={`p-3 rounded-lg max-w-[75%] ${
                        message.sender === "user"
                          ? "bg-primary" 
                          : "bg-card"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-foreground mt-10">
                Start a conversation
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start mb-3 p-2">
                <div className="w-1/2 h-10 bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form 
            onSubmit={sendMessage} 
            className="bg-background w-1/2 flex flex-row items-center justify-center self-center"
          >
            <input
              ref={inputRef}
              type="text"
              className="bg-background text-forground w-full p-2 rounded-l-lg border border-gray-300 
              outline-none "
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              type="submit" 
              variant="outline" 
              size="icon" 
              disabled={!currentMessage.trim()}
              className="h-10 w-12 bg-primary"
            >
              <SendHorizontalIcon />
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </>
  );
};

export default Chat;