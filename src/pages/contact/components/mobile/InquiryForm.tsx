import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle2,
  PartyPopper,
  Clock3,
  ArrowLeft,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquirySchema } from '../../schema/index';
import type { InquiryFormValues } from '../../schema/index';
import { useSubmitInquiry } from '../../hooks/useInquiryMutation';
import { useSendOtp, useVerifyOtp } from '../../hooks/useOtpMutation';
import useAuthStore from '../../../../store/authStore';

interface InputFieldProps {
  icon: any;
  type: string;
  placeholder: string;
  error?: string;
  registration: UseFormRegisterReturn;
  disabled?: boolean;
  rightSlot?: React.ReactNode;
}

const InputField = ({
  icon: Icon,
  type,
  placeholder,
  error,
  registration,
  disabled,
  rightSlot,
}: InputFieldProps) => {
  return (
    <div className="w-full">
      <div
        className={`flex w-full items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all focus-within:ring-2 ${
          error
            ? 'border-red-400 focus-within:ring-red-300'
            : 'border-gray-200 focus-within:ring-[#AD93DE]'
        }`}
      >
        <Icon className="text-gray-400" size={18} />
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full text-sm outline-none disabled:bg-transparent disabled:text-gray-500"
          {...registration}
        />
        {rightSlot}
      </div>
      {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const RESEND_SECONDS = 30;

/**
 * Success screen shown in place of the form once an inquiry has been submitted.
 */
const InquirySuccess = ({
  name,
  email,
  onSendAnother,
}: {
  name: string;
  email: string;
  onSendAnother: () => void;
}) => {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex w-full flex-col items-center px-2 py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: 'backOut' }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg"
      >
        <CheckCircle2 className="text-green-500" size={44} strokeWidth={1.5} />
        <motion.span
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: 'backOut' }}
          className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#AD93DE] shadow-md"
        >
          <PartyPopper className="text-white" size={16} />
        </motion.span>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="mt-5 text-xl font-bold text-white drop-shadow-md"
      >
        Thank you{name ? `, ${name.split(' ')[0]}` : ''}!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.35 }}
        className="mt-2 max-w-xs text-sm leading-relaxed text-white/95"
      >
        Your inquiry has been received. Our team will review the details and get
        back to you shortly{email ? ` at ${email}` : ''}.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="mt-5 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm"
      >
        <Clock3 size={14} className="text-[#AD93DE]" />
        Typical response time: within 24 hours
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48, duration: 0.35 }}
        type="button"
        onClick={onSendAnother}
        className="mt-6 flex items-center gap-2 rounded-full border border-white/70 bg-transparent px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
      >
        <ArrowLeft size={16} />
        Send another inquiry
      </motion.button>
    </motion.div>
  );
};

const InquiryForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  });

  const { mutate, isPending } = useSubmitInquiry();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Submission result kept separately from the form so the success screen
  // can show the submitter's name/email even after `reset()` clears the form.
  const [submitted, setSubmitted] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState({ name: '', email: '' });

  const verifiedEmailRef = useRef<string | null>(null);
  const email = watch('email');

  // If the user edits the email after verifying/sending, reset OTP state
  useEffect(() => {
    if (verifiedEmailRef.current && email !== verifiedEmailRef.current) {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp('');
      setOtpError('');
      setResendTimer(0);
      verifiedEmailRef.current = null;
    }
  }, [email]);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => {
      setResendTimer((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');

  const handleSendOtp = () => {
    if (!isValidEmail || isSendingOtp) return;
    setOtpError('');
    sendOtp(
      { email },
      {
        onSuccess: () => {
          setOtpSent(true);
          setResendTimer(RESEND_SECONDS);
        },
        onError: () => {
          setOtpError('Could not send OTP. Try again.');
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    if (otp.trim().length === 0 || isVerifyingOtp) return;
    setOtpError('');
    verifyOtp(
      { email, otp },
      {
        onSuccess: () => {
          setEmailVerified(true);
          verifiedEmailRef.current = email;
        },
        onError: () => {
          setOtpError('Invalid OTP. Please try again.');
        },
      }
    );
  };

  const onSubmit = (values: InquiryFormValues) => {
    if (!emailVerified) {
      setOtpError('Please verify your email before submitting.');
      return;
    }
    const userId = useAuthStore.getState().user?.id || '';
    mutate(
      { ...values, userId },
      {
        onSuccess: () => {
          setSubmittedInfo({
            name: values.name || '',
            email: values.email || '',
          });
          setSubmitted(true);
          reset();
          setOtpSent(false);
          setEmailVerified(false);
          setOtp('');
          setResendTimer(0);
          verifiedEmailRef.current = null;
        },
      }
    );
  };

  const handleSendAnother = () => {
    setSubmitted(false);
    setSubmittedInfo({ name: '', email: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-[-50px] w-[95%] rounded-2xl border border-gray-200 bg-gradient-to-br from-[#FFD9C9] to-[#CDC3FF] p-6 shadow-2xl"
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <InquirySuccess
            key="success-wrapper"
            name={submittedInfo.name}
            email={submittedInfo.email}
            onSendAnother={handleSendAnother}
          />
        ) : (
          <motion.div
            key="form-wrapper"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-left text-xl font-bold text-white drop-shadow-md">
              Inquiry Form
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 flex w-full flex-col gap-4"
              noValidate
            >
              <InputField
                icon={User}
                type="text"
                placeholder="Full Name"
                error={errors.name?.message}
                registration={register('name')}
              />

              <InputField
                icon={Mail}
                type="email"
                placeholder="Email Address"
                error={errors.email?.message}
                disabled={emailVerified}
                registration={register('email')}
                rightSlot={
                  emailVerified ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle2 size={16} /> Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!isValidEmail || isSendingOtp}
                      className="shrink-0 rounded-full bg-[#AD93DE] px-3 py-1 text-xs font-semibold whitespace-nowrap text-white transition-all hover:bg-[#9a7dd1] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSendingOtp ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : otpSent ? (
                        'Sent'
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  )
                }
              />

              {otpSent && !emailVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="w-full"
                >
                  <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus-within:ring-2 focus-within:ring-[#AD93DE]">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ''))
                      }
                      className="w-full text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.trim().length === 0 || isVerifyingOtp}
                      className="shrink-0 rounded-full bg-[#FF7272] px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-[#ff8c8c] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isVerifyingOtp ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>

                  <div className="mt-1 flex items-center justify-between pl-1">
                    {otpError ? (
                      <p className="text-xs text-red-500">{otpError}</p>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={resendTimer > 0 || isSendingOtp}
                      className="text-xs font-medium text-[#AD93DE] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                    >
                      {resendTimer > 0
                        ? `Resend OTP in ${resendTimer}s`
                        : 'Resend OTP'}
                    </button>
                  </div>
                </motion.div>
              )}

              <InputField
                icon={Phone}
                type="tel"
                placeholder="Phone Number"
                error={errors.phone?.message}
                registration={register('phone')}
              />

              <div>
                <div
                  className={`flex w-full gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all focus-within:ring-2 ${
                    errors.message
                      ? 'border-red-400 focus-within:ring-red-300'
                      : 'border-gray-200 focus-within:ring-[#AD93DE]'
                  }`}
                >
                  <MessageSquare className="mt-1 text-gray-400" size={18} />
                  <textarea
                    placeholder="Write your message..."
                    className="h-28 w-full resize-none text-sm outline-none"
                    {...register('message')}
                  />
                </div>
                {errors.message && (
                  <p className="mt-1 pl-1 text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="mt-2 w-full text-center">
                <button
                  type="submit"
                  disabled={isPending || !emailVerified}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#FF7272] text-lg font-semibold text-white shadow-md transition-all hover:bg-[#ff8c8c] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 md:mx-auto md:w-1/2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    'Inquire Now'
                  )}
                </button>
                {!emailVerified && (
                  <p className="mt-2 text-xs text-white/90">
                    Please verify your email to enable submission.
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InquiryForm;
