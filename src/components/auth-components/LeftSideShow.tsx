import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/logdumy.png';
import banner from '../../assets/banner.png';

const slides = [
  {
    src: banner,
    title: 'Verified listings, always',
    text: 'Every car on Car Bazar is inspected and verified before it goes live.',
  },
  {
    src: banner,
    title: 'Best price, guaranteed',
    text: 'Compare across brands and locations to land the fairest deal in your city.',
  },
  {
    src: banner,
    title: '10,000+ happy owners',
    text: 'Join a growing community of trusted buyers and sellers across Maharashtra.',
  },
];

const LeftSideShow = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative hidden h-full min-h-0 flex-col justify-between overflow-hidden p-8 md:flex lg:p-10"
      style={{
        background:
          'linear-gradient(160deg, #FF9A7B 0%, #C599F0 55%, #6B5BE6 100%)',
      }}
    >
      <div>
        <div className="mb-6 flex items-center gap-2.5">
          <img
            src={Logo}
            alt="Shri Shivshakti Car Bazar"
            className="h-15 w-15 rounded-xl object-contain"
          />
        </div>

        <p className="mb-2 text-xs font-semibold tracking-widest text-white/70 uppercase">
          Get started
        </p>
        <h1
          className="text-3xl leading-[1.15] font-bold text-white lg:text-[2.25rem]"
          style={{
            fontFamily: "'Gravitas One', serif",
            letterSpacing: '-0.5px',
            textShadow: '0 2px 16px rgba(0,0,0,0.1)',
          }}
        >
          Find your perfect
          <br />
          drive today.
        </h1>
      </div>

      {/* Image carousel — flexes to fill remaining space instead of a fixed aspect ratio */}
      <div className="flex min-h-0 flex-1 flex-col pt-6">
        <div
          className="relative min-h-0 flex-1 overflow-hidden rounded-2xl"
          style={{
            boxShadow:
              '0 25px 50px -12px rgba(76,29,149,0.45), 0 0 0 1px rgba(255,255,255,0.25)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeSlide}
              src={slides[activeSlide].src}
              alt={slides[activeSlide].title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div
            className="absolute inset-x-0 bottom-0 p-4"
            style={{
              background:
                'linear-gradient(to top, rgba(30,15,60,0.8), transparent)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-sm font-semibold text-white">
                  {slides[activeSlide].title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-white/75">
                  {slides[activeSlide].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveSlide(i)}
              aria-label={`Show slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeSlide ? '28px' : '8px',
                background:
                  i === activeSlide
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSideShow;
