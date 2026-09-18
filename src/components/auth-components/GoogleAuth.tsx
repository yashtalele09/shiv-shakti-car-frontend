import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useGoogleSignInMutation } from '../../hooks/googleMutation';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const GoogleAuth = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const login = useAuthStore((s) => s.login);

  const googleMutation = useGoogleSignInMutation({
    onSuccess: (data) => {
      login(
        {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
        },
        data.token
      );
      toast.success('Google Sign In Successful');
      navigate('/');
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      googleMutation.mutate({ idToken });
    } catch (error) {
      toast.error('Google Sign In Failed');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleGoogleLogin}
      className="font-inter flex h-[60px] w-full flex-col flex-row items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent text-2xl font-medium shadow-[0_4px_8px_rgba(0,0,0,0.2)] md:border-gray-400"
    >
      <img src="/google-logo.png" alt="Google" className="h-6 w-6" />
      <p className="text-lg font-medium text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.2)] md:text-gray-800">
        Sign up with Google
      </p>
    </motion.button>
  );
};

export default GoogleAuth;
