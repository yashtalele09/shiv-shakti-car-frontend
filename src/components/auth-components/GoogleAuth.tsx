import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useGoogleSignInMutation } from "../../hooks/googleMutation";
import { setAuthToken, setUserData } from "../../helper/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const googleMutation = useGoogleSignInMutation({
    onSuccess: (data) => {
      setUserData(data.user);
      setAuthToken(data.token);
      toast.success("Google Sign In Successful");
      navigate("/");
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      googleMutation.mutate({ idToken });
    } catch (error) {
      toast.error("Google Sign In Failed");
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleGoogleLogin}
      className="w-full h-[60px] bg-transparent flex flex-row items-center justify-center gap-2 shadow-[0_4px_8px_rgba(0,0,0,0.2)] text-2xl font-inter font-medium rounded-full border-2 border-white flex-col">
      <img src="/google-logo.png" alt="Google" className="w-6 h-6" />
      <p className="text-lg text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.2)] font-medium">
        Sign up with Google
      </p>
    </motion.button>
  );
};

export default GoogleAuth;
