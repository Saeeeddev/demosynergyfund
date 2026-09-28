'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function ContactForm() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div className="mt-6 flex flex-col items-center gap-4 text-center">
      <button
        type="button"
        onClick={() => setShowNotice(true)}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill bg-primary px-8 text-[15px] font-medium text-white transition-[transform,background-color] duration-200 ease-out hover:bg-primary-deep active:scale-[0.98]"
      >
        <Mail size={18} aria-hidden="true" />
        ارسال پیام
      </button>
      {showNotice && (
        <p role="status" className="w-full rounded-card border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
          ارسال پیام در حال حاضر فعال نیست. لطفاً بعداً دوباره تلاش کنید.
        </p>
      )}
    </div>
  );
}
