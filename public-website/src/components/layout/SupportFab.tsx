import Link from 'next/link';
import { Headset } from 'lucide-react';

/** Floating support button — bottom-right; the cookie notice sits bottom-left so they don't clash. */
export default function SupportFab() {
  return (
    <Link
      href="/contact"
      aria-label="پشتیبانی"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-pill bg-primary px-5 py-3 text-white shadow-[0_12px_30px_rgba(109,127,159,0.45)] transition-[transform,background-color] duration-200 ease-out hover:bg-primary-deep active:scale-[0.97]"
    >
      <span className="flex h-6 w-6 items-center justify-center">
        <Headset size={22} strokeWidth={1.9} />
      </span>
      <span className="text-sm font-medium">پشتیبانی</span>
    </Link>
  );
}
