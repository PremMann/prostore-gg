import Link from 'next/link';
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
    <footer className="bg-muted/30 dark:bg-[#0A0A0F] border-t border-border dark:border-white/5">
      <div className="wrapper py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground dark:text-zinc-500 mt-3 max-w-xs">
              Premium essentials at fair prices. Quality you can trust.
            </p>
            {/* Payment Icons */}
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-6 rounded bg-muted dark:bg-white/10 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground dark:text-zinc-400 font-medium">VISA</span>
              </div>
              <div className="w-10 h-6 rounded bg-muted dark:bg-white/10 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground dark:text-zinc-400 font-medium">MC</span>
              </div>
              <div className="w-10 h-6 rounded bg-muted dark:bg-white/10 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground dark:text-zinc-400 font-medium">AMEX</span>
              </div>
              <div className="w-10 h-6 rounded bg-muted dark:bg-white/10 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground dark:text-zinc-400 font-medium">PAY</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground/70 dark:text-zinc-600">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground/70 dark:text-zinc-600 hover:text-muted-foreground dark:hover:text-zinc-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground/70 dark:text-zinc-600 hover:text-muted-foreground dark:hover:text-zinc-400 transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground/70 dark:text-zinc-600 hover:text-muted-foreground dark:hover:text-zinc-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;