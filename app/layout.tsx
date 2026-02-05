import { Inter } from "next/font/google";
import '@/assets/styles/globals.css';

import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';
import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/components/catalog/language-context';
import { CartProvider } from '@/components/cart/cart-context';
import MobileCartDrawer from '@/components/cart/mobile-cart-drawer';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <CartProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='dark'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <MobileCartDrawer />
              <Toaster />
            </ThemeProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

