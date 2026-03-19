import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const MobailFooter = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-pink-100 via-pink-200 to-pink-100 border-t border-gray-200 px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Logo / About */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">CarZone</h2>
          <p className="text-sm text-gray-600 mt-1">
            Find the best second-hand cars with trusted service and affordable
            prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
          <div className="flex flex-col text-sm text-gray-600 gap-1">
            <a href="#">Home</a>
            <a href="#">Browse Cars</a>
            <a href="#">Sell Your Car</a>
            <a href="#">About Us</a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Services</h3>
          <div className="flex flex-col text-sm text-gray-600 gap-1">
            <p>Car Inspection</p>
            <p>Documentation Help</p>
            <p>Car Loan Assistance</p>
            <p>Doorstep Delivery</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
          <div className="flex flex-col text-sm text-gray-600 gap-2">
            <div className="flex items-center gap-2">
              <Phone size={16} /> <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} /> <span>support@carzone.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} /> <span>India</span>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="flex justify-center gap-4 text-gray-700">
          <Facebook size={20} />
          <Instagram size={20} />
          <Twitter size={20} />
        </div>

        {/* Bottom */}
        <div className="text-center text-xs text-gray-500 border-t pt-3">
          © {new Date().getFullYear()} CarZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default MobailFooter;
