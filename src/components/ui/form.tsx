import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { AlertCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Size variants for Form Label
const formLabelSizeVariants = cva("", {
  variants: {
    size: {
      sm: "text-xs sm:text-sm",
      default: "text-xs sm:text-sm md:text-base",
      lg: "text-sm sm:text-base md:text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// Size variants for Form Message
const formMessageSizeVariants = cva("", {
  variants: {
    size: {
      sm: "text-xs sm:text-xs",
      default: "text-xs sm:text-sm",
      lg: "text-sm sm:text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// Size variants for Form Description
const formDescriptionSizeVariants = cva("", {
  variants: {
    size: {
      sm: "text-[0.7rem] sm:text-xs",
      default: "text-[0.8rem] sm:text-xs",
      lg: "text-xs sm:text-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export interface FormMessageProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof formMessageSizeVariants> {
  showIcon?: boolean;
}

export interface FormLabelProps
  extends
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof formLabelSizeVariants> {
  isRequired?: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>(({ className, isRequired = false, size, children, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        // Base typography
        "font-semibold",
        // Apply size variant
        formLabelSizeVariants({ size }),
        // Spacing
        "mb-1.5 sm:mb-2 inline-block",
        // Colors - light mode
        "text-gray-700",
        // Error state
        error && "text-red-600",
        // Transition for smooth color changes
        "transition-colors duration-150",
        // Cursor pointer for better UX
        "cursor-pointer",
        // Disabled state
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {isRequired && (
        <span className="ml-0.5 text-red-500 font-bold" aria-label="required">
          *
        </span>
      )}
    </Label>
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

export interface FormDescriptionProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof formDescriptionSizeVariants> {}

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, size, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn(
        // Apply size variant
        formDescriptionSizeVariants({ size }),
        "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, showIcon = true, size, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? "") : children;
    const sizeValue: "sm" | "default" | "lg" =
      size === "sm" || size === "lg" ? size : "default";

    // Get icon size based on message size
    const getIconSize = () => {
      return sizeValue === "sm"
        ? "h-3 w-3 sm:h-3.5 sm:w-3.5"
        : sizeValue === "lg"
          ? "h-4 w-4 sm:h-5 sm:w-5"
          : "h-3.5 w-3.5 sm:h-4 sm:w-4";
    };

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        role="alert"
        aria-live="polite"
        className={cn(
          // Base styles
          "flex items-start gap-1.5 sm:gap-2 text-left",
          // Apply size variant
          formMessageSizeVariants({ size }),
          "font-medium",
          // Spacing
          "mt-1.5 sm:mt-2",
          // Colors
          "text-red-600",
          // Animation
          "animate-in fade-in-0 slide-in-from-top-1 duration-200",
          className,
        )}
        {...props}
      >
        {showIcon && error && (
          <AlertCircle
            className={cn(getIconSize(), "shrink-0 mt-0.5")}
            aria-hidden="true"
          />
        )}
        <span className="flex-1 leading-relaxed">{body}</span>
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
