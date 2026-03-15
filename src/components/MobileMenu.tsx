import { useState } from 'react';

interface Props {
  locale: 'vi' | 'en';
  labels: {
    features: string;
    demo: string;
    pricing: string;
    contact: string;
    download: string;
  };
  altPath: string;
}

export default function MobileMenu({ locale, labels, altPath }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-3">
      {/* Language toggle compact */}
      <a
        href={altPath}
        className="text-xs font-medium text-text-muted hover:text-accent-violet transition-colors px-2 py-1 rounded border border-purple-500/20"
      >
        {locale === 'vi' ? 'EN' : 'VI'}
      </a>

      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-1.5 p-1.5 text-text-muted hover:text-text-primary transition-colors"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={`block h-0.5 w-6 bg-current transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-current transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="fixed inset-x-0 top-16 z-40 glass border-t border-purple-500/10 shadow-2xl px-6 py-6 flex flex-col gap-4">
          {[
            { label: labels.features, href: '#features' },
            { label: labels.demo, href: '#demo' },
            { label: labels.pricing, href: '#pricing' },
            { label: labels.contact, href: '#contact' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-text-muted hover:text-text-primary transition-colors py-1"
            >
              {label}
            </a>
          ))}
          <a
            href="#download"
            onClick={() => setOpen(false)}
            className="mt-2 btn-gradient text-center text-white font-semibold py-3 px-6 rounded-xl text-sm"
          >
            {labels.download}
          </a>
        </div>
      )}
    </div>
  );
}
