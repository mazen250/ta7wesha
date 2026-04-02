import { useEffect, useState, useCallback } from 'react';
import {
  Coins, Gem, Bell, Target, Calculator, ShieldCheck,
  ArrowRight, Menu, X, Shield, Languages, Sun, Moon,
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { useNavigate } from '../App';

import logo from '../assets/icon.png';
import screenshot1 from '../assets/1.png';
import screenshot2 from '../assets/2.png';
import screenshot3 from '../assets/3.png';

const FEATURES = [
  {
    icon: <Coins size={22} />,
    title: 'Multi-Currency Savings',
    desc: 'Track 19+ currencies with live exchange rates. See your total in EGP instantly.',
  },
  {
    icon: <Gem size={22} />,
    title: 'Gold Tracking',
    desc: 'Monitor gold prices from local Egyptian and global markets. Track by weight and karat.',
  },
  {
    icon: <Bell size={22} />,
    title: 'Price Alerts',
    desc: 'Get notified when USD, EUR, or gold hits your target price.',
  },
  {
    icon: <Target size={22} />,
    title: 'Budget & Goals',
    desc: 'Set savings goals, log income and expenses, track your progress.',
  },
  {
    icon: <Calculator size={22} />,
    title: 'Financial Tools',
    desc: 'Currency converter, what-if simulator, gold calculator, and zakat calculator.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Privacy First',
    desc: 'Your data stays on your device. No account. No tracking. No ads.',
  },
];

const STEPS = [
  { num: '01', title: 'Add your savings', desc: 'Add your savings in any currency or gold' },
  { num: '02', title: 'See your net worth', desc: 'See your total net worth update in real time' },
  { num: '03', title: 'Track & get alerts', desc: 'Set goals, track progress, and get price alerts' },
];

/* ─── Phone frame with real screenshot ─── */
function ScreenshotPhone({ src, alt, className = '' }) {
  return (
    <div className={`phone-frame ${className}`}>
      <div className="phone-screen">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
      </div>
    </div>
  );
}

/* ─── App Store Badge ─── */
function AppStoreBadge() {
  return (
    <a
      href="#"
      className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-5 py-3 rounded-[13px] transition-colors border border-white/10"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.99 2.97 12.5 4.7 9.45C5.56 7.93 7.13 6.96 8.82 6.94C10.1 6.92 11.31 7.81 12.12 7.81C12.93 7.81 14.38 6.74 15.91 6.91C16.54 6.93 18.33 7.17 19.43 8.82C19.33 8.88 17.22 10.1 17.25 12.63C17.28 15.65 19.89 16.67 19.92 16.68C19.89 16.75 19.5 18.14 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
      </svg>
      <div>
        <div className="text-[10px] font-medium leading-none opacity-80">Download on the</div>
        <div className="text-lg font-semibold leading-tight">App Store</div>
      </div>
    </a>
  );
}

/* ─── Main Landing Component ─── */
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* Scroll animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Nav scroll state */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return (
    <div className="min-h-dvh overflow-x-hidden">
      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'nav-blur border-b border-[var(--c-border)]' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer"
          >
            <img src={logo} alt="Ta7wesha" className="h-28" />
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/privacy')}
              className="text-sm text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="text-sm text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-xl text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[var(--c-surface-h)] transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-[var(--c-emerald)] hover:brightness-110 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              Download <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[var(--c-text-3)]"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden nav-blur border-t border-[var(--c-border)] px-6 py-4 space-y-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="block text-sm text-[var(--c-text-2)] py-2.5 w-full text-left cursor-pointer"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => { setMenuOpen(false); navigate('/privacy'); }}
              className="block text-sm text-[var(--c-text-2)] py-2.5 w-full text-left cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => { setMenuOpen(false); navigate('/terms'); }}
              className="block text-sm text-[var(--c-text-2)] py-2.5 w-full text-left cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="flex items-center gap-2 text-sm text-[var(--c-text-2)] py-2.5 w-full text-left cursor-pointer"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              {dark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-[var(--c-emerald)] text-white text-sm font-semibold px-4 py-2 rounded-xl mt-2"
            >
              Download <ArrowRight size={14} />
            </a>
          </div>
        )}
      </nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 px-4">
        {/* Background effects */}
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div
                data-animate
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-[var(--c-text-3)] mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-emerald)]" />
                Available on the App Store
              </div>

              <h1
                data-animate
                data-animate-delay="1"
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-4"
              >
                <span className="gradient-text">Ta7wesha</span>
              </h1>

              <p
                data-animate
                data-animate-delay="2"
                className="text-xl sm:text-2xl font-semibold text-[var(--c-text-2)] mb-5"
              >
                Your savings, one glance.
              </p>

              <p
                data-animate
                data-animate-delay="3"
                className="text-base text-[var(--c-text-3)] max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                Track your savings across currencies and gold with live exchange rates.
                Private. Free. Beautiful.
              </p>

              <div data-animate data-animate-delay="4">
                <AppStoreBadge />
              </div>
            </div>

            {/* Hero Phone — real screenshot */}
            <div data-animate data-animate-delay="3" className="flex justify-center lg:justify-end">
              <ScreenshotPhone
                src={screenshot1}
                alt="Ta7wesha dashboard showing savings in multiple currencies"
                className="phone-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section id="features" className="relative py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" data-animate>
            <p className="text-sm font-semibold text-[var(--c-emerald)] mb-3 tracking-wide uppercase">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-[var(--c-text-3)] max-w-md mx-auto">
              Powerful tools to track, manage, and grow your savings — all in one app.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                data-animate
                data-animate-delay={String((i % 3) + 1)}
                className="glass glass-hover glow rounded-2xl p-6 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-indigo-500/15 flex items-center justify-center text-[var(--c-emerald)] mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[15px] mb-2">{f.title}</h3>
                <p className="text-[var(--c-text-3)] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ APP PREVIEW ═══════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" data-animate>
            <p className="text-sm font-semibold text-[var(--c-emerald)] mb-3 tracking-wide uppercase">
              Preview
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Beautiful &amp; intuitive
            </h2>
            <p className="text-[var(--c-text-3)] max-w-md mx-auto">
              Designed to give you a clear picture of your finances at a glance.
            </p>
          </div>

          <div className="flex justify-center items-end gap-4 sm:gap-8 lg:gap-12" data-animate>
            {/* Phone 1 — Dashboard */}
            <ScreenshotPhone
              src={screenshot1}
              alt="Dashboard — multi-currency savings overview"
              className="phone-float scale-[0.7] sm:scale-[0.85] lg:scale-100 -rotate-3 hover:rotate-0 transition-transform duration-500"
            />

            {/* Phone 2 — Budget (center, larger) */}
            <div className="hidden sm:block">
              <ScreenshotPhone
                src={screenshot2}
                alt="Budget — goals, income and expenses tracking"
                className="phone-float-d1 scale-90 lg:scale-110 relative z-10"
              />
            </div>

            {/* Phone 3 — Price Alerts */}
            <ScreenshotPhone
              src={screenshot3}
              alt="Price Alerts — set target prices for currencies and gold"
              className="phone-float-d2 scale-[0.7] sm:scale-[0.85] lg:scale-100 rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section id="how-it-works" className="relative py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14" data-animate>
            <p className="text-sm font-semibold text-[var(--c-emerald)] mb-3 tracking-wide uppercase">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Simple as 1-2-3
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                data-animate
                data-animate-delay={String(i + 1)}
                className="text-center sm:text-left"
              >
                <div className="text-5xl font-extrabold gradient-text mb-4 leading-none">{s.num}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-[var(--c-text-3)] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PRIVACY BANNER ═══════════════════════ */}
      <section id="privacy" className="relative py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto" data-animate>
          <div className="relative rounded-3xl overflow-hidden">
            {/* Green glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-indigo-500/5 pointer-events-none" />
            <div className="absolute inset-0 glass pointer-events-none" />

            <div className="relative px-8 py-12 sm:px-14 sm:py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center text-[var(--c-emerald)] mx-auto mb-6">
                <Shield size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                Privacy is not a feature.{' '}
                <span className="gradient-text">It&rsquo;s a promise.</span>
              </h2>
              <p className="text-[var(--c-text-3)] max-w-xl mx-auto text-base leading-relaxed">
                Your financial data never leaves your device. We can&rsquo;t see it, access it,
                or sell it. No account required. No analytics. No ads. Ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ BILINGUAL ═══════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14" data-animate>
            <p className="text-sm font-semibold text-[var(--c-emerald)] mb-3 tracking-wide uppercase">
              Bilingual
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              English &amp; Arabic
            </h2>
            <p className="text-[var(--c-text-3)] max-w-md mx-auto">
              Full English and Arabic (العربية) support with right-to-left layout.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto" data-animate>
            {/* English card */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Languages size={18} className="text-[var(--c-emerald)]" />
                <span className="text-sm font-semibold">English</span>
              </div>
              <div className="bg-[var(--c-surface)] rounded-xl p-4 space-y-2">
                <p className="text-xs text-[var(--c-text-3)]">Total Savings</p>
                <p className="text-lg font-bold">EGP 1,250,000</p>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">USD</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">EUR</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400">Gold</span>
                </div>
              </div>
            </div>

            {/* Arabic card */}
            <div className="glass rounded-2xl p-6" dir="rtl">
              <div className="flex items-center gap-2 mb-4">
                <Languages size={18} className="text-[var(--c-emerald)]" />
                <span className="text-sm font-semibold">العربية</span>
              </div>
              <div className="bg-[var(--c-surface)] rounded-xl p-4 space-y-2">
                <p className="text-xs text-[var(--c-text-3)]">إجمالي المدخرات</p>
                <p className="text-lg font-bold">١٬٢٥٠٬٠٠٠ ج.م</p>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">دولار</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">يورو</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400">ذهب</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center" data-animate>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Start tracking your savings<br />
            <span className="gradient-text">today.</span>
          </h2>
          <p className="text-[var(--c-text-3)] max-w-md mx-auto mb-8">
            Free to download. No account needed. Your data stays yours.
          </p>
          <AppStoreBadge />
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="border-t border-[var(--c-border)] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <img src={logo} alt="Ta7wesha" className="h-28" />
              <p className="text-xs text-[var(--c-text-4)]">&copy; 2026 Ta7wesha. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-6 text-sm text-[var(--c-text-3)]">
              <button onClick={() => navigate('/privacy')} className="hover:text-[var(--c-text)] transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <button onClick={() => navigate('/terms')} className="hover:text-[var(--c-text)] transition-colors cursor-pointer">
                Terms &amp; Conditions
              </button>
              <a
                href="mailto:mazenfayez56@gmail.com"
                className="hover:text-[var(--c-text)] transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/mazen-alahwani-31b693152/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-[var(--c-text-3)] hover:text-[#0A66C2] hover:bg-[var(--c-surface-h)] transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--c-text-4)]">
              Built by Mazen Alahwani
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
