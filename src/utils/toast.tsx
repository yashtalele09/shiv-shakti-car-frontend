import { toast, type Id } from 'react-toastify';
import { CustomToast, type ToastVariant } from '../components/Toast';

interface ToastParams {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

const fire = (variant: ToastVariant, params: ToastParams | string): Id => {
  const p: ToastParams =
    typeof params === 'string' ? { title: params } : params;

  return toast(
    ({ closeToast }) => (
      <CustomToast
        variant={variant}
        title={p.title}
        description={p.description}
        actionLabel={p.actionLabel}
        onAction={p.onAction}
        onClose={closeToast}
      />
    ),
    {
      autoClose: variant === 'loading' ? false : (p.duration ?? 3500),
      closeButton: false,
      icon: false,
      className: '!bg-transparent !shadow-none !p-0',
    }
  );
};

export const showToast = {
  success: (params: ToastParams | string) => fire('success', params),
  error: (params: ToastParams | string) => fire('error', params),
  warning: (params: ToastParams | string) => fire('warning', params),
  info: (params: ToastParams | string) => fire('info', params),
  loading: (params: ToastParams | string) => fire('loading', params),

  dismiss: (id?: Id) => toast.dismiss(id),
  update: (id: Id, params: ToastParams & { variant: ToastVariant }) => {
    toast.update(id, {
      render: (
        <CustomToast
          variant={params.variant}
          title={params.title}
          description={params.description}
        />
      ),
      autoClose: 3500,
      className: '!bg-transparent !shadow-none !p-0',
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: { pending: string; success: string; error: string }
  ): Promise<T> => {
    const id = showToast.loading(messages.pending);
    return promise
      .then((res) => {
        showToast.update(id, { variant: 'success', title: messages.success });
        return res;
      })
      .catch((err) => {
        showToast.update(id, { variant: 'error', title: messages.error });
        throw err;
      });
  },
};
