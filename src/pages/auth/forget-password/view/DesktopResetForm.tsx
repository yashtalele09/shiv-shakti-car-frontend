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

// Brand accent — matches DesktopSignUpView's palette.
const ACCENT = '#6B5BE6';
const ACCENT_DARK = '#5847C9';
const ACCENT_SOFT = 'rgba(107,91,230,0.12)';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
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
    <div className="flex flex-col gap-1.5">
      <label className="pl-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={16}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          {...registerProps}
          className="w-full rounded-xl py-2.5 pr-12 pl-10 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none"
          style={{
            background: '#FAF9FF',
            border: error ? '1.5px solid #FCA5A5' : '1.5px solid #E7E3FA',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = `1.5px solid ${ACCENT}`;
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT_SOFT}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = error
              ? '1.5px solid #FCA5A5'
              : '1.5px solid #E7E3FA';
            e.currentTarget.style.background = '#FAF9FF';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pl-1 text-xs font-medium text-red-500"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
};

const DesktopResetPasswordForm = ({
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
      className="flex flex-col gap-4"
    >
      <motion.div variants={itemVariants} className="mb-1 flex flex-col gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: ACCENT_SOFT,
            border: '1.5px solid #E7E3FA',
          }}
        >
          <ShieldCheck size={26} color={ACCENT} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Set a new password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
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

      <motion.div variants={itemVariants} className="pt-1">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full rounded-xl py-3 text-sm font-bold tracking-wide text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: isSubmitting ? '#B8AEF0' : ACCENT,
            boxShadow: `0 8px 20px -6px ${ACCENT_SOFT}`,
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.currentTarget.style.background = ACCENT_DARK;
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) e.currentTarget.style.background = ACCENT;
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
    </motion.div>
  );
};

export default DesktopResetPasswordForm;
