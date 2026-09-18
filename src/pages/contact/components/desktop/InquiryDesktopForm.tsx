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
          className="w-full bg-transparent text-sm text-[#1B2333] outline-none placeholder:text-[#9C978A] md:text-[15px]"
          {...registration}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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
            registration={register('email')}
          />
        </div>

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
            disabled={isPending}
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
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
