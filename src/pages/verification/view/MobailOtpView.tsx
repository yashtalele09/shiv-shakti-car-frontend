import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { ROUTES } from '../../../constants/routes';
import OtpForm from '../components/OtpForm';
import { OtpSchema } from '../schema';
import type { OtpFormData } from '../types';
import { useVerifyOtpMutation } from '../hooks/useVerifyOtpMutation';
import { useResendOtpMutation } from '../hooks/useResendOtpMutation';

// ─── Constants ────────────────────────────────────────────────────────────────
const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

// ─── Parent Component ─────────────────────────────────────────────────────────
const MobileOtpView = () => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden pb-12"
      style={{
        background:
          'linear-gradient(145deg, #FFD9C9 0%, #E8C4FF 50%, #CDC3FF 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute top-[-80px] right-[-60px] h-[220px] w-[220px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FF9A7B, transparent)' }}
      />
      <div
        className="pointer-events-none absolute bottom-[80px] left-[-80px] h-[200px] w-[200px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative z-10 px-6 pt-8 pb-2"
      >
        <p className="mb-1 text-sm font-medium tracking-widest text-white/70 uppercase">
          One more step
        </p>
        <h1
          className="text-4xl font-bold text-white"
          style={{
            fontFamily: "'Gravitas One', serif",
            textShadow: '0 2px 16px rgba(0,0,0,0.12)',
            letterSpacing: '-0.5px',
          }}
        >
          Verify Email
        </h1>
      </motion.div>

      {/* ── OtpForm child ── */}
      <OtpForm
        email={email}
        digits={digits}
        inputRefs={inputRefs}
        isSubmitting={isSubmitting}
        timer={timer}
        resending={resending}
        digitError={errors.otp}
        onDigitChange={handleDigitChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onSubmit={onSubmit}
        onResend={handleResend}
      />
    </motion.div>
  );
};

export default MobileOtpView;
