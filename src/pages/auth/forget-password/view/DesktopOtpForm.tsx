import { Mail, ShieldCheck } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import type { KeyboardEvent, ClipboardEvent, RefObject } from 'react';
import type { FieldError } from 'react-hook-form';

// ─── Props ────────────────────────────────────────────────────────────────────
interface OtpFormProps {
  email: string;
  digits: string[];
  inputRefs: RefObject<Array<HTMLInputElement | null>>;
  isSubmitting: boolean;
  timer: number;
  resending: boolean;
  digitError?: FieldError;
  onDigitChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onResend: () => void;
}

// Brand accent — matches DesktopSignUpView's palette.
const ACCENT = '#6B5BE6';
const ACCENT_DARK = '#5847C9';
const ACCENT_SOFT = 'rgba(107,91,230,0.12)';

// ─── Variants ─────────────────────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────────────────────
const DesktopOtpForm = ({
  email,
  digits,
  inputRefs,
  isSubmitting,
  timer,
  resending,
  digitError,
  onDigitChange,
  onKeyDown,
  onPaste,
  onSubmit,
  onResend,
}: OtpFormProps) => {
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      {/* ── Icon + email hint ── */}
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
          <p className="text-sm text-slate-500">We sent a 6-digit code to</p>
          <div className="mt-1 flex items-center gap-1.5">
            <Mail size={13} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-900">
              {email}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Digit inputs ── */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <label className="pl-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Enter code
        </label>
        <div className="flex justify-between gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                if (inputRefs.current) inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => onDigitChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={onPaste}
              onFocus={(e) => {
                e.currentTarget.style.border = `1.5px solid ${ACCENT}`;
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT_SOFT}`;
                e.currentTarget.select();
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = digitError
                  ? '1.5px solid #FCA5A5'
                  : '1.5px solid #E7E3FA';
                e.currentTarget.style.background = '#FAF9FF';
                e.currentTarget.style.boxShadow = 'none';
              }}
              className="w-full rounded-xl text-center text-lg font-bold text-slate-900 transition-all outline-none"
              style={{
                background: '#FAF9FF',
                border: digitError
                  ? '1.5px solid #FCA5A5'
                  : '1.5px solid #E7E3FA',
                aspectRatio: '1 / 1.15',
              }}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {digitError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="pl-1 text-xs font-medium text-red-500"
          >
            {digitError.message}
          </motion.p>
        )}
      </motion.div>

      {/* ── Submit button ── */}
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
              Verifying…
            </span>
          ) : (
            'Verify Email'
          )}
        </button>
      </motion.div>

      {/* ── Resend ── */}
      <motion.div variants={itemVariants} className="text-center">
        {timer > 0 ? (
          <p className="text-sm text-slate-500">
            Resend code in{' '}
            <span className="font-semibold text-slate-900">
              {minutes}:{seconds}
            </span>
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Didn't receive a code?{' '}
            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="font-semibold underline underline-offset-2 transition-all disabled:opacity-60"
              style={{
                color: ACCENT,
                textDecorationColor: 'rgba(107,91,230,0.3)',
              }}
            >
              {resending ? 'Sending…' : 'Resend'}
            </button>
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DesktopOtpForm;
