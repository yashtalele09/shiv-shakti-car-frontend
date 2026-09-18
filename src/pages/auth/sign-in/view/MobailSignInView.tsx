import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import GoogleAuth from '../../../../components/auth-components/GoogleAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { motion, type Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { SignInSchema, type SignInFormData } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SignInAPISuccessResponseT } from '../../../../typs/auth/sign-in/post';
import { useSignInMutation } from '../hooks/useSignInMutation';
import { toast } from 'react-toastify';
import type { APIFailureData } from '../../../../typs/shared';
import { useState } from 'react';
import useAuthStore from '../../../../store/authStore';

const MobileSignInView = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signInMutation = useSignInMutation({
    onSuccess: (data: SignInAPISuccessResponseT) => {
      login(
        {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        },
        data.token
      );
      toast.success('Welcome back! Signed in successfully.');
      navigate(ROUTES.AUTH.HOME);
    },
    onError: (error: APIFailureData) => {
      toast.error(error?.message || 'Sign in failed. Please try again.');
      console.log(error);
    },
  });

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate({ data });
  };

  const {
    formState: { errors },
  } = form;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          'linear-gradient(145deg, #FFD9C9 0%, #E8C4FF 50%, #CDC3FF 100%)',
      }}
    >
      {/* Decorative blobs for depth */}
      <div
        className="pointer-events-none absolute top-[-80px] right-[-60px] h-[220px] w-[220px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FF9A7B, transparent)' }}
      />
      <div
        className="pointer-events-none absolute bottom-[120px] left-[-80px] h-[200px] w-[200px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }}
      />

      {/* Back button */}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative z-10 px-6 pt-8 pb-2"
      >
        <p className="mb-1 text-sm font-medium tracking-widest text-white/70 uppercase">
          Welcome back
        </p>
        <h1
          className="text-4xl font-bold text-white"
          style={{
            fontFamily: "'Gravitas One', serif",
            textShadow: '0 2px 16px rgba(0,0,0,0.12)',
            letterSpacing: '-0.5px',
          }}
        >
          Sign In
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
          {/* Email field */}
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <label className="pl-1 text-xs font-semibold tracking-wider text-white/80 uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/50"
              />
              <input
                type="text"
                {...form.register('email')}
                placeholder="you@example.com"
                className="w-full rounded-2xl py-3.5 pr-4 pl-10 text-sm text-white placeholder-white/40 transition-all outline-none"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: errors.email
                    ? '1.5px solid rgba(255,100,100,0.7)'
                    : '1.5px solid rgba(255,255,255,0.3)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border =
                    '1.5px solid rgba(255,255,255,0.7)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = errors.email
                    ? '1.5px solid rgba(255,100,100,0.7)'
                    : '1.5px solid rgba(255,255,255,0.3)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                }}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="pl-1 text-xs font-medium text-red-300"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password field */}
          <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-blue-400 transition-colors hover:text-white"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/50"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                {...form.register('password')}
                placeholder="Enter your password"
                className="w-full rounded-2xl py-3.5 pr-12 pl-10 text-sm text-white placeholder-white/40 transition-all outline-none"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: errors.password
                    ? '1.5px solid rgba(255,100,100,0.7)'
                    : '1.5px solid rgba(255,255,255,0.3)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border =
                    '1.5px solid rgba(255,255,255,0.7)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = errors.password
                    ? '1.5px solid rgba(255,100,100,0.7)'
                    : '1.5px solid rgba(255,255,255,0.3)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 transition-colors hover:text-white/80"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="pl-1 text-xs font-medium text-red-300"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Submit button */}
          <motion.div variants={itemVariants} className="pt-2">
            <button
              type="submit"
              disabled={signInMutation.isPending}
              className="w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: signInMutation.isPending
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.9)',
                color: '#6B5BE6',
                boxShadow:
                  '0 4px 20px rgba(255,255,255,0.25), 0 1px 0 rgba(255,255,255,0.8) inset',
                letterSpacing: '0.5px',
              }}
            >
              {signInMutation.isPending ? (
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
                  Signing In…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </motion.div>

          {/* Sign up link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-white/70"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate(ROUTES.AUTH.SIGN_UP)}
              className="font-semibold text-white underline decoration-white/40 underline-offset-2 transition-all hover:decoration-white"
            >
              Sign Up
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

      {/* Bottom spacing */}
      <div className="h-10" />
    </motion.div>
  );
};

export default MobileSignInView;
