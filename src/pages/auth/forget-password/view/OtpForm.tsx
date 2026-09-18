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

// ─── Variants ─────────────────────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────────────────────
const OtpForm = ({
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
        {/* ── Icon + email hint ── */}
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
            <p className="text-sm leading-relaxed text-white/70">
              We sent a 6-digit code to
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <Mail size={13} className="text-white/60" />
              <span className="text-sm font-semibold text-white">{email}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Digit inputs ── */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="pl-1 text-xs font-semibold tracking-wider text-white/80 uppercase">
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
                  e.currentTarget.style.border =
                    '1.5px solid rgba(255,255,255,0.8)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.28)';
                  e.currentTarget.select();
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = digitError
                    ? '1.5px solid rgba(255,100,100,0.7)'
                    : '1.5px solid rgba(255,255,255,0.3)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                }}
                className="h-13 w-full rounded-2xl text-center text-lg font-bold text-white caret-white transition-all outline-none"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: digitError
                    ? '1.5px solid rgba(255,100,100,0.7)'
                    : '1.5px solid rgba(255,255,255,0.3)',
                  boxShadow: digit
                    ? '0 0 0 3px rgba(255,255,255,0.12)'
                    : 'inset 0 1px 3px rgba(0,0,0,0.06)',
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
              className="pl-1 text-xs font-medium text-red-300"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
            >
              {digitError.message}
            </motion.p>
          )}
        </motion.div>

        {/* ── Submit button ── */}
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
            <p className="text-sm text-white/60">
              Resend code in{' '}
              <span className="font-semibold text-white">
                {minutes}:{seconds}
              </span>
            </p>
          ) : (
            <p className="text-sm text-white/70">
              Didn't receive a code?{' '}
              <button
                type="button"
                onClick={onResend}
                disabled={resending}
                className="font-semibold text-white underline decoration-white/40 underline-offset-2 transition-all hover:decoration-white disabled:opacity-60"
              >
                {resending ? 'Sending…' : 'Resend'}
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OtpForm;
