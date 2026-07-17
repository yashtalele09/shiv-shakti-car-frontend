import { MapPin, ExternalLink } from 'lucide-react';

const AddressDetails = () => {
  return (
    <div className="mx-auto mt-6 w-[95%] rounded-2xl border border-gray-200 bg-gradient-to-b from-[#FFD5D5] to-[#F1E6F9] p-6 shadow-2xl">
      {/* Heading */}
      <p className="flex items-center gap-2 text-left text-xl font-bold text-white drop-shadow-md">
        Address Details
      </p>

      {/* Content */}
      <div className="mt-6 flex w-full flex-col gap-5">
        {/* Address Card */}
        <div className="flex w-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="rounded-lg bg-[#F1E6F9] p-2">
            <MapPin className="text-[#AD93DE]" size={20} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Office Address</p>
            <p className="text-base font-semibold text-gray-700">
              Bhusawal Road, near Doordarshan Tower, Jalgaon
            </p>
          </div>
        </div>

        {/* Google Maps Card */}
        <div className="flex w-full items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-[#F1E6F9] p-2">
              <MapPin className="text-[#AD93DE]" size={20} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Google Maps</p>
              <p className="text-base font-semibold text-gray-700">
                Bhusawal Road, near Doordarshan Tower, Jalgaon
              </p>
            </div>
          </div>

          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-semibold text-[#AD93DE] hover:underline"
          >
            Open
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
