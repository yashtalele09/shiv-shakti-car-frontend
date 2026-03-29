import { motion } from "framer-motion";
import Header from "./components/Header";
import InquiryForm from "./components/InquiryForm";
import ContactDetails from "./components/ContactDetails";
import AddressDetails from "./components/AddressDetails";
const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-15 min-h-screen">
      <Header />
      <InquiryForm />
      <ContactDetails />
      <AddressDetails />
    </motion.div>
  );
};

export default Contact;
