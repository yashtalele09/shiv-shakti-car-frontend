import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex w-full h-[50px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] rounded-full bg-white">
        <input
          ref={ref}
          {...props}
          className={`w-full pl-4 text-md font-inter h-full rounded-full bg-white outline-none ${className}`}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
