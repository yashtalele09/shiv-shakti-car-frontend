import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import GoogleAuth from '../../../../components/auth-components/GoogleAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema } from '../schema';
import type { SignUpFormData } from '../schema';
import { useSignUpMutation } from '../hooks/useSignUpMutation';
import type { APIFailureData } from '../../../../typs/shared';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTES } from '../../../../constants/routes';
import { motion, type Variants } from 'framer-motion';

import LeftSideShow from '../../../../components/auth-components/LeftSideShow';

// Brand accent — pulled from the page's own gradient so every surface reads as one palette.
const ACCENT = '#6B5BE6';
const ACCENT_DARK = '#5847C9';
const ACCENT_SOFT = 'rgba(107,91,230,0.12)';

const fields: {
  name: keyof SignUpFormData;
  placeholder: string;
  type: string;
  icon: React.ReactNode;
  isPassword?: boolean;
  span?: 'full' | 'half';
}[] = [
  {
    name: 'name',
    placeholder: 'Full name',
    type: 'text',
    icon: <User size={16} />,
    span: 'full',
  },
  {
    name: 'email',
    placeholder: 'Email address',
    type: 'text',
    icon: <Mail size={16} />,
    span: 'half',
  },
  {
    name: 'phone',
    placeholder: 'Phone number',
    type: 'text',
    icon: <Phone size={16} />,
    span: 'half',
  },
  {
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    icon: <Lock size={16} />,
    isPassword: true,
    span: 'half',
  },
  {
    name: 'confirmPassword',
    placeholder: 'Confirm password',
    type: 'password',
    icon: <Lock size={16} />,
    isPassword: true,
    span: 'half',
  },
];

const DesktopSignUpView = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signUpMutation = useSignUpMutation({
    onSuccess: () => {
      navigate('/verify-otp', {
        state: {
          email: form.getValues('email'),
        },
      });
      toast.success('Registration successful!');
    },
    onError: (error: APIFailureData) => {
      toast.error(error?.message || 'Sign up failed. Please try again.');
      console.log(error);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate({ data });
  };

  const {
    formState: { errors },
  } = form;

  const getToggle = (name: keyof SignUpFormData) => {
    if (name === 'password')
      return { show: showPassword, toggle: () => setShowPassword((v) => !v) };
    if (name === 'confirmPassword')
      return { show: showConfirm, toggle: () => setShowConfirm((v) => !v) };
    return null;
  };

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
        {/* Left: brand / image carousel panel — gradient pulled from the page's own blob colors */}
        <LeftSideShow />
        {/* Right: form panel */}
        <div className="flex h-full min-h-0 flex-col justify-center overflow-y-auto px-8 py-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-5"
          >
            <h2 className="text-2xl font-bold text-slate-900">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Buy and sell cars with confidence.
            </p>
          </motion.div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {fields.map(
                ({ name, placeholder, type, icon, isPassword, span }) => {
                  const toggle = isPassword ? getToggle(name) : null;
                  const isVisible = toggle?.show;
                  const error = errors[name];

                  return (
                    <motion.div
                      key={name}
                      variants={itemVariants}
                      className={`flex flex-col gap-1.5 ${
                        span === 'full'
                          ? 'col-span-2'
                          : 'col-span-2 sm:col-span-1'
                      }`}
                    >
                      <label className="pl-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        {placeholder}
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
                          {icon}
                        </span>
                        <input
                          type={
                            isPassword
                              ? isVisible
                                ? 'text'
                                : 'password'
                              : type
                          }
                          {...form.register(name)}
                          placeholder={placeholder}
                          className="w-full rounded-xl py-2.5 pr-12 pl-10 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none"
                          style={{
                            background: '#FAF9FF',
                            border: error
                              ? '1.5px solid #FCA5A5'
                              : '1.5px solid #E7E3FA',
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
                        {isPassword && toggle && (
                          <button
                            type="button"
                            onClick={toggle.toggle}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                            aria-label={
                              isVisible ? 'Hide password' : 'Show password'
                            }
                          >
                            {isVisible ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        )}
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
                    </motion.div>
                  );
                }
              )}
            </div>

            {/* Submit button */}
            <motion.div variants={itemVariants} className="pt-1">
              <button
                type="submit"
                disabled={signUpMutation.isPending}
                className="w-full rounded-xl py-3 text-sm font-bold tracking-wide text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: signUpMutation.isPending ? '#B8AEF0' : ACCENT,
                  boxShadow: `0 8px 20px -6px ${ACCENT_SOFT}`,
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={(e) => {
                  if (!signUpMutation.isPending)
                    e.currentTarget.style.background = ACCENT_DARK;
                }}
                onMouseLeave={(e) => {
                  if (!signUpMutation.isPending)
                    e.currentTarget.style.background = ACCENT;
                }}
              >
                {signUpMutation.isPending ? (
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
                    Creating Account…
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </motion.div>

            {/* Sign in link */}
            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-slate-500"
            >
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(ROUTES.AUTH.SIGN_IN)}
                className="font-semibold underline underline-offset-2 transition-all"
                style={{
                  color: ACCENT,
                  textDecorationColor: 'rgba(107,91,230,0.3)',
                }}
              >
                Sign In
              </button>
            </motion.p>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <div className="h-px flex-1" style={{ background: '#E7E3FA' }} />
              <span className="text-xs font-medium tracking-widest text-slate-400 uppercase">
                or
              </span>
              <div className="h-px flex-1" style={{ background: '#E7E3FA' }} />
            </motion.div>

            {/* Google auth */}
            <motion.div variants={itemVariants}>
              <GoogleAuth />
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default DesktopSignUpView;
