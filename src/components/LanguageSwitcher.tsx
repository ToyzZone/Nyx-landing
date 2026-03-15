interface Props {
  locale: 'vi' | 'en';
  altPath: string;
}

export default function LanguageSwitcher({ locale, altPath }: Props) {
  const isVI = locale === 'vi';

  return (
    <a
      href={altPath}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-500/30 text-sm font-medium text-text-muted hover:text-text-primary hover:border-purple-400/60 transition-all duration-200"
      title={isVI ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
    >
      <span className={isVI ? 'text-text-muted' : 'text-accent-violet font-semibold'}>EN</span>
      <span className="text-purple-500/50">|</span>
      <span className={isVI ? 'text-accent-violet font-semibold' : 'text-text-muted'}>VI</span>
    </a>
  );
}
