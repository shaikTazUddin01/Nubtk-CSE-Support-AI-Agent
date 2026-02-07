import { Palette, PenLine, GraduationCap, Sparkles } from "lucide-react";

interface QuickChipsProps {
  onChipClick: (message: string) => void;
}

const chips = [
  { icon: Palette, label: "Create image", prompt: "Help me create an image" },
  { icon: PenLine, label: "Write anything", prompt: "Help me write something" },
  { icon: GraduationCap, label: "Help me learn", prompt: "I want to learn something new" },
  { icon: Sparkles, label: "Boost my day", prompt: "Give me some motivation and ideas to boost my day" },
];

const QuickChips = ({ onChipClick }: QuickChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onChipClick(chip.prompt)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-chip hover:bg-chip-hover border border-border text-sm text-foreground transition-all duration-200 hover:scale-[1.02]"
        >
          <chip.icon className="w-4 h-4" />
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickChips;
