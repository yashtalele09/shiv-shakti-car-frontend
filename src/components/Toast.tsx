import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastConfig {
  icon: ReactNode;
  ring: string;
  iconColor: string;
  iconBg: string;
  progress: string;
}

const variantConfig: Record<ToastVariant, ToastConfig> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" strokeWidth={2.25} />,
    ring: 'ring-emerald-500/15',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    progress: 'bg-emerald-500',
  },
  error: {
    icon: <XCircle className="h-5 w-5" strokeWidth={2.25} />,
    ring: 'ring-red-500/15',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    progress: 'bg-red-500',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" strokeWidth={2.25} />,
    ring: 'ring-amber-500/15',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    progress: 'bg-amber-500',
  },
  info: {
    icon: <Info className="h-5 w-5" strokeWidth={2.25} />,
    ring: 'ring-indigo-500/15',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    progress: 'bg-indigo-500',
  },
  loading: {
    icon: <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.25} />,
    ring: 'ring-indigo-500/15',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    progress: 'bg-indigo-500',
  },
};

interface CustomToastProps {
  variant: ToastVariant;
  title: string;
  description?: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  /** ms until auto-dismiss; omit or 0 to hide the progress bar (e.g. loading) */
  duration?: number;
}

export const CustomToast = ({
  variant,
  title,
  description,
  onClose,
  actionLabel,
  onAction,
  duration,
}: CustomToastProps) => {
  const config = variantConfig[variant];
  const [paused, setPaused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl ring-1 shadow-slate-900/[0.08] ring-slate-900/[0.03] backdrop-blur-sm"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.iconBg} ${config.iconColor} ring-4 ${config.ring}`}
      >
        {config.icon}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[13.5px] leading-tight font-semibold text-slate-900">
          {title}
        </p>
        {description && (
          <p className="mt-1 text-[13px] leading-snug text-slate-500">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-2 text-[13px] font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      )}

      {!!duration && (
        <ToastProgressBar
          duration={duration}
          color={config.progress}
          paused={paused}
        />
      )}
    </motion.div>
  );
};

const ToastProgressBar = ({
  duration,
  color,
  paused,
}: {
  duration: number;
  color: string;
  paused: boolean;
}) => {
  // Re-running the animation via key when unpaused avoids janky restarts
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (!paused) setKey((k) => k + 1);
  }, [paused]);

  return (
    <div className="absolute inset-x-0 bottom-0 h-[3px] bg-slate-100">
      <motion.div
        key={key}
        initial={{ width: '100%' }}
        animate={{ width: paused ? '100%' : '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`h-full ${color}`}
      />
    </div>
  );
};
