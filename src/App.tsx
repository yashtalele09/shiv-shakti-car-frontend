import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        newestOnTop
        closeOnClick={false}
        pauseOnHover
        draggable={false}
        hideProgressBar
        toastClassName="!bg-transparent !shadow-none !p-0 !min-h-0 !mb-3"
        style={{
          top: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '24rem', // 384px, matches CustomToast's max-w-sm
          padding: '0 1rem', // breathing room on small screens
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
