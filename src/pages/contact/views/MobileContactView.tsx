import { motion } from 'framer-motion';
import Header from '../components/mobile/Header';
import InquiryForm from '../components/mobile/InquiryForm';
import ContactDetails from '../components/mobile/ContactDetails';
import AddressDetails from '../components/mobile/AddressDetails';
const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-15"
    >
      <Header />
      <InquiryForm />
      <ContactDetails />
      <AddressDetails />
    </motion.div>
  );
};

export default Contact;
