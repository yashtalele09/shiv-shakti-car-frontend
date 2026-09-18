import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const ShareSheet = ({ isOpen, onClose, url, title }: Props) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const t = requestAnimationFrame(() => setMounted(true));
      return () => {
        cancelAnimationFrame(t);
        document.body.style.overflow = '';
      };
    }
    setMounted(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  const apps = [
    {
      label: 'WhatsApp',
      bg: '#25D366',
      href: `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      label: 'Facebook',
      bg: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'X',
      bg: '#000',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: 'Telegram',
      bg: '#2AABEE',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: 'SMS',
      bg: '#34C759',
      href: `sms:?body=${encodeURIComponent(url)}`,
    },
    {
      label: 'Email',
      bg: '#EA4335',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl bg-white pb-6 shadow-2xl transition-all duration-200 ease-out ${
          mounted
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-2 scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-base font-semibold text-gray-800">Share via</p>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* app grid */}
        <div className="grid grid-cols-6 gap-1 px-3">
          {apps.map((app) => (
            <a
              key={app.label}
              href={app.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl p-2 transition-colors hover:bg-gray-50"
              onClick={onClose}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: app.bg }}
              >
                {/* swap these for your SVG icons */}
                <span className="text-lg font-bold text-white">
                  {app.label[0]}
                </span>
              </div>
              <span className="text-center text-[11px] text-gray-500">
                {app.label}
              </span>
            </a>
          ))}
        </div>

        {/* copy link */}
        <div className="mx-4 mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-200">
              {copied ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-gray-500" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-800">Copy link</p>
              <p className="truncate text-xs text-gray-400">{url}</p>
            </div>
            <span className="text-xs text-gray-400">
              {copied ? '✓ Copied' : 'Tap'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareSheet;
