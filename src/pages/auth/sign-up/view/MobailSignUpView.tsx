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
import { useState } from 'react';

const fields: {
  name: keyof SignUpFormData;
  placeholder: string;
  type: string;
  icon: React.ReactNode;
  isPassword?: boolean;
}[] = [
  {
    name: 'name',
    placeholder: 'Full name',
    type: 'text',
    icon: <User size={16} />,
  },
  {
    name: 'email',
    placeholder: 'Email address',
    type: 'text',
    icon: <Mail size={16} />,
  },
  {
    name: 'phone',
    placeholder: 'Phone number',
    type: 'text',
    icon: <Phone size={16} />,
  },
  {
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    icon: <Lock size={16} />,
    isPassword: true,
  },
  {
    name: 'confirmPassword',
    placeholder: 'Confirm password',
    type: 'password',
    icon: <Lock size={16} />,
    isPassword: true,
  },
];

const MobileSignUpView = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          Get started
        </p>
        <h1
          className="text-4xl font-bold text-white"
          style={{
            fontFamily: "'Gravitas One', serif",
            textShadow: '0 2px 16px rgba(0,0,0,0.12)',
            letterSpacing: '-0.5px',
          }}
        >
          Sign Up
        </h1>
      </motion.div>

      {/* Form card */}
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 px-6 py-8"
        >
          {fields.map(({ name, placeholder, type, icon, isPassword }) => {
            const toggle = isPassword ? getToggle(name) : null;
            const isVisible = toggle?.show;
            const error = errors[name];

            return (
              <motion.div
                key={name}
                variants={itemVariants}
                className="flex flex-col gap-1.5"
              >
                <label className="pl-1 text-xs font-semibold tracking-wider text-white/80 uppercase">
                  {placeholder}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/50">
                    {icon}
                  </span>
                  <input
                    type={isPassword ? (isVisible ? 'text' : 'password') : type}
                    {...form.register(name)}
                    placeholder={placeholder}
                    className="w-full rounded-2xl py-3.5 pr-12 pl-10 text-sm text-white placeholder-white/40 transition-all outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.18)',
                      border: error
                        ? '1.5px solid rgba(255,100,100,0.7)'
                        : '1.5px solid rgba(255,255,255,0.3)',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border =
                        '1.5px solid rgba(255,255,255,0.7)';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = error
                        ? '1.5px solid rgba(255,100,100,0.7)'
                        : '1.5px solid rgba(255,255,255,0.3)';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.18)';
                    }}
                  />
                  {isPassword && toggle && (
                    <button
                      type="button"
                      onClick={toggle.toggle}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 transition-colors hover:text-white/80"
                      aria-label={isVisible ? 'Hide password' : 'Show password'}
                    >
                      {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
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
              </motion.div>
            );
          })}

          {/* Submit button */}
          <motion.div variants={itemVariants} className="pt-2">
            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: signUpMutation.isPending
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.9)',
                color: '#6B5BE6',
                boxShadow:
                  '0 4px 20px rgba(255,255,255,0.25), 0 1px 0 rgba(255,255,255,0.8) inset',
                letterSpacing: '0.5px',
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
            className="text-center text-sm text-white/70"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate(ROUTES.AUTH.SIGN_IN)}
              className="font-semibold text-white underline decoration-white/40 underline-offset-2 transition-all hover:decoration-white"
            >
              Sign In
            </button>
          </motion.p>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <div className="h-px flex-1 bg-white/25" />
            <span className="text-xs font-medium tracking-widest text-white/50 uppercase">
              or
            </span>
            <div className="h-px flex-1 bg-white/25" />
          </motion.div>

          {/* Google auth */}
          <motion.div variants={itemVariants}>
            <GoogleAuth />
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MobileSignUpView;
