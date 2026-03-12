import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Size variants for Select Trigger
const selectTriggerSizeVariants = cva("", {
  variants: {
    size: {
      sm: "h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm",
      default: "h-10 px-4 text-sm sm:h-11 sm:px-5 md:h-12 md:px-6 md:text-base",
      lg: "h-12 px-6 text-base sm:h-13 sm:px-8 md:h-14 md:px-10 md:text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// Size variants for Select Item
const selectItemSizeVariants = cva("", {
  variants: {
    size: {
      sm: "px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm",
      default: "px-2 py-1.5 text-sm sm:px-3 sm:py-2 sm:text-base",
      lg: "px-3 py-2 text-base sm:px-4 sm:py-2.5 sm:text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// Select Context
interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  name?: string;
  onBlur?: () => void;
  size?: "sm" | "default" | "lg";
  containerRef?: React.RefObject<HTMLDivElement | null>;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(
  undefined,
);

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select provider");
  }
  return context;
};

// Main Select Component
interface SelectProps extends VariantProps<typeof selectTriggerSizeVariants> {
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  defaultValue?: string;
  name?: string;
  onBlur?: () => void;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value,
      onValueChange,
      onChange,
      children,
      disabled = false,
      defaultValue,
      name,
      onBlur,
      size,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || value || "",
    );
    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const hiddenInputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => containerRef.current!);

    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        // Call onValueChange if provided (for direct usage)
        onValueChange?.(newValue);
        // Call onChange if provided (for react-hook-form compatibility)
        // React-hook-form's onChange can accept either:
        // 1. An event object: onChange(event) where event.target.value is used
        // 2. A value directly: onChange(value) - preferred for custom components
        if (onChange) {
          // Create a proper event-like object for react-hook-form
          const syntheticEvent = {
            target: {
              value: newValue,
              name: name || "",
            },
            currentTarget: {
              value: newValue,
              name: name || "",
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
        // Trigger native change event from hidden input that bubbles to form
        // This ensures the form's onChange handler (like form.handleSubmit) is triggered
        // The event must originate from a form child element to trigger form's onChange
        if (hiddenInputRef.current) {
          const input = hiddenInputRef.current;
          // Update the value - this will trigger a native change event
          // We need to use the native setter to ensure the browser recognizes the change
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value",
          )?.set;

          if (nativeInputValueSetter) {
            // Use native setter to update value (triggers browser's change detection)
            nativeInputValueSetter.call(input, newValue);
            // Dispatch the change event that will bubble to the form
            const changeEvent = new Event("change", {
              bubbles: true,
              cancelable: true,
            });
            input.dispatchEvent(changeEvent);
          } else {
            // Fallback: just set value and dispatch event
            input.value = newValue;
            const changeEvent = new Event("change", {
              bubbles: true,
              cancelable: true,
            });
            input.dispatchEvent(changeEvent);
          }
        }
        setOpen(false);
      },
      [value, onValueChange, onChange, name],
    );

    return (
      <SelectContext.Provider
        value={{
          value: currentValue,
          onValueChange: handleValueChange,
          open,
          setOpen,
          disabled,
          name,
          onBlur,
          size: size ?? undefined,
          containerRef,
          triggerRef,
        }}
      >
        <div ref={containerRef} className="relative w-full">
          {/* Hidden input to trigger native change events for form onChange handlers */}
          {/* Using text type (visually hidden) instead of hidden type ensures events bubble properly */}
          <input
            ref={hiddenInputRef}
            type="text"
            name={name}
            value={currentValue}
            readOnly
            style={{
              position: "absolute",
              opacity: 0,
              pointerEvents: "none",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: 0,
              border: "none",
              overflow: "hidden",
            }}
            aria-hidden="true"
            tabIndex={-1}
          />
          {children}
        </div>
      </SelectContext.Provider>
    );
  },
);
Select.displayName = "Select";

// Select Trigger Component
interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  placeholder?: string;
  showClearButton?: boolean;
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(
  (
    { children, className, placeholder = "Select...", showClearButton = false },
    ref,
  ) => {
    const {
      value,
      open,
      setOpen,
      disabled,
      onValueChange,
      onBlur,
      triggerRef,
      size,
    } = useSelectContext();
    const localTriggerRef = React.useRef<HTMLButtonElement>(null);

    // Update context ref and merge with forwarded ref
    React.useEffect(() => {
      if (triggerRef && localTriggerRef.current) {
        (
          triggerRef as React.MutableRefObject<HTMLButtonElement | null>
        ).current = localTriggerRef.current;
      }
    }, [triggerRef]);

    React.useImperativeHandle(ref, () => localTriggerRef.current!);

    const hasValue = value && value.length > 0;
    const showClear = showClearButton && hasValue && !disabled;
    const sizeValue: "sm" | "default" | "lg" =
      size === "sm" || size === "lg" ? size : "default";

    // Calculate dynamic right padding based on size and clear button
    const getRightPadding = () => {
      if (showClear) {
        return sizeValue === "sm"
          ? "pr-14 sm:pr-16"
          : sizeValue === "lg"
            ? "pr-20 sm:pr-24 md:pr-28"
            : "pr-16 sm:pr-[4.5rem] md:pr-20";
      }
      return sizeValue === "sm"
        ? "pr-10 sm:pr-11"
        : sizeValue === "lg"
          ? "pr-12 sm:pr-14 md:pr-16"
          : "pr-10 sm:pr-11 md:pr-12";
    };

    // Get icon size based on select size
    const getIconSize = () => {
      return sizeValue === "sm"
        ? "h-3.5 w-3.5 sm:h-4 sm:w-4"
        : sizeValue === "lg"
          ? "h-5 w-5 sm:h-6 sm:w-6"
          : "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]";
    };

    // Get button size for clear button
    const getButtonSize = () => {
      return sizeValue === "sm"
        ? "h-6 w-6 sm:h-7 sm:w-7"
        : sizeValue === "lg"
          ? "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
          : "h-7 w-7 sm:h-8 sm:w-8";
    };

    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onValueChange("");
        triggerRef?.current?.focus();
      },
      [onValueChange, triggerRef],
    );

    const handleClick = React.useCallback(() => {
      if (!disabled) {
        setOpen(!open);
      }
    }, [disabled, open, setOpen]);

    const handleBlur = React.useCallback(() => {
      // Call onBlur when the select loses focus
      if (onBlur && !open) {
        onBlur();
      }
    }, [onBlur, open]);

    return (
      <button
        ref={localTriggerRef}
        type="button"
        onClick={handleClick}
        onBlur={handleBlur}
        disabled={disabled}
        className={cn(
          // Base styles
          "flex w-full items-center justify-between rounded-lg border transition-all duration-200",
          // Apply size variant (includes height, padding, and text size)
          selectTriggerSizeVariants({ size }),
          // Dynamic right padding based on buttons shown
          getRightPadding(),
          // Text alignment
          "text-left",
          // Semantic colors via theme tokens
          "border-input bg-[hsl(var(--field))] text-foreground",
          // Focus states
          "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none",
          // Hover states
          "hover:border-input/80",
          // Open state
          open && "border-cyan-500 ring-2 ring-cyan-500/20",
          // Disabled states
          "disabled:cursor-not-allowed",
          "disabled:bg-[hsl(var(--field-disabled))] disabled:text-muted-foreground",
          "disabled:border-muted disabled:opacity-60",
          className,
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span
          className={cn("block truncate", !hasValue && "text-muted-foreground")}
        >
          {children || value || placeholder}
        </span>

        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 sm:gap-1">
          {/* Clear Button */}
          {showClear && (
            <div
              onClick={handleClear}
              className={cn(
                getButtonSize(),
                "flex items-center justify-center rounded-md",
                "text-gray-500 hover:text-gray-700",
                "hover:bg-gray-100",
                "transition-all duration-150",
                "active:scale-95",
                "animate-in fade-in-0 zoom-in-95 duration-150",
              )}
              aria-label="Clear selection"
            >
              <X className={getIconSize()} />
            </div>
          )}

          {/* Chevron Icon */}
          <ChevronDown
            className={cn(
              getIconSize(),
              "text-gray-500",
              "transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </div>
      </button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

// Select Content Component
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
  position?: "popper" | "item-aligned";
}

export const SelectContent = ({
  children,
  className,
}: // position = "popper",
SelectContentProps) => {
  const { open, setOpen, triggerRef } = useSelectContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Don't close if clicking inside the content
      if (contentRef.current?.contains(target)) {
        return;
      }

      // Don't close if clicking on the trigger button (let the trigger's onClick handle the toggle)
      if (triggerRef?.current?.contains(target)) {
        return;
      }

      // Close if clicking outside both content and trigger
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen, triggerRef]);

  // Close on escape key
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        // Base styles
        "absolute z-50 w-full mt-1 rounded-lg border shadow-lg",
        // Responsive max height and overflow
        "max-h-[200px] sm:max-h-[250px] md:max-h-[300px] overflow-y-auto",
        // Colors
        "bg-white",
        "border-gray-200",
        // Animation
        "animate-in fade-in-0 zoom-in-95 duration-150",
        // Custom scrollbar
        "scrollbar-thin scrollbar-thumb-gray-300",
        "scrollbar-track-transparent",
        className,
      )}
      role="listbox"
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

// Select Item Component
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const SelectItem = ({
  value: itemValue,
  children,
  disabled = false,
  className,
}: SelectItemProps) => {
  const { value, onValueChange, size } = useSelectContext();
  const isSelected = value === itemValue;
  const sizeValue: "sm" | "default" | "lg" =
    size === "sm" || size === "lg" ? size : "default";

  // Get icon size based on select size
  const getIconSize = () => {
    return sizeValue === "sm"
      ? "h-3.5 w-3.5 sm:h-4 sm:w-4"
      : sizeValue === "lg"
        ? "h-5 w-5 sm:h-6 sm:w-6"
        : "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]";
  };

  const handleClick = () => {
    if (!disabled) {
      onValueChange(itemValue);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        // Base styles
        "relative flex items-center justify-between cursor-pointer rounded-md",
        // Apply size variant (includes padding and text size)
        selectItemSizeVariants({ size }),
        // Colors and states
        "text-foreground",
        "hover:bg-gray-100",
        "focus:bg-gray-100",
        "transition-colors duration-150",
        // Selected state
        isSelected && "bg-cyan-50",
        isSelected && "text-cyan-700",
        // Disabled state
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
    >
      <span className="flex-1 truncate">{children}</span>
      {isSelected && (
        <Check
          className={cn(getIconSize(), "flex-shrink-0 ml-2 text-cyan-600")}
        />
      )}
    </div>
  );
};
