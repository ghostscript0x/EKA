"use client";
import { Pin } from "lucide-react";

interface CheckItemProps {
  id: string;
  checked: boolean;
  label: string;
  onToggle: (checked: boolean) => void;
  isExtra?: boolean;
  onFocusClick?: () => void;
  isFocused?: boolean;
}

export function CheckItem({ checked, label, onToggle, isExtra, onFocusClick, isFocused }: CheckItemProps) {
  return (
    <div className={`flex items-start gap-3 py-2 group transition-opacity duration-500 ${checked ? 'opacity-50' : 'opacity-100'}`}>
      <label className="flex items-start gap-3 cursor-pointer flex-1">
        <div className="relative flex items-center justify-center mt-0.5">
          <input 
            type="checkbox" 
            className="peer sr-only" 
            checked={checked}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <div className="w-5 h-5 border border-muted rounded-sm bg-transparent 
                          peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg
                          peer-checked:bg-accent peer-checked:border-accent transition-colors duration-300">
            {checked && (
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-bg absolute inset-0 m-auto check-draw" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        <span className={`text-base leading-snug transition-colors duration-500 ${checked ? 'text-muted line-through decoration-line' : 'text-ink'}`}>
          {label}
          {isExtra && <span className="ml-2 text-xs text-muted font-serif italic">(extra)</span>}
        </span>
      </label>
      
      {onFocusClick && (
        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); onFocusClick(); }}
          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-gold ${isFocused ? 'opacity-100 text-gold' : 'text-muted'}`}
          title="Set as Focus"
        >
          <Pin className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
