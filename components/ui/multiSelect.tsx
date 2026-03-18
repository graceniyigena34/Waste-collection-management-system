import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from './badge';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full min-h-14 h-auto justify-between text-left font-normal bg-muted/30 border-border hover:border-primary hover:bg-muted/50 transition-all",
            !selected.length && "text-muted-foreground"
          )}
        >
          <div className="flex flex-wrap gap-1.5 flex-1 py-1">
            {selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selected.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border-0 px-2.5 py-1"
                >
                  {item}
                  <button
                    className="ml-1.5 hover:text-destructive transition-colors"
                    onClick={(e) => handleRemove(item, e)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <ChevronDown className={cn(
            "ml-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-12" />
          <CommandList>
            <CommandEmpty>No sector found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto p-1">
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className={cn(
                      "py-3 px-3 cursor-pointer rounded-lg transition-colors",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    <div
                      className={cn(
                        "mr-3 flex h-5 w-5 items-center justify-center rounded border-2 transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className={cn(isSelected && "font-medium text-primary")}>
                      {option}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
