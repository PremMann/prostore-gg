import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-16 border-t-2 border-black">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2 text-sm tracking-widest font-bold">
          <Link href="/client-service" className="hover:opacity-70 transition-opacity">
            CLIENT SERVICE
          </Link>
          <Link href="/terms-of-service" className="hover:opacity-70 transition-opacity">
            TERMS OF SERVICE
          </Link>
        </div>

        <div className="text-[10px] tracking-widest uppercase">
          © {new Date().getFullYear()} (PROMEODY). All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;