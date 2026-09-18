import { Phone, Mail } from 'lucide-react';

const Header = () => {
  return (
    <div className="w-full bg-[#1B2333]">
      <div className="mx-auto flex w-[95%] max-w-6xl flex-col gap-6 py-16 md:py-20 lg:py-24">
        <div>
          <p className="text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Let's find your next car
          </p>
          <div className="mt-5 h-px w-24 bg-[repeating-linear-gradient(90deg,#C1502E_0,#C1502E_10px,transparent_10px,transparent_18px)]" />
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
            Tell us what you're looking for, or reach out directly — our team in
            Jalgaon replies within the day.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="tel:+918208963624"
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition-colors hover:border-white/30 hover:text-white"
          >
            <Phone size={15} />
            +91 82089 63624
          </a>
          <a
            href="mailto:shivshakticarbazar@gmail.com"
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition-colors hover:border-white/30 hover:text-white"
          >
            <Mail size={15} />
            shivshakticarbazar@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
