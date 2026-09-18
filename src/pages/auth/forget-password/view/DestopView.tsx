import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import DesktopForgotPasswordForm from './DesktopForgotPasswordForm';
import DesktopOtpForm from './DesktopOtpForm';
import DesktopResetPasswordForm from './DesktopResetForm';
import LeftSideShow from '../../../../components/auth-components/LeftSideShow';

import {
  useSendResetOtp,
  useVerifyResetOtp,
  useResetPassword,
} from '../hooks/UseForgetPassword';

type Step = 'email' | 'otp' | 'reset';

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
});
type EmailFormValues = z.infer<typeof emailSchema>;

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

const stepCopy: Record<
  Step,
  { eyebrow: string; title: string; subtitle: string }
> = {
  email: {
    eyebrow: 'One more step',
    title: 'Verify Email',
    subtitle: "Enter your email and we'll send you a reset code.",
  },
  otp: {
    eyebrow: 'One more step',
    title: 'Verify OTP',
    subtitle: 'Enter the 6-digit code we sent you.',
  },
  reset: {
    eyebrow: 'One more step',
    title: 'Reset Password',
    subtitle: 'Choose a new password for your account.',
  },
};

const DesktopForgotPasswordFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');

  // ── shared flow state ──
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  // ── otp step state ──
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(120);
  const [otpError, setOtpError] = useState<string | undefined>();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // ── mutations ──
  const { mutateAsync: sendOtp, isPending: sendingOtp } = useSendResetOtp();
  const { mutateAsync: verifyOtp, isPending: verifyingOtp } =
    useVerifyResetOtp();
  const { mutateAsync: resendOtp, isPending: resending } = useSendResetOtp();
  const { mutateAsync: resetPassword, isPending: resettingPassword } =
    useResetPassword();

  // ── forms ──
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  // ── step 1: send OTP ──
  const handleSendOtp = emailForm.handleSubmit(
    async ({ email: enteredEmail }) => {
      await sendOtp({ email: enteredEmail });
      setEmail(enteredEmail);
      setDigits(Array(6).fill(''));
      setTimer(120);
      setOtpError(undefined);
      setStep('otp');
    }
  );

  // ── step 2: verify OTP ──
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!pasted) return;
    setDigits(Array.from({ length: 6 }, (_, i) => pasted[i] || ''));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otp = digits.join('');
    if (otp.length !== 6) {
      setOtpError('Enter all 6 digits');
      return;
    }
    setOtpError(undefined);
    const res = await verifyOtp({ email, otp });
    setResetToken(res.data.resetToken);
    setStep('reset');
  };

  const handleResendOtp = async () => {
    await resendOtp({ email });
    setDigits(Array(6).fill(''));
    setTimer(120);
    setOtpError(undefined);
  };

  // ── step 3: reset password ──
  const handleResetPassword = passwordForm.handleSubmit(
    async ({ newPassword }) => {
      await resetPassword({ resetToken, newPassword });
      navigate('/sign-in', { replace: true });
    }
  );

  const copy = stepCopy[step];

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
          height: 'min(700px, 92vh)',
        }}
      >
        {/* Left: brand / image carousel panel */}
        <LeftSideShow />

        {/* Right: form panel */}
        <div className="flex h-full min-h-0 flex-col justify-center overflow-y-auto px-8 py-8 lg:px-12">
          <motion.div
            key={`${step}-header`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <p className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              {copy.eyebrow}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <DesktopForgotPasswordForm
                  register={emailForm.register}
                  emailError={emailForm.formState.errors.email}
                  isSubmitting={sendingOtp}
                  onSubmit={handleSendOtp}
                />
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <DesktopOtpForm
                  email={email}
                  digits={digits}
                  inputRefs={inputRefs}
                  isSubmitting={verifyingOtp}
                  timer={timer}
                  resending={resending}
                  digitError={
                    otpError ? { type: 'manual', message: otpError } : undefined
                  }
                  onDigitChange={handleDigitChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  onSubmit={handleVerifyOtp}
                  onResend={handleResendOtp}
                />
              </motion.div>
            )}

            {step === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <DesktopResetPasswordForm
                  register={passwordForm.register}
                  passwordError={passwordForm.formState.errors.newPassword}
                  confirmError={passwordForm.formState.errors.confirmPassword}
                  isSubmitting={resettingPassword}
                  onSubmit={handleResetPassword}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DesktopForgotPasswordFlow;
