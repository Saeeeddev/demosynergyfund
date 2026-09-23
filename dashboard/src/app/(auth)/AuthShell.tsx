import fs from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import { Sun, TrendingUp, ShieldCheck } from 'lucide-react'

// Split-screen shell shared by Login + Register.
// RTL flex: first child sits on the physical RIGHT (form), second child on the
// physical LEFT (brand image panel) — the image must be on the left per design.
// Below lg the image panel disappears and the form column owns the viewport.
// The gradient behind the image doubles as a graceful fallback while it loads.

const HIGHLIGHTS = [
  { icon: Sun, label: 'انرژی پاک خورشیدی' },
  { icon: TrendingUp, label: 'درآمد پایدار' },
  { icon: ShieldCheck, label: 'امن و شفاف' },
] as const

// The hero is AI-generated on demand; until the file lands in public/Images
// the branded gradient below carries the panel on its own.
const HAS_VISUAL = fs.existsSync(
  path.join(process.cwd(), 'public/Images/LoginRegisterImage.jpg'),
)

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex">
      {/* Form column — physical right in RTL */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <p className="pb-6 px-5 text-center text-[12px] text-text-subtle">
          © سینرژی  — سرمایه‌گذاری در انرژی‌های تجدیدپذیر
        </p>
      </main>

      {/* Brand image panel — physical left in RTL, decorative marketing surface */}
      <aside className="hidden lg:block w-[46%] max-w-[760px] shrink-0 p-4">
        <div
          className="relative h-full min-h-[620px] rounded-[28px] overflow-hidden"
          style={{
            background:
              'linear-gradient(165deg, #1C3D5A 0%, #35678A 38%, #4FA98F 72%, #2BB583 100%)',
          }}
        >
          {HAS_VISUAL && (
            <Image
              src="/Images/LoginRegisterImage.jpg"
              alt="سرمایه‌گذاری در انرژی خورشیدی"
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 46vw, 1px"
              className="object-cover"
            />
          )}

          {/* Legibility scrim for the overlay copy */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(8,24,34,0.82) 0%, rgba(8,24,34,0.34) 38%, rgba(8,24,34,0) 62%)',
            }}
          />

          {/* Brand copy */}
          <div className="absolute inset-x-0 bottom-0 p-9 flex flex-col gap-4 text-white">
            <h2 className="text-[26px] font-bold leading-[1.55]">
              آینده‌ای روشن، با انرژی خورشید
            </h2>
            <p className="text-[14px] leading-[1.9] text-white/85 max-w-[42ch]">
              با سینرژی  در نیروگاه‌های خورشیدی سرمایه‌گذاری کنید و از درآمد
              پایدار انرژی پاک سهم داشته باشید.
            </p>
            <ul className="flex flex-wrap gap-2 pt-1">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-3.5 py-2 text-[12.5px] font-medium backdrop-blur-md"
                >
                  <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}
