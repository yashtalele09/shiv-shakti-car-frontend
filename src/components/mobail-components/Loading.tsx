import { useEffect, useRef, useState } from 'react';
import { Car, KeyRound, FileText, Save, ShieldCheck } from 'lucide-react';

const stages = [
  { icon: Car, info: 'Checking the vehicle' },
  { icon: KeyRound, info: 'Verifying ownership' },
  { icon: FileText, info: 'Reviewing documents' },
  { icon: Save, info: 'Saving your report' },
  { icon: ShieldCheck, info: 'Trusted & verified' },
];

const DURATION = 1200;

export default function CarLoader() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [labelVisible, setLabelVisible] = useState(true);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (ts: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = ts;
      }

      if (ts - startTimeRef.current >= DURATION) {
        startTimeRef.current = ts;

        setCurrent((c) => {
          const next = (c + 1) % stages.length;

          setPrev(c);

          setTimeout(() => {
            setPrev(null);
          }, 350);

          return next;
        });

        setLabelVisible(false);

        setTimeout(() => {
          setLabelVisible(true);
        }, 180);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const getSlotClass = (index: number) => {
    if (index === current) {
      return 'opacity-100 scale-100';
    }

    if (index === prev) {
      return 'opacity-0 scale-125';
    }

    return 'opacity-0 scale-50';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Icon */}
        <div className="relative h-24 w-24">
          {stages.map((stage, i) => {
            const Icon = stage.icon;

            return (
              <div
                key={stage.info}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${getSlotClass(i)} `}
              >
                <Icon
                  size={72}
                  strokeWidth={1.8}
                  className="text-white drop-shadow-lg"
                />
              </div>
            );
          })}
        </div>

        {/* Status Text */}
        <p
          className={`text-center text-base font-medium text-white transition-opacity duration-200 ${labelVisible ? 'opacity-100' : 'opacity-0'} `}
        >
          {stages[current].info}
        </p>
      </div>
    </div>
  );
}
