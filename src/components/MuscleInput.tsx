import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useMuscleStore } from '@/store/muscleStore';
import { cn } from '@/lib/utils';

interface MuscleInputProps {
  value: string[];
  onChange: (muscles: string[]) => void;
  placeholder?: string;
}

export function MuscleInput({ value, onChange, placeholder }: MuscleInputProps) {
  const muscles = useMuscleStore((s) => s.muscles);
  const addMuscle = useMuscleStore((s) => s.addMuscle);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const trimmed = query.trim();
  const suggestions = muscles.filter(
    (m) => m.toLowerCase().includes(query.toLowerCase()) && !value.includes(m),
  );
  const showAddNew =
    trimmed.length > 1 &&
    !muscles.some((m) => m.toLowerCase() === trimmed.toLowerCase()) &&
    !value.some((m) => m.toLowerCase() === trimmed.toLowerCase());

  const selectMuscle = (muscle: string) => {
    if (!value.includes(muscle)) onChange([...value, muscle]);
    setQuery('');
    setShowSuggestions(false);
  };

  const addNew = () => {
    if (!trimmed) return;
    addMuscle(trimmed);
    selectMuscle(trimmed);
  };

  const remove = (muscle: string) => onChange(value.filter((m) => m !== muscle));

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-1 bg-primary/15 border border-primary/25 rounded-full px-3 py-1 text-xs font-medium text-primary"
            >
              {m}
              <button
                type="button"
                onClick={() => remove(m)}
                className="text-primary/60 hover:text-primary ml-0.5"
                aria-label={`Remove ${m}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + dropdown */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (showAddNew) addNew();
              else if (suggestions[0]) selectMuscle(suggestions[0]);
            }
          }}
          placeholder={placeholder || 'Search or add muscles...'}
          className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 min-h-[44px]"
        />

        {showSuggestions && (query.length > 0 || suggestions.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto bg-card border border-border rounded-xl shadow-lg z-50">
            {suggestions.map((m, i) => (
              <button
                key={m}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectMuscle(m)}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors min-h-[44px]',
                  i === 0 && 'rounded-t-xl',
                )}
              >
                {m}
              </button>
            ))}
            {showAddNew && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={addNew}
                className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-secondary transition-colors flex items-center gap-2 border-t border-border min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add "{trimmed}" as new muscle
              </button>
            )}
            {suggestions.length === 0 && !showAddNew && (
              <p className="px-4 py-3 text-xs text-muted-foreground">No matches found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
