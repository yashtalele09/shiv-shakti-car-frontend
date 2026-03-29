import { MapPin, ExternalLink } from "lucide-react";

const AddressDetails = () => {
  return (
    <div className="w-[95%] mx-auto mt-6 bg-gradient-to-b from-[#FFD5D5] to-[#F1E6F9] shadow-2xl border border-gray-200 p-6 rounded-2xl">
      {/* Heading */}
      <p className="text-left flex items-center gap-2 text-xl text-white drop-shadow-md font-bold">
        Address Details
      </p>

      {/* Content */}
      <div className="w-full flex flex-col gap-5 mt-6">
        {/* Address Card */}
        <div className="w-full flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="bg-[#F1E6F9] p-2 rounded-lg">
            <MapPin className="text-[#AD93DE]" size={20} />
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">Office Address</p>
            <p className="text-base text-gray-700 font-semibold">
              Bhusawal Road, near Doordarshan Tower, Jalgaon
            </p>
          </div>
        </div>

        {/* Google Maps Card */}
        <div className="w-full flex items-start justify-between gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-4">
            <div className="bg-[#F1E6F9] p-2 rounded-lg">
              <MapPin className="text-[#AD93DE]" size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Google Maps</p>
              <p className="text-base text-gray-700 font-semibold">
                Bhusawal Road, near Doordarshan Tower, Jalgaon
              </p>
            </div>
          </div>

          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-[#AD93DE] font-semibold hover:underline">
            Open
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
