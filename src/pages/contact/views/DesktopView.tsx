import { motion } from 'framer-motion';
import Header from '../components/desktop/HeaderDesktop';
import InquiryForm from '../components/desktop/InquiryDesktopForm';
import ContactDetails from '../components/desktop/ContactDesktopDetails';
import AddressDetails from '../components/desktop/AddressDesktopDetails';

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white pt-15"
    >
      <Header />

      <div className="mx-auto w-[95%] max-w-6xl py-10 md:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="lg:w-3/5">
            <InquiryForm />
          </div>
          <div className="flex flex-col gap-6 lg:w-2/5">
            <ContactDetails />
            <AddressDetails />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
