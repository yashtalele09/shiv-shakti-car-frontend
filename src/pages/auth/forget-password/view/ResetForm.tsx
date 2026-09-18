import { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import type { UseFormRegister, FieldError } from 'react-hook-form';

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  register: UseFormRegister<ResetPasswordFormValues>;
  passwordError?: FieldError;
  confirmError?: FieldError;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  registerProps: ReturnType<UseFormRegister<ResetPasswordFormValues>>;
  error?: FieldError;
}

const PasswordField = ({
  label,
  placeholder,
  registerProps,
  error,
}: PasswordFieldProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="pl-1 text-xs font-semibold tracking-wider text-white/80 uppercase">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={16}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/50"
        />
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          {...registerProps}
          onFocus={(e) => {
            e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.8)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.28)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = error
              ? '1.5px solid rgba(255,100,100,0.7)'
              : '1.5px solid rgba(255,255,255,0.3)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
          }}
          className="h-13 w-full rounded-2xl py-3.5 pr-11 pl-11 text-sm font-medium text-white placeholder-white/40 caret-white transition-all outline-none"
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: error
              ? '1.5px solid rgba(255,100,100,0.7)'
              : '1.5px solid rgba(255,255,255,0.3)',
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white/80"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pl-1 text-xs font-medium text-red-300"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
};

const ResetPasswordForm = ({
  register,
  passwordError,
  confirmError,
  isSubmitting,
  onSubmit,
}: ResetPasswordFormProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 mx-4 mt-8 overflow-hidden rounded-3xl"
      style={{
        background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.45)',
        boxShadow:
          '0 8px 40px rgba(180,140,255,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}
    >
      <div className="flex flex-col gap-6 px-6 py-8">
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-3 pt-1"
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: '1.5px solid rgba(255,255,255,0.45)',
              boxShadow: '0 4px 16px rgba(180,140,255,0.2)',
            }}
          >
            <ShieldCheck size={26} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-white">
              Set a new password
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/70">
              Choose a strong password you haven't used before
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <PasswordField
            label="New password"
            placeholder="••••••••"
            registerProps={register('newPassword')}
            error={passwordError}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PasswordField
            label="Confirm password"
            placeholder="••••••••"
            registerProps={register('confirmPassword')}
            error={confirmError}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: isSubmitting
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(255,255,255,0.9)',
              color: '#6B5BE6',
              boxShadow:
                '0 4px 20px rgba(255,255,255,0.25), 0 1px 0 rgba(255,255,255,0.8) inset',
              letterSpacing: '0.5px',
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Resetting…
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResetPasswordForm;
