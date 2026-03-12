import * as React from "react";
import { X, Eye, EyeOff, Calendar as CalendarIcon, Plus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const inputSizeVariants = cva("", {
  variants: {
    size: {
      sm: "h-8 text-xs sm:h-9 sm:text-sm",
      default: "h-10 text-sm sm:h-11 md:h-12 md:text-base",
      lg: "h-12 text-base sm:h-13 sm:text-lg md:h-14 md:text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const textareaSizeVariants = cva("", {
  variants: {
    size: {
      sm: "text-xs sm:text-sm",
      default: "text-sm sm:text-base md:text-base",
      lg: "text-base sm:text-lg md:text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface InputProps
  extends
    Omit<React.ComponentProps<"input">, "type" | "size">,
    VariantProps<typeof inputSizeVariants> {
  type?: React.ComponentProps<"input">["type"] | "textarea" | "tags";
  showClearButton?: boolean;
  onClear?: () => void;
  rows?: number;
  showNumberSpinners?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  // Tags-specific props
  tagsValue?: string[];
  onTagsChange?: (tags: string[]) => void;
  maxTags?: number;
  duplicateTagsAllowed?: boolean;
}

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      className,
      type,
      size,
      showClearButton = true,
      onClear,
      onClick,
      rows,
      showNumberSpinners = false,
      startAdornment,
      endAdornment,
      tagsValue,
      onTagsChange,
      maxTags,
      duplicateTagsAllowed = false,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
    const [internalTags, setInternalTags] = React.useState<string[]>([]);
    const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Determine if this is a textarea
    const isTextarea = type === "textarea";

    // Determine if this is a tags field
    const isTagsField = type === "tags";

    // Get current tags (controlled or uncontrolled)
    const currentTags = tagsValue !== undefined ? tagsValue : internalTags;

    // Merge refs
    React.useImperativeHandle(ref, () =>
      isTextarea ? textareaRef.current! : inputRef.current!,
    );

    // Determine if this is a password field
    const isPasswordField = type === "password";

    // Determine if this is a date field
    const isDateField = type === "date";

    // Determine if this is a number field
    const isNumberField = type === "number";

    // Memoize input type calculation
    // For date fields, use "text" to prevent native date picker
    // For tags fields, always use "text"
    const inputType = React.useMemo(() => {
      if (isDateField || isTagsField) return "text";
      if (!isPasswordField) return type;
      return showPassword ? "text" : "password";
    }, [isPasswordField, isDateField, isTagsField, type, showPassword]);

    // Handle input click for date fields
    const handleInputClick = React.useCallback(
      (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isDateField && !props.disabled) {
          e.preventDefault();
          setIsCalendarOpen(true);
        }
        // Call original onClick if provided
        onClick?.(e as React.MouseEvent<HTMLInputElement>);
      },
      [isDateField, props.disabled, onClick],
    );

    // Check if input has value (controlled or uncontrolled)
    const hasValue =
      props.value !== undefined
        ? String(props.value).length > 0
        : internalValue.length > 0;

    // Format date to YYYY-MM-DD for input
    const formatDateForInput = React.useCallback((date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }, []);

    // Parse date from input value
    const parseDateFromValue = React.useCallback(
      (value: string): Date | null => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      },
      [],
    );

    // Handle date selection from calendar
    const handleDateSelect = React.useCallback(
      (date: Date | null) => {
        if (!date) return;

        const formattedDate = formatDateForInput(date);

        // Update uncontrolled input
        if (props.value === undefined) {
          setInternalValue(formattedDate);
          if (inputRef.current && !isTextarea) {
            (inputRef.current as HTMLInputElement).value = formattedDate;
          }
        }

        // Trigger onChange event for controlled inputs
        if (props.onChange && inputRef.current && !isTextarea) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value",
          )?.set;

          nativeInputValueSetter?.call(inputRef.current, formattedDate);

          const event = new Event("input", { bubbles: true });
          inputRef.current.dispatchEvent(event);
        }

        setIsCalendarOpen(false);
        if (inputRef.current && !isTextarea) {
          inputRef.current.focus();
        }
      },
      [formatDateForInput, props.value, props.onChange, isTextarea],
    );

    // Get current date value for calendar
    const currentDateValue = React.useMemo(() => {
      const value =
        props.value !== undefined ? String(props.value) : internalValue;
      return parseDateFromValue(value);
    }, [props.value, internalValue, parseDateFromValue]);

    // Handle adding a tag
    const handleAddTag = React.useCallback(() => {
      const value =
        props.value !== undefined ? String(props.value) : internalValue;
      const trimmedValue = value.trim();

      if (!trimmedValue) return;

      // Check max tags limit
      if (maxTags && currentTags.length >= maxTags) return;

      // Check for duplicates if not allowed
      if (!duplicateTagsAllowed && currentTags.includes(trimmedValue)) return;

      const newTags = [...currentTags, trimmedValue];

      // Update tags (controlled or uncontrolled)
      if (tagsValue === undefined) {
        setInternalTags(newTags);
      }
      onTagsChange?.(newTags);

      // Clear input
      if (props.value === undefined) {
        setInternalValue("");
        if (inputRef.current && !isTextarea) {
          (inputRef.current as HTMLInputElement).value = "";
        }
      }

      // Trigger onChange for controlled inputs
      if (props.onChange && inputRef.current && !isTextarea) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;

        nativeInputValueSetter?.call(inputRef.current, "");

        const event = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }

      // Focus back on input
      inputRef.current?.focus();
    }, [
      props.value,
      internalValue,
      currentTags,
      maxTags,
      duplicateTagsAllowed,
      tagsValue,
      onTagsChange,
      props.onChange,
      isTextarea,
    ]);

    // Handle removing a tag
    const handleRemoveTag = React.useCallback(
      (indexToRemove: number) => {
        const newTags = currentTags.filter(
          (_, index) => index !== indexToRemove,
        );

        // Update tags (controlled or uncontrolled)
        if (tagsValue === undefined) {
          setInternalTags(newTags);
        }
        onTagsChange?.(newTags);

        // Focus back on input
        inputRef.current?.focus();
      },
      [currentTags, tagsValue, onTagsChange],
    );

    // Handle key press for tags field
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isTagsField && e.key === "Enter") {
          e.preventDefault();
          handleAddTag();
        }
        // Call original onKeyDown if provided
        props.onKeyDown?.(e as React.KeyboardEvent<HTMLInputElement>);
      },
      [isTagsField, handleAddTag, props.onKeyDown],
    );

    // Calculate which buttons to show
    // Textarea doesn't support password toggle or calendar
    // Tags field shows add button instead of clear
    const showClear =
      showClearButton && hasValue && !props.disabled && !isTagsField;
    const showToggle =
      isPasswordField && !props.disabled && !isTextarea && !isTagsField;
    const showCalendar =
      isDateField && !props.disabled && !isTextarea && !isTagsField;
    // Add tag button is always visible for tags field, but disabled when conditions aren't met
    const showAddTag = isTagsField && !props.disabled;
    const isAddTagDisabled =
      !hasValue || (maxTags ? currentTags.length >= maxTags : false);

    // Count visible buttons (exclude add tag button as it's outside the input)
    const buttonCount = [showClear, showToggle, showCalendar].filter(
      Boolean,
    ).length;

    // Get button size based on input size
    const getButtonSize = () => {
      const sizeValue: "sm" | "default" | "lg" =
        size === "sm" || size === "lg" ? size : "default";
      return sizeValue === "sm"
        ? "h-6 w-6 sm:h-7 sm:w-7"
        : sizeValue === "lg"
          ? "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
          : "h-7 w-7 sm:h-8 sm:w-8";
    };

    // Get icon size based on input size
    const getIconSize = () => {
      const sizeValue: "sm" | "default" | "lg" =
        size === "sm" || size === "lg" ? size : "default";
      return sizeValue === "sm"
        ? "h-3.5 w-3.5 sm:h-4 sm:w-4"
        : sizeValue === "lg"
          ? "h-5 w-5 sm:h-6 sm:w-6"
          : "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]";
    };

    // Get button container positioning based on input size
    const getButtonContainerPosition = () => {
      const sizeValue: "sm" | "default" | "lg" =
        size === "sm" || size === "lg" ? size : "default";
      return sizeValue === "sm"
        ? "right-2 sm:right-2.5"
        : sizeValue === "lg"
          ? "right-2.5 sm:right-3 md:right-4"
          : "right-2 sm:right-3";
    };

    // Get button container gap based on input size
    const getButtonContainerGap = () => {
      const sizeValue: "sm" | "default" | "lg" =
        size === "sm" || size === "lg" ? size : "default";
      return sizeValue === "sm"
        ? "gap-0.5 sm:gap-1"
        : sizeValue === "lg"
          ? "gap-1 sm:gap-1.5 md:gap-2"
          : "gap-0.5 sm:gap-1";
    };

    // Get add button size for text button (not icon button)
    const getAddButtonSize = () => {
      const sizeValue: "sm" | "default" | "lg" =
        size === "sm" || size === "lg" ? size : "default";
      return sizeValue === "sm"
        ? "h-8 px-2 py-1.5 text-xs sm:h-9 sm:px-3 sm:text-sm"
        : sizeValue === "lg"
          ? "h-12 px-4 py-3 text-base sm:h-13 sm:px-6 sm:text-lg md:h-14 md:px-8 md:text-lg"
          : "h-10 px-3 py-2 text-sm sm:h-11 sm:px-4 sm:text-base md:h-12 md:px-5 md:text-base";
    };

    const handleClear = React.useCallback(() => {
      // Call custom onClear if provided
      if (onClear) {
        onClear();
      }

      const currentRef = isTextarea ? textareaRef.current : inputRef.current;

      // Clear uncontrolled input
      if (props.value === undefined) {
        setInternalValue("");
        if (currentRef) {
          if (isTextarea) {
            (currentRef as HTMLTextAreaElement).value = "";
          } else {
            (currentRef as HTMLInputElement).value = "";
          }
        }
      }

      // Clear tags if it's a tags field
      if (isTagsField && currentTags.length > 0) {
        if (tagsValue === undefined) {
          setInternalTags([]);
        }
        onTagsChange?.([]);
      }

      // Trigger onChange event for controlled inputs
      if (props.onChange && currentRef) {
        if (isTextarea) {
          const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value",
          )?.set;

          nativeTextareaValueSetter?.call(currentRef, "");

          const event = new Event("input", { bubbles: true });
          currentRef.dispatchEvent(event);
        } else {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value",
          )?.set;

          nativeInputValueSetter?.call(currentRef, "");

          const event = new Event("input", { bubbles: true });
          currentRef.dispatchEvent(event);
        }
      }

      // Focus back on input/textarea
      currentRef?.focus();
    }, [
      onClear,
      props.value,
      props.onChange,
      isTextarea,
      isTagsField,
      currentTags.length,
      tagsValue,
      onTagsChange,
    ]);

    const handleTogglePassword = React.useCallback(() => {
      setShowPassword((prev) => !prev);
      // Keep focus on input after toggle without setTimeout
      requestAnimationFrame(() => {
        if (inputRef.current && !isTextarea) {
          const input = inputRef.current as HTMLInputElement;
          const cursorPosition = input.selectionStart || 0;
          input.focus();
          // Restore cursor position
          input.setSelectionRange(cursorPosition, cursorPosition);
        }
      });
    }, [isTextarea]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (props.value === undefined) {
          setInternalValue(e.target.value);
        }
        props.onChange?.(e as React.ChangeEvent<HTMLInputElement>);
      },
      [props.value, props.onChange],
    );

    // Shared className for both input and textarea
    const sharedClassName = cn(
      // Base styles
      "flex w-full rounded-lg border transition-all duration-200",
      // Semantic colors via theme tokens
      "border-input bg-[hsl(var(--field))] text-foreground",
      "placeholder:text-muted-foreground",
      // Focus states (matching button focus-visible ring-offset)
      "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:ring-offset-2 focus:outline-none",
      // Hover states
      "hover:border-input/80",
      // Disabled states (matching button disabled styles)
      "disabled:cursor-not-allowed disabled:pointer-events-none",
      "disabled:bg-[hsl(var(--field-disabled))] disabled:text-muted-foreground disabled:placeholder:text-muted-foreground",
      "disabled:border-muted disabled:opacity-60",
      className,
    );

    // Calculate padding adjustments for adornments
    const hasStartAdornment = !!startAdornment;
    const hasEndAdornment = !!endAdornment;

    // Calculate right padding: buttons + endAdornment
    const totalRightPadding = buttonCount > 0 || hasEndAdornment;

    // Calculate dynamic padding based on size
    const getDynamicPadding = () => {
      const sizeValue: "sm" | "default" | "lg" =
        size === "sm" || size === "lg" ? size : "default";

      // Base padding values for each size (matching button sizes)
      const basePadding = {
        sm: {
          left: "pl-3",
          leftSm: "sm:pl-4",
          leftAdornment: "pl-10",
          leftAdornmentSm: "sm:pl-11",
          right: "pr-3",
          rightSm: "sm:pr-4",
        },
        default: {
          left: "pl-4",
          leftSm: "sm:pl-5",
          leftMd: "md:pl-6",
          leftAdornment: "pl-10",
          leftAdornmentSm: "sm:pl-11",
          leftAdornmentMd: "md:pl-12",
          right: "pr-4",
          rightSm: "sm:pr-5",
          rightMd: "md:pr-6",
        },
        lg: {
          left: "pl-6",
          leftSm: "sm:pl-8",
          leftMd: "md:pl-10",
          leftAdornment: "pl-12",
          leftAdornmentSm: "sm:pl-14",
          leftAdornmentMd: "md:pl-16",
          right: "pr-6",
          rightSm: "sm:pr-8",
          rightMd: "md:pr-10",
        },
      };

      const padding = basePadding[sizeValue];

      // Dynamic right padding based on buttons and endAdornment
      let rightPadding:
        | string
        | { type: "dynamic"; base: number; sm: number; md?: number } = "";

      if (!totalRightPadding) {
        rightPadding = `${padding.right} ${padding.rightSm}${
          "rightMd" in padding && padding.rightMd ? ` ${padding.rightMd}` : ""
        }`;
      } else {
        // Calculate padding based on button count and size
        // Button container positioning varies by input size
        // Button sizes vary by input size
        // For tags field with add button: buttonCount = 1
        const calculatePadding = (count: number, hasAdornment: boolean) => {
          // Button sizes by input size
          const buttonSizes = {
            sm: { base: 1.5, sm: 1.75 }, // w-6 sm:w-7
            default: { base: 1.75, sm: 2 }, // w-7 sm:w-8
            lg: { base: 2, sm: 2.25, md: 2.5 }, // w-8 sm:w-9 md:w-10
          };

          const sizes = buttonSizes[sizeValue];

          // Container offset based on input size: sm: right-2 (0.5rem) sm:right-2.5 (0.625rem)
          // default: right-2 (0.5rem) sm:right-3 (0.75rem)
          // lg: right-2.5 (0.625rem) sm:right-3 (0.75rem) md:right-4 (1rem)
          const containerOffset =
            sizeValue === "sm"
              ? { base: 0.5, sm: 0.625 } // right-2 sm:right-2.5
              : sizeValue === "lg"
                ? { base: 0.625, sm: 0.75, md: 1 } // right-2.5 sm:right-3 md:right-4
                : { base: 0.5, sm: 0.75 }; // right-2 sm:right-3

          // Gap size based on input size: sm: gap-0.5 (0.125rem) sm:gap-1 (0.25rem)
          // default: gap-0.5 (0.125rem) sm:gap-1 (0.25rem)
          // lg: gap-1 (0.25rem) sm:gap-1.5 (0.375rem) md:gap-2 (0.5rem)
          const gapSize =
            sizeValue === "sm"
              ? { base: 0.125, sm: 0.25 } // gap-0.5 sm:gap-1
              : sizeValue === "lg"
                ? { base: 0.25, sm: 0.375, md: 0.5 } // gap-1 sm:gap-1.5 md:gap-2
                : { base: 0.125, sm: 0.25 }; // gap-0.5 sm:gap-1

          // Calculate total width: container offset + button width(s) + gap(s) + adornment
          const gapCount = count > 1 ? count - 1 : 0;
          const totalBase =
            containerOffset.base +
            count * sizes.base +
            gapCount * gapSize.base +
            (hasAdornment ? sizes.base : 0);
          const totalSm =
            containerOffset.sm +
            count * sizes.sm +
            gapCount * gapSize.sm +
            (hasAdornment ? sizes.sm : 0);
          const totalMd =
            "md" in sizes &&
            sizes.md &&
            "md" in containerOffset &&
            containerOffset.md
              ? containerOffset.md +
                count * sizes.md +
                gapCount *
                  ("md" in gapSize && gapSize.md ? gapSize.md : gapSize.sm) +
                (hasAdornment ? sizes.md : 0)
              : undefined;

          return {
            base: totalBase,
            sm: totalSm,
            md: totalMd,
          };
        };

        if (buttonCount === 0 && hasEndAdornment) {
          rightPadding =
            sizeValue === "sm"
              ? "pr-10 sm:pr-11"
              : sizeValue === "lg"
                ? "pr-12 sm:pr-14 md:pr-16"
                : "pr-10 sm:pr-11 md:pr-12";
        } else if (buttonCount === 1 && !hasEndAdornment) {
          const calc = calculatePadding(1, false);
          rightPadding = {
            type: "dynamic",
            base: calc.base,
            sm: calc.sm,
            md: calc.md,
          };
        } else if (buttonCount === 1 && hasEndAdornment) {
          const calc = calculatePadding(1, true);
          rightPadding = {
            type: "dynamic",
            base: calc.base,
            sm: calc.sm,
            md: calc.md,
          };
        } else if (buttonCount === 2 && !hasEndAdornment) {
          const calc = calculatePadding(2, false);
          rightPadding = {
            type: "dynamic",
            base: calc.base,
            sm: calc.sm,
            md: calc.md,
          };
        } else if (buttonCount === 2 && hasEndAdornment) {
          const calc = calculatePadding(2, true);
          rightPadding = {
            type: "dynamic",
            base: calc.base,
            sm: calc.sm,
            md: calc.md,
          };
        } else if (buttonCount === 3 && !hasEndAdornment) {
          const calc = calculatePadding(3, false);
          rightPadding = {
            type: "dynamic",
            base: calc.base,
            sm: calc.sm,
            md: calc.md,
          };
        } else if (buttonCount === 3 && hasEndAdornment) {
          const calc = calculatePadding(3, true);
          rightPadding = {
            type: "dynamic",
            base: calc.base,
            sm: calc.sm,
            md: calc.md,
          };
        } else if (buttonCount === 4 && !hasEndAdornment) {
          const calc = calculatePadding(4, false);
          rightPadding = {
            type: "dynamic",
            base: calc.base,
            sm: calc.sm,
            md: calc.md,
          };
        } else if (buttonCount === 4 && hasEndAdornment) {
          const calc = calculatePadding(4, true);
          rightPadding = {
            type: "dynamic",
            base: calc.base,
            sm: calc.sm,
            md: calc.md,
          };
        }
      }

      return {
        left: hasStartAdornment
          ? `${padding.leftAdornment} ${padding.leftAdornmentSm}${
              "leftAdornmentMd" in padding && padding.leftAdornmentMd
                ? ` ${padding.leftAdornmentMd}`
                : ""
            }`
          : `${padding.left} ${padding.leftSm}${
              "leftMd" in padding && padding.leftMd ? ` ${padding.leftMd}` : ""
            }`,
        right: rightPadding,
      };
    };

    const dynamicPadding = React.useMemo(
      () => getDynamicPadding(),
      [size, hasStartAdornment, hasEndAdornment, buttonCount],
    );

    // Calculate dynamic right padding style with responsive support
    const [rightPaddingStyle, setRightPaddingStyle] = React.useState<
      React.CSSProperties | undefined
    >(undefined);

    React.useEffect(() => {
      if (typeof dynamicPadding.right === "string") {
        setRightPaddingStyle(undefined);
        return;
      }
      if (
        dynamicPadding.right &&
        typeof dynamicPadding.right === "object" &&
        "type" in dynamicPadding.right &&
        dynamicPadding.right.type === "dynamic"
      ) {
        const dynamicPaddingRight = dynamicPadding.right as {
          type: "dynamic";
          base: number;
          sm: number;
          md?: number;
        };
        const updatePadding = () => {
          const width = window.innerWidth;
          let paddingValue: number;

          if (dynamicPaddingRight.md !== undefined && width >= 768) {
            paddingValue = dynamicPaddingRight.md;
          } else if (width >= 640) {
            paddingValue = dynamicPaddingRight.sm;
          } else {
            paddingValue = dynamicPaddingRight.base;
          }

          setRightPaddingStyle({
            paddingRight: `${paddingValue}rem`,
          });
        };

        updatePadding();
        window.addEventListener("resize", updatePadding);
        return () => window.removeEventListener("resize", updatePadding);
      } else {
        setRightPaddingStyle(undefined);
      }
    }, [dynamicPadding.right]);

    // Input-specific className
    const inputClassName = cn(
      sharedClassName,
      // Apply size variant (includes height, base padding, and text size)
      inputSizeVariants({ size }),
      // Override padding with dynamic values based on adornments and buttons
      dynamicPadding.left,
      // Only apply right padding class if it's a string (static Tailwind class)
      typeof dynamicPadding.right === "string" ? dynamicPadding.right : "",
      // Date field cursor
      isDateField && "cursor-pointer",
      // Number input spinner styles - hide by default
      isNumberField &&
        !showNumberSpinners && [
          "[&::-webkit-inner-spin-button]:hidden",
          "[&::-webkit-outer-spin-button]:hidden",
        ],
      // File input styling
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "file:text-foreground",
      "file:mr-4 file:py-1",
    );

    // Calculate dynamic padding for textarea based on size
    const getTextareaDynamicPadding = () => {
      const sizeValue: "sm" | "default" | "lg" =
        size === "sm" || size === "lg" ? size : "default";

      // Base padding values for each size (matching button sizes)
      const basePadding = {
        sm: {
          left: "pl-3",
          leftSm: "sm:pl-4",
          leftAdornment: "pl-10",
          leftAdornmentSm: "sm:pl-11",
          right: "pr-3",
          rightSm: "sm:pr-4",
          vertical: "py-1.5",
          verticalSm: "sm:py-2",
        },
        default: {
          left: "pl-4",
          leftSm: "sm:pl-5",
          leftMd: "md:pl-6",
          leftAdornment: "pl-10",
          leftAdornmentSm: "sm:pl-11",
          leftAdornmentMd: "md:pl-12",
          right: "pr-4",
          rightSm: "sm:pr-5",
          rightMd: "md:pr-6",
          vertical: "py-2",
          verticalSm: "sm:py-3",
          verticalMd: "md:py-3",
        },
        lg: {
          left: "pl-6",
          leftSm: "sm:pl-8",
          leftMd: "md:pl-10",
          leftAdornment: "pl-12",
          leftAdornmentSm: "sm:pl-14",
          leftAdornmentMd: "md:pl-16",
          right: "pr-6",
          rightSm: "sm:pr-8",
          rightMd: "md:pr-10",
          vertical: "py-3",
          verticalSm: "sm:py-4",
          verticalMd: "md:py-4",
        },
      };

      const padding = basePadding[sizeValue];

      // Dynamic right padding based on buttons and endAdornment
      let rightPadding = "";

      if (!totalRightPadding) {
        rightPadding = `${padding.right} ${padding.rightSm}${
          "rightMd" in padding && padding.rightMd ? ` ${padding.rightMd}` : ""
        }`;
      } else {
        if (buttonCount === 0 && hasEndAdornment) {
          rightPadding =
            sizeValue === "sm"
              ? "pr-10 sm:pr-11"
              : sizeValue === "lg"
                ? "pr-12 sm:pr-14 md:pr-16"
                : "pr-10 sm:pr-11 md:pr-12";
        } else if (buttonCount === 1 && !hasEndAdornment) {
          rightPadding =
            sizeValue === "sm"
              ? "pr-10 sm:pr-11"
              : sizeValue === "lg"
                ? "pr-12 sm:pr-14 md:pr-16"
                : "pr-10 sm:pr-11 md:pr-12";
        } else if (buttonCount === 1 && hasEndAdornment) {
          rightPadding =
            sizeValue === "sm"
              ? "pr-[4.25rem] sm:pr-[4.75rem]"
              : sizeValue === "lg"
                ? "pr-[5.5rem] sm:pr-[6rem] md:pr-28"
                : "pr-[4.25rem] sm:pr-[4.75rem] md:pr-20";
        }
      }

      return {
        left: hasStartAdornment
          ? `${padding.leftAdornment} ${padding.leftAdornmentSm}${
              "leftAdornmentMd" in padding && padding.leftAdornmentMd
                ? ` ${padding.leftAdornmentMd}`
                : ""
            }`
          : `${padding.left} ${padding.leftSm}${
              "leftMd" in padding && padding.leftMd ? ` ${padding.leftMd}` : ""
            }`,
        right: rightPadding,
        vertical: `${padding.vertical} ${padding.verticalSm}${
          "verticalMd" in padding && padding.verticalMd
            ? ` ${padding.verticalMd}`
            : ""
        }`,
      };
    };

    const textareaDynamicPadding = getTextareaDynamicPadding();

    // Textarea-specific className
    const textareaClassName = cn(
      sharedClassName,
      // Apply size variant (includes text size)
      textareaSizeVariants({ size }),
      // Apply dynamic padding based on adornments and buttons
      textareaDynamicPadding.vertical,
      textareaDynamicPadding.left,
      textareaDynamicPadding.right,
      // Minimum height and resize
      "min-h-[100px] sm:min-h-[120px]",
      "resize-y",
      // Remove default textarea styling
      "overflow-auto",
      // Smooth scrolling for better UX
      "scroll-smooth",
    );

    return (
      <div className="w-full">
        {/* Tags Display - Show above input */}
        {isTagsField && currentTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {currentTags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 border border-cyan-200 hover:bg-cyan-200 transition-colors duration-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-1 hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/40 rounded"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Input wrapper with add button outside for tags field */}
        <div
          className={cn(
            "relative",
            isTagsField ? "flex items-center gap-3 sm:gap-4 flex-1" : "w-full",
          )}
        >
          {/* Start Adornment */}
          {hasStartAdornment && (
            <div
              className={cn(
                "absolute left-2 sm:left-3 flex items-center",
                isTextarea ? "top-2 sm:top-3" : "top-1/2 -translate-y-1/2",
                "pointer-events-none z-10",
              )}
            >
              {startAdornment}
            </div>
          )}

          {isTextarea ? (
            <textarea
              className={textareaClassName}
              ref={textareaRef}
              onChange={handleChange}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              rows={rows || 4}
              {...(props as React.ComponentProps<"textarea">)}
            />
          ) : (
            <input
              type={inputType}
              readOnly={isDateField}
              className={inputClassName}
              ref={inputRef as React.Ref<HTMLInputElement>}
              onChange={handleChange}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              style={{
                ...(isNumberField && !showNumberSpinners
                  ? {
                      MozAppearance: "textfield" as const,
                      WebkitAppearance: "textfield" as const,
                    }
                  : {}),
                ...rightPaddingStyle,
              }}
              {...props}
            />
          )}

          {/* End Adornment - positioned before buttons */}
          {hasEndAdornment && (
            <div
              className={cn(
                "absolute flex items-center",
                isTextarea ? "top-2 sm:top-3" : "top-1/2 -translate-y-1/2",
                "pointer-events-none z-10",
              )}
              style={{
                // Calculate position: button container right (0.5rem) + button widths + gaps
                // Button size: 1.75rem (h-7 w-7) on mobile, 2rem (h-8 w-8) on larger screens
                // Gap: 0.125rem (gap-0.5) on mobile, 0.25rem (gap-1) on larger screens
                right:
                  buttonCount > 0
                    ? `calc(0.5rem + ${buttonCount * 1.75}rem + ${
                        (buttonCount - 1) * 0.125
                      }rem)`
                    : "0.5rem",
              }}
            >
              {endAdornment}
            </div>
          )}

          {/* Calendar Dialog - Wrapped outside button container */}
          {showCalendar &&
            (() => {
              // Extract min and max from props and convert to Date objects
              const minDateString = (props as any).min;
              const maxDateString = (props as any).max;
              const minDate = minDateString
                ? new Date(minDateString)
                : undefined;
              const maxDate = maxDateString
                ? new Date(maxDateString)
                : undefined;

              return (
                <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <DialogContent className="w-auto p-0 max-w-fit">
                    <Calendar
                      selectedDate={currentDateValue}
                      onDateSelect={handleDateSelect}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                  </DialogContent>
                </Dialog>
              );
            })()}

          {(showToggle || showClear || showCalendar) && (
            <div
              className={cn(
                "absolute flex items-center",
                getButtonContainerPosition(),
                getButtonContainerGap(),
                isTextarea ? "top-2 sm:top-3" : "top-1/2 -translate-y-1/2",
              )}
            >
              {/* Calendar Button - Show first (leftmost position) for date fields */}
              {showCalendar && (
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(true)}
                  tabIndex={-1}
                  className={cn(
                    // Sizing - responsive with proper touch targets based on input size
                    getButtonSize(),
                    // Styling
                    "flex items-center justify-center rounded-md",
                    "text-gray-500 hover:text-gray-700",
                    "hover:bg-gray-100",
                    "transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40",
                    // Active state for better feedback
                    "active:scale-95",
                    // Smooth entrance animation
                    "animate-in fade-in-0 zoom-in-95 duration-150",
                  )}
                  aria-label="Open calendar"
                >
                  <CalendarIcon className={getIconSize()} />
                </button>
              )}

              {/* Password Toggle Button - Show second (middle position) */}
              {showToggle && (
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  tabIndex={-1}
                  className={cn(
                    // Sizing - responsive with proper touch targets based on input size
                    getButtonSize(),
                    // Styling
                    "flex items-center justify-center rounded-md",
                    "text-gray-500 hover:text-gray-700",
                    "hover:bg-gray-100",
                    "transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40",
                    // Active state for better feedback
                    "active:scale-95",
                    // Smooth entrance animation
                    "animate-in fade-in-0 zoom-in-95 duration-150",
                  )}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className={getIconSize()} />
                  ) : (
                    <Eye className={getIconSize()} />
                  )}
                </button>
              )}

              {/* Clear Button - Show third (rightmost position) */}
              {showClear && (
                <button
                  type="button"
                  onClick={handleClear}
                  tabIndex={-1}
                  className={cn(
                    // Sizing - responsive with proper touch targets based on input size
                    getButtonSize(),
                    // Styling
                    "flex items-center justify-center rounded-md",
                    "text-gray-500 hover:text-gray-700",
                    "hover:bg-gray-100",
                    "transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40",
                    // Active state for better feedback
                    "active:scale-95",
                    // Smooth entrance animation
                    "animate-in fade-in-0 zoom-in-95 duration-150",
                  )}
                  aria-label="Clear input"
                >
                  <X className={getIconSize()} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add Tag Button - Show outside input for tags field */}
        {showAddTag && (
          <button
            type="button"
            onClick={handleAddTag}
            disabled={isAddTagDisabled}
            className={cn(
              // Sizing - responsive button size matching input size (text button, not icon)
              getAddButtonSize(),
              // Styling
              "flex items-center justify-center gap-1 sm:gap-1.5 rounded-md mt-0.5 sm:mt-1",
              "transition-all duration-150",
              "flex-shrink-0",
              // Typography
              "font-medium",
              // Enabled state
              !isAddTagDisabled && [
                "text-cyan-600 hover:text-cyan-700",
                "bg-cyan-50 hover:bg-cyan-100",
                "border border-cyan-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40",
                "active:scale-95",
                "cursor-pointer",
              ],
              // Disabled state
              isAddTagDisabled && [
                "text-gray-400",
                "bg-gray-100",
                "border border-gray-200",
                "cursor-not-allowed",
                "opacity-60",
              ],
              // Smooth entrance animation
              "animate-in fade-in-0 zoom-in-95 duration-150",
            )}
            aria-label="Add tag"
            aria-disabled={isAddTagDisabled}
          >
            <Plus className={getIconSize()} />
            <span>Add</span>
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
