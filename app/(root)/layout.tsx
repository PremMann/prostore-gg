export const runtime = "nodejs";

import Header from "@/components/ui/shared/header";
import Footer from "@/components/ui/footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <div className="flex min-h-screen flex-col bg-white dark:bg-black">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
   </div>
  );
}
