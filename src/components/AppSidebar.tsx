import { MessageSquarePlus, MessagesSquare, Library, Settings, Search, Trash2, MessageCircle } from "lucide-react";
import type { Conversation } from "@/pages/Index";

interface SidebarProps {
  onNewChat: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const navItems = [
  { icon: MessageSquarePlus, label: "New Chat", action: "new" },
  { icon: MessagesSquare, label: "Chat History", action: "history" },
  { icon: Library, label: "Library", action: "library" },
  { icon: Settings, label: "Settings", action: "settings" },
];

export function AppSidebar({
  onNewChat,
  conversations,
  activeConversationId,
  onLoadConversation,
  onDeleteConversation,
}: SidebarProps) {
  return (
    <aside className="w-64 h-screen flex flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      <div className="p-5">
        <h1 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
          <span className="text-primary text-xl">⬡</span> DSCE HelpDesk
        </h1>
      </div>

      {/* Search */}
      <div className="px-3 mb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-border/50 text-muted-foreground text-sm">
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search</span>
        </div>
      </div>

      <div className="px-3 mb-1">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3">Main Menu</span>
      </div>

      <nav className="px-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action === "new" ? onNewChat : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-hover hover:text-foreground transition-all duration-200"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Recent Chats */}
      {conversations.length > 0 && (
        <div className="mt-4 flex flex-col min-h-0 flex-1">
          <div className="px-3 mb-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3">
              Recent Chats
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onLoadConversation(conv.id)}
                className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200 ${
                  activeConversationId === conv.id
                    ? "bg-sidebar-hover text-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 truncate text-left">{conv.title || "Untitled"}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all duration-150"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <p className="text-[11px] text-muted-foreground">DSCE HelpDesk AI v1.0</p>
      </div>
    </aside>
  );
}
