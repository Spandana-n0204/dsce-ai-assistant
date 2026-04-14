import { useState, useCallback, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessages, type Message } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";

const API_BASE = "http://127.0.0.1:8000";
const DEVICE_ID = (() => {
  let id = localStorage.getItem("dsce_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("dsce_device_id", id);
  }
  return id;
})();

export interface Conversation {
  id:         string;
  title:      string;
  created_at?: string;
}

interface StoredMessage {
  role:    string;
  content: string;
}

const Index = () => {
  const [messages,      setMessages]      = useState<Message[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations?device_id=${DEVICE_ID}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSend = useCallback(async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question:        text,
          conversation_id: conversationId,
          device_id:       DEVICE_ID,
        }),
      });
      const data = await res.json();
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
      fetchConversations();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I couldn't reach the server. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [conversationId, fetchConversations]);

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const handleLoadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        const loaded: Message[] = data.map((m: StoredMessage) => ({
          role:    m.role === "user" ? "user" : "ai",
          content: m.content || "",
        }));
        setMessages(loaded);
        setConversationId(id);
      }
    } catch {
      // silently fail
    }
  }, []);

  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      await fetch(`${API_BASE}/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setMessages([]);
        setConversationId(null);
      }
    } catch {
      // silently fail
    }
  }, [conversationId]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        onNewChat={handleNewChat}
        conversations={conversations}
        activeConversationId={conversationId}
        onLoadConversation={handleLoadConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col min-w-0 dark:grid-bg grid-bg-light">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border/50">
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
          <WelcomeScreen onShortcut={handleSend} />
        )}

        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};

export default Index;
