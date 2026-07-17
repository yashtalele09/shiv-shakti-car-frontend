import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex h-[50px] w-full rounded-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <input
          ref={ref}
          {...props}
          className={`text-md font-inter h-full w-full rounded-full bg-white pl-4 outline-none ${className}`}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
