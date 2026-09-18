import { MapPin, ExternalLink } from 'lucide-react';

const AddressDetails = () => {
  return (
    <div className="w-full rounded-2xl border border-[#E4E1D9] bg-white p-7 md:p-9">
      <p className="text-lg font-bold text-[#1B2333] md:text-xl">Visit us</p>

      <div className="mt-5 flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C1502E]/10 text-[#C1502E]">
          <MapPin size={17} />
        </div>
        <div>
          <p className="text-sm font-medium text-[#1B2333]">
            Bhusawal Road, near Doordarshan Tower, Jalgaon
          </p>
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#C1502E] hover:underline"
          >
            Get directions
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
