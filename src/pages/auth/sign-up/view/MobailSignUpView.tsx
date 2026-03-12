import { ArrowLeft } from "lucide-react";
import Input from "../../../../components/auth-components/Input";
import Button from "../../../../components/auth-components/Button";
import GoogleAuth from "../../../../components/auth-components/GoogleAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../schema";
import type { SignUpFormData } from "../schema";
import { useSignUpMutation } from "../hooks/useSignUpMutation";
import type { SignUpAPISuccessResponseT } from "../../../../typs/auth/sign-up/post";
import type { APIFailureData } from "../../../../typs/shared";
import { setAuthToken, setUserData } from "../../../../helper/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "../../../../constants/routes";
import { motion, type Variants } from "framer-motion";
const MobileSignUpView = () => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 18,
      },
    },
  };

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signUpMutation = useSignUpMutation({
    onSuccess: (data: SignUpAPISuccessResponseT) => {
      setUserData({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
      });
      setAuthToken(data.token);
      const message = "Registration successful! Please verify your email.";
      toast.success(message);
      navigate(ROUTES.AUTH.SIGN_IN);
    },
    onError: (error: APIFailureData) => {
      console.log(error);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate({ data });
  };

  const {
    formState: { errors },
  } = form;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-screen pb-23 bg-linear-to-br from-[#FFD9C9] to-[#CDC3FF]">
      <div className="flex h-[6vh]">
        <ArrowLeft
          className="absolute top-6 left-4 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]"
          size={30}
        />
      </div>
      <div className="flex relative h-[10vh]">
        <h1 className="text-2xl font-family-['Gravitas One'] drop-shadow-[0_0_5px_rgba(0,0,0,0.2)] font-bold absolute top-6 left-6 text-white">
          Sign Up
        </h1>
      </div>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <div className="flex flex-col mt-4 gap-10 px-4 relative">
          <div>
            <Input
              placeholder="Full name"
              type="text"
              {...form.register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm ml-4 mt-3 drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
                {errors.name.message}
              </p>
            )}
          </div>
          <motion.div variants={itemVariants}>
            <Input
              placeholder="Email address"
              type="text"
              {...form.register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm ml-4 mt-3 drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
                {errors.email.message}
              </p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              placeholder="Phone number"
              type="text"
              {...form.register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm ml-4 mt-3 drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
                {errors.phone.message}
              </p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              placeholder="Password"
              type="password"
              {...form.register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm ml-4 mt-3 drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
                {errors.password.message}
              </p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              placeholder="Confirm password"
              type="password"
              {...form.register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm ml-4 mt-3 drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
                {errors.confirmPassword.message}
              </p>
            )}
          </motion.div>
        </div>
        <div className="flex relative flex-col justify-center items-center px-4 mt-10">
          <Button
            type="submit"
            disabled={signUpMutation.isPending}
            text="Sign Up"
          />
          <div className="text-left w-full ml-4 gap-2 mt-4">
            <p className="text-sm mt-4 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
              Already have an account?{" "}
              <span
                className="text-blue-500"
                onClick={() => navigate(ROUTES.AUTH.SIGN_IN)}>
                Sign In
              </span>
            </p>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-sm mt-4 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
              Or continue with
            </p>
          </div>
          <div className="flex justify-center mt-4 w-full px-4 items-center">
            <GoogleAuth />
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default MobileSignUpView;
