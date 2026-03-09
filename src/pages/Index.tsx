import { useState, useCallback } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessages, type Message } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";

const API_URL = "http://127.0.0.1:8000/chat";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = useCallback(async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I couldn't reach the server. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewChat = () => {
    setMessages([]);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar onNewChat={handleNewChat} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">DSCE HelpDesk AI</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">BETA</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Main area */}
        {hasMessages ? (
          <ChatMessages messages={messages} loading={loading} />
        ) : (
          <WelcomeScreen />
        )}

        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};

export default Index;
