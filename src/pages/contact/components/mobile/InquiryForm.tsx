import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquirySchema } from '../../schema/index';
import type { InquiryFormValues } from '../../schema/index';
import { useSubmitInquiry } from '../../hooks/useInquiryMutation';

interface InputFieldProps {
  icon: any;
  type: string;
  placeholder: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

const InputField = ({
  icon: Icon,
  type,
  placeholder,
  error,
  registration,
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
          className="w-full text-sm outline-none"
          {...registration}
        />
      </div>
      {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const InquiryForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  });

  const { mutate, isPending } = useSubmitInquiry();

  const onSubmit = (values: InquiryFormValues) => {
    mutate(values, {
      onSuccess: () => reset(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-[-50px] w-[95%] rounded-2xl border border-gray-200 bg-gradient-to-br from-[#FFD9C9] to-[#CDC3FF] p-6 shadow-2xl"
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
          registration={register('email')}
        />
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
            disabled={isPending}
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
        </div>
      </form>
    </motion.div>
  );
};

export default InquiryForm;
