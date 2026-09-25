import { useState, useEffect } from "react";
import { CheckItem } from "./CheckItem";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Item {
  id: string;
  label: string;
  checked: boolean;
  isExtra?: boolean;
}

interface SectionCardProps {
  title: string;
  emoji: string;
  items: Item[];
  onToggle: (id: string, checked: boolean, isExtra?: boolean) => void;
  onAddExtra: () => void;
  onSetFocus: (label: string) => void;
  focusedLabel?: string | null;
}

export function SectionCard({ title, emoji, items, onToggle, onAddExtra, onSetFocus, focusedLabel }: SectionCardProps) {
  const checkedCount = items.filter(i => i.checked).length;
  const isComplete = items.length > 0 && checkedCount === items.length;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => setCollapsed(true), 600);
      return () => clearTimeout(t);
    } else {
      setCollapsed(false);
    }
  }, [isComplete]);

  return (
    <section className={`py-6 border-b border-line last:border-b-0 transition-opacity duration-700 ${isComplete ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
      <header 
        className="flex items-center justify-between mb-4 cursor-pointer group select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-baseline gap-3">
          <div className="text-muted group-hover:text-ink transition-colors">
             {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          <h2 className="font-serif text-2xl text-ink">{title}</h2>
          <span className="text-muted text-sm" aria-hidden="true">{emoji}</span>
        </div>
        <div className="text-muted text-sm font-sans">
          {checkedCount}/{items.length}
        </div>
      </header>
      
      {!collapsed && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-300">
          {items.length === 0 ? (
            <p className="text-muted text-sm italic mb-4">Nothing logged yet</p>
          ) : (
            <div className="flex flex-col mb-4">
              {items.map(item => (
                <CheckItem 
                  key={item.id} 
                  id={item.id}
                  checked={item.checked} 
                  label={item.label}
                  isExtra={item.isExtra}
                  onToggle={(checked) => onToggle(item.id, checked, item.isExtra)}
                  onFocusClick={() => onSetFocus(item.label)}
                  isFocused={focusedLabel === item.label}
                />
              ))}
            </div>
          )}
          
          <button 
            onClick={onAddExtra}
            className="text-sm text-muted hover:text-ink transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-1 -ml-1"
          >
            + add task
          </button>
        </div>
      )}
    </section>
  );
}
