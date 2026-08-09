import * as React from 'react';
import { cn, debounce } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input, type InputProps } from '@/components/ui/input';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

interface DebouncedInputProps extends Omit<InputProps, 'onChange'> {
  containerClassName?: string;
  value: string;
  open: boolean;
  onChange: (value: string) => Promise<void>;
  onChangeStatusOpen: (value: boolean) => void;
  debounceTimeout?: number;
  maxLength?: number;
}

export function DebouncedInput({
  id = 'query',
  containerClassName,
  open,
  value,
  onChange,
  maxLength = 80,
  debounceTimeout = 300,
  onChangeStatusOpen,
  className,
  ...props
}: DebouncedInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // close search input on clicking outside,
  useOnClickOutside(inputRef, () => {
    if (!value) onChangeStatusOpen(false);
  });

  // configure keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // close search input on pressing escape
      if (e.key === 'Escape') {
        void onChange('');
      }
      // open search input on pressing ctrl + k or cmd + k
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (!inputRef.current) return;
        e.preventDefault();
        onChangeStatusOpen(true);
        inputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const debounceInput = React.useCallback(
    debounce((value) => {
      const strValue = value as string;
      void onChange(strValue);
    }, debounceTimeout),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounceInput(event.target.value);
  };

  const clearValue = () => {
    if (inputRef.current) inputRef.current.value = '';
    void onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative', containerClassName)}>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder="Search movies, series..."
        className={cn(
          'border-white/15 h-11 rounded-full bg-background/80 py-2 pl-10 pr-10 text-base shadow-sm outline-none transition-all duration-300 placeholder:text-muted-foreground focus-visible:ring-orange-400',
          open
            ? 'w-[min(58vw,22rem)] border sm:w-72 lg:w-96'
            : 'w-0 border-none bg-transparent p-0',
          className,
        )}
        defaultValue={value}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      <Button
        id="search-btn"
        aria-label="Search"
        variant="ghost"
        className={cn(
          'min-h-10 min-w-10 absolute top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-orange-500/10 focus-visible:ring-orange-400',
          open ? 'left-0' : 'left-0',
        )}
        onClick={() => {
          if (!inputRef.current) {
            return;
          }
          inputRef.current.focus();
          onChangeStatusOpen(!open);
        }}>
        <Icons.search
          className={cn(
            'transition-opacity hover:opacity-75 active:scale-95',
            open ? 'h-5 w-5' : 'h-6 w-6',
          )}
          aria-hidden="true"
        />
      </Button>
      {open && value ? (
        <Button
          type="button"
          variant="ghost"
          aria-label="Clear search"
          className="min-h-10 min-w-10 absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-orange-500/10 focus-visible:ring-orange-400"
          onClick={clearValue}>
          <Icons.close className="h-5 w-5" aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}
