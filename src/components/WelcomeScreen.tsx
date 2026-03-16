import { GraduationCap, IndianRupee, Building2, BookOpen, Award, FileText } from "lucide-react";

const shortcuts = [
  { label: "KCET Admission", icon: GraduationCap },
  { label: "Fee Structure", icon: IndianRupee },
  { label: "Hostel Info", icon: Building2 },
  { label: "Courses Offered", icon: BookOpen },
  { label: "Scholarships", icon: Award },
  { label: "Required Documents", icon: FileText },
];

interface WelcomeScreenProps {
  onShortcut?: (text: string) => void;
}

export function WelcomeScreen({ onShortcut }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-center">
        What's on your mind today?
      </h2>

      <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mt-4">
        {shortcuts.map((s) => (
          <button
            key={s.label}
            onClick={() => onShortcut?.(s.label)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-muted-foreground border border-border hover:bg-sidebar-hover hover:text-foreground transition-all duration-200 cursor-pointer"
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
