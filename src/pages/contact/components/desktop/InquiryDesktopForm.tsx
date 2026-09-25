import { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle2,
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
        className={`flex w-full items-center gap-3 border-b bg-transparent py-3 transition-colors ${
          error
            ? 'border-red-400'
            : 'border-[#E4E1D9] focus-within:border-[#C1502E]'
        }`}
      >
        <Icon className="text-[#8A8578]" size={17} />
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent text-sm text-[#1B2333] outline-none placeholder:text-[#9C978A] disabled:text-[#9C978A] md:text-[15px]"
          {...registration}
        />
        {rightSlot}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const RESEND_SECONDS = 30;

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
  const userId = useAuthStore.getState().user?.id || '';

  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const verifiedEmailRef = useRef<string | null>(null);
  const email = watch('email');

  // Reset OTP state if the email is edited after sending/verifying
  useEffect(() => {
    if (verifiedEmailRef.current && email !== verifiedEmailRef.current) {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp('');
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
    sendOtp(
      { email },
      {
        onSuccess: () => {
          setOtpSent(true);
          setResendTimer(RESEND_SECONDS);
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    if (otp.trim().length === 0 || isVerifyingOtp) return;
    verifyOtp(
      { email, otp },
      {
        onSuccess: (response) => {
          if (response.verified) {
            setEmailVerified(true);
            verifiedEmailRef.current = email;
          }
        },
      }
    );
  };

  const onSubmit = (values: InquiryFormValues) => {
    if (!emailVerified) return;
    mutate(
      { ...values, userId },
      {
        onSuccess: () => {
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

  return (
    <div className="w-full rounded-2xl border border-[#E4E1D9] bg-[#FAF9F6] p-7 md:p-9">
      <p className="text-lg font-bold text-[#1B2333] md:text-xl">
        Send an inquiry
      </p>
      <p className="mt-1 text-sm text-[#6B6759]">
        Share a few details and we'll get back to you about the right vehicle.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 flex w-full flex-col gap-5"
        noValidate
      >
        <div className="flex w-full flex-col gap-5 md:flex-row md:gap-6">
          <InputField
            icon={User}
            type="text"
            placeholder="Full name"
            error={errors.name?.message}
            registration={register('name')}
          />
          <InputField
            icon={Mail}
            type="email"
            placeholder="Email address"
            error={errors.email?.message}
            disabled={emailVerified}
            registration={register('email')}
            rightSlot={
              emailVerified ? (
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-green-600">
                  <CheckCircle2 size={15} /> Verified
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!isValidEmail || isSendingOtp}
                  className="shrink-0 rounded-full bg-[#C1502E] px-3 py-1 text-xs font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#A8431F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    <Loader2 className="animate-spin" size={13} />
                  ) : otpSent ? (
                    'Sent'
                  ) : (
                    'Send OTP'
                  )}
                </button>
              )
            }
          />
        </div>

        {otpSent && !emailVerified && (
          <div className="w-full">
            <div className="flex w-full items-center gap-3 border-b border-[#E4E1D9] py-3 transition-colors focus-within:border-[#C1502E]">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-transparent text-sm text-[#1B2333] outline-none placeholder:text-[#9C978A] md:text-[15px]"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp.trim().length === 0 || isVerifyingOtp}
                className="shrink-0 rounded-full bg-[#1B2333] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#2c3650] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <Loader2 className="animate-spin" size={13} />
                ) : (
                  'Verify'
                )}
              </button>
            </div>
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={resendTimer > 0 || isSendingOtp}
                className="text-xs font-medium text-[#C1502E] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-[#9C978A] disabled:no-underline"
              >
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}

        <InputField
          icon={Phone}
          type="tel"
          placeholder="Phone number"
          error={errors.phone?.message}
          registration={register('phone')}
        />

        <div>
          <div
            className={`flex w-full gap-3 border-b py-3 transition-colors ${
              errors.message
                ? 'border-red-400'
                : 'border-[#E4E1D9] focus-within:border-[#C1502E]'
            }`}
          >
            <MessageSquare className="mt-1 text-[#8A8578]" size={17} />
            <textarea
              placeholder="What are you looking for?"
              className="h-24 w-full resize-none bg-transparent text-sm text-[#1B2333] outline-none placeholder:text-[#9C978A] md:text-[15px]"
              {...register('message')}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="mt-2">
          <button
            type="submit"
            disabled={isPending || !emailVerified}
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#C1502E] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#A8431F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Sending…
              </>
            ) : (
              'Send inquiry'
            )}
          </button>
          {!emailVerified && (
            <p className="mt-2 text-xs text-[#9C978A]">
              Verify your email to enable submission.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
