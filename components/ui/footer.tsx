import { APP_NAME } from '@/lib/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 py-12">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 text-center">
        <p className="text-[10px] tracking-wide uppercase text-zinc-500 dark:text-zinc-500">
          © {currentYear} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;