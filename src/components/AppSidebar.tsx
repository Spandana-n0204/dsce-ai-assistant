import { MessageSquarePlus, MessagesSquare, Library, Settings } from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
}

const navItems = [
  { icon: MessageSquarePlus, label: "New Chat", action: "new" },
  { icon: MessagesSquare, label: "Chat History", action: "history" },
  { icon: Library, label: "Library", action: "library" },
  { icon: Settings, label: "Settings", action: "settings" },
];

export function AppSidebar({ onNewChat }: SidebarProps) {
  return (
    <aside className="w-64 h-screen flex flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      <div className="p-5">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          <span className="text-primary">⬡</span> DSCE HelpDesk
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action === "new" ? onNewChat : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-hover hover:text-foreground transition-all duration-200"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground">DSCE HelpDesk AI v1.0</p>
      </div>
    </aside>
  );
}
