import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/search?sort=newest' },
    { name: 'Best Sellers', href: '/search?sort=popular' },
    { name: 'Sale', href: '/search?sort=price-asc' },
    { name: 'All Products', href: '/search' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/gg.png"
                alt="PROMELODY Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-light tracking-wider uppercase text-black dark:text-white">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4 max-w-xs leading-relaxed">
              Premium essentials at fair prices.
              <br />
              Quality you can trust.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-medium tracking-wide uppercase text-black dark:text-white mb-6">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-medium tracking-wide uppercase text-black dark:text-white mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-medium tracking-wide uppercase text-black dark:text-white mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-wide uppercase text-zinc-500 dark:text-zinc-500">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-[10px] tracking-wide uppercase text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[10px] tracking-wide uppercase text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-[10px] tracking-wide uppercase text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;