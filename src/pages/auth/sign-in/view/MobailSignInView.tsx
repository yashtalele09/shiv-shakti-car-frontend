import { ArrowLeft } from "lucide-react";
import Input from "../../../../components/auth-components/Input";
import Button from "../../../../components/auth-components/Button";
import GoogleAuth from "../../../../components/auth-components/GoogleAuth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";
import { motion, type Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { SignInSchema, type SignInFormData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SignInAPISuccessResponseT } from "../../../../typs/auth/sign-in/post";
import { setAuthToken, setUserData } from "../../../../helper/auth";
import { useSignInMutation } from "../hooks/useSignInMutation";
import { toast } from "react-toastify";
import type { APIFailureData } from "../../../../typs/shared";

const MobileSignInView = () => {
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

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useSignInMutation({
    onSuccess: (data: SignInAPISuccessResponseT) => {
      setUserData({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
      });
      setAuthToken(data.token);
      const message = "Registration successful! Please verify your email.";
      toast.success(message);
      navigate(ROUTES.AUTH.HOME);
    },
    onError: (error: APIFailureData) => {
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-screen h-screen bg-linear-to-br from-[#FFD9C9] to-[#CDC3FF]">
      <div className="flex h-[5vh]">
        <ArrowLeft
          className="absolute top-6 left-4 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]"
          size={30}
        />
      </div>
      <div className="flex relative h-[10vh]">
        <h1 className="text-2xl font-family-['Gravitas One'] drop-shadow-[0_0_5px_rgba(0,0,0,0.2)] font-bold absolute top-6 left-6 text-white">
          Sign In
        </h1>
      </div>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col mt-4 gap-10 px-4 relative">
        <motion.div variants={itemVariants}>
          <Input
            type="text"
            {...form.register("email")}
            placeholder="Email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm ml-4 mt-3 drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
              {errors.email.message}
            </p>
          )}
        </motion.div>
        <motion.div variants={itemVariants}>
          <Input
            type="password"
            {...form.register("password")}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm ml-4 mt-3 drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
              {errors.password.message}
            </p>
          )}
          <p className="text-right mt-6 text-sm drop-shadow-[0_0_5px_rgba(0,0,0,0.2)] font-medium w-full pr-4 text-blue-500">
            Forgot Password
          </p>
        </motion.div>
        <div className="flex relative flex-col justify-center items-center px-4 mt-10">
          <Button
            type="submit"
            disabled={signInMutation.isPending}
            text="Sign In"
          />
          <div className="text-left w-full ml-4 gap-2 mt-4">
            <p className="text-sm mt-4 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
              Already have an account?{" "}
              <span
                className="text-blue-500"
                onClick={() => navigate(ROUTES.AUTH.SIGN_UP)}>
                Sign Up
              </span>
            </p>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-sm mt-8 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]">
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

export default MobileSignInView;
