import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { ROUTES } from '../../../constants/routes';
import { OtpSchema } from '../schema';
import type { OtpFormData } from '../types';
import { useVerifyOtpMutation } from '../hooks/useVerifyOtpMutation';
import { useResendOtpMutation } from '../hooks/useResendOtpMutation';
import LeftSideShow from '../../../components/auth-components/LeftSideShow';

// Brand accent — matches DesktopSignUpView so the two screens read as one flow.
const ACCENT = '#6B5BE6';

// ─── Constants ────────────────────────────────────────────────────────────────
const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

// ─── Parent Component ─────────────────────────────────────────────────────────
const DesktopOtpView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email: string = location.state?.email ?? 'your email';

  // ── State ──────────────────────────────────────────────────────────────────
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array.from({ length: OTP_LENGTH }, () => null)
  );

  // ── Countdown ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── RHF ───────────────────────────────────────────────────────────────────
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: '' },
  });

  const syncValue = (newDigits: string[]) => {
    setValue('otp', newDigits.join(''), { shouldValidate: true });
  };

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: verifyOtp, isPending: isSubmitting } = useVerifyOtpMutation({
    onSuccess: () => {
      toast.success('Email verified successfully!');
      navigate(ROUTES.AUTH.SIGN_IN);
    },
    onError: (error) => {
      toast.error(error.message || 'Invalid code. Please try again.');
    },
  });

  const { mutate: resendOtp, isPending: resending } = useResendOtpMutation({
    onSuccess: () => {
      toast.success('A new code has been sent.');
      setDigits(Array(OTP_LENGTH).fill(''));
      setValue('otp', '');
      setTimer(RESEND_SECONDS);
      inputRefs.current[0]?.focus();
    },
    onError: (error) => {
      toast.error(error.message || 'Could not resend. Try again.');
    },
  });

  // ── Handlers (passed as props to OtpForm) ─────────────────────────────────
  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = sanitized;
    setDigits(next);
    syncValue(next);
    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
        syncValue(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    syncValue(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const onSubmit = handleSubmit((data: OtpFormData) => {
    verifyOtp({ data: { email, otp: data.otp } });
  });

  const handleResend = () => {
    if (timer > 0 || resending) return;
    resendOtp({ data: { email } });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative hidden h-screen w-full items-center justify-center overflow-hidden p-5 md:flex lg:p-8"
      style={{
        background:
          'linear-gradient(145deg, #FFD9C9 0%, #E8C4FF 50%, #CDC3FF 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute top-[-140px] right-[-120px] h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FF9A7B, transparent)' }}
      />
      <div
        className="pointer-events-none absolute bottom-[-100px] left-[-140px] h-[380px] w-[380px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }}
      />

      {/* Card — capped height so it always fits the viewport, never forces a scroll */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white md:grid-cols-2 lg:max-w-6xl"
        style={{
          boxShadow:
            '0 30px 80px -20px rgba(107,91,230,0.4), 0 10px 30px -10px rgba(0,0,0,0.12)',
          height: 'min(680px, 90vh)',
        }}
      >
        {/* Left: brand / image carousel panel — identical to DesktopSignUpView for continuity */}
        <LeftSideShow />

        {/* Right: OTP form panel */}
        <div className="flex h-full min-h-0 flex-col items-center justify-center px-8 py-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-5 w-full max-w-sm text-center"
          >
            <div
              className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(107,91,230,0.1)' }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16v16H4z" />
                <path d="m4 6 8 7 8-7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Verify Email</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the code we sent to{' '}
              <span className="font-medium text-slate-700">{email}</span>
            </p>
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="w-full max-w-sm"
          >
            {/* Digit boxes */}
            <div className="flex justify-center gap-2.5">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-14 w-12 rounded-xl text-center text-lg font-semibold text-slate-900 transition-all outline-none"
                  style={{
                    background: '#FAF9FF',
                    border: errors.otp
                      ? '1.5px solid #FCA5A5'
                      : '1.5px solid #E7E3FA',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = `1.5px solid ${ACCENT}`;
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}1F`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = errors.otp
                      ? '1.5px solid #FCA5A5'
                      : '1.5px solid #E7E3FA';
                    e.currentTarget.style.background = '#FAF9FF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="mt-3 text-center text-xs font-medium text-red-500">
                {errors.otp.message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl py-3 text-sm font-bold tracking-wide text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: isSubmitting ? '#B8AEF0' : ACCENT,
                boxShadow: `0 8px 20px -6px rgba(107,91,230,0.35)`,
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.background = '#5847C9';
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

            {/* Resend */}
            <p className="mt-5 text-center text-sm text-slate-500">
              Didn't get the code?{' '}
              {timer > 0 ? (
                <span className="font-medium text-slate-400">
                  Resend in {timer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="font-semibold underline underline-offset-2 disabled:opacity-60"
                  style={{
                    color: ACCENT,
                    textDecorationColor: 'rgba(107,91,230,0.3)',
                  }}
                >
                  {resending ? 'Sending…' : 'Resend code'}
                </button>
              )}
            </p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default DesktopOtpView;
