import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Users, GraduationCap, Award, Target, CheckCircle, Phone, Mail, MapPin,
  Globe, ChevronDown, BookOpen, Bot, FlaskConical, Calculator, Code,
  Music, Palette, Microscope, Pencil, Lightbulb, Star, Brain, Atom,
  Trophy, Rocket, Home as HomeIcon, HelpCircle, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLang } from "@/contexts/LanguageContext";
import { LANGUAGES } from "@/lib/i18n";
import { useCourses, useFaq, useContactInfo, type Course } from "@/hooks/use-content";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({ component: HomePage });

const ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap, BookOpen, Globe, Bot, FlaskConical, Calculator, Code,
  Music, Palette, Microscope, Pencil, Lightbulb, Star, Brain, Atom, Trophy, Rocket, Award,
};

function CourseIcon({ icon, className = "w-12 h-12" }: { icon?: string; className?: string }) {
  const Icon = (icon && ICON_MAP[icon]) || BookOpen;
  return <Icon className={className} />;
}

function LanguageDropdown() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const cur = LANGUAGES.find((l) => l.code === lang)!;
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
        aria-expanded={open}
        className="flex items-center gap-2 text-white hover:text-gold transition-colors font-semibold text-sm md:text-sm px-3.5 md:px-3 py-2.5 md:py-2 min-h-11 md:min-h-0 rounded-xl border border-white/25 md:border-white/15 bg-white/10 md:bg-white/5 hover:bg-white/15 backdrop-blur-sm"
      >
        <Globe size={16} className="opacity-90" />
        <span className="leading-none">{cur.label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 end-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full text-start px-4 py-3 min-h-12 rounded-xl text-base md:text-sm transition-colors flex items-center justify-between gap-3 ${l.code === lang ? "text-primary font-bold bg-red-50" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <span>{l.label}</span>
              {l.code === lang && <CheckCircle size={16} className="text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let s = 0;
        const t = setInterval(() => {
          s += target / 60;
          if (s >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(s));
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t, dir } = useLang();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav dir={dir} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary/90 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center">
          <img src="/images/logo-wordmark.png" alt="Noor Academy" className="h-12 md:h-14 w-auto object-contain" />
        </a>
        <div className="hidden md:flex items-center gap-5 text-white font-medium">
          <a href="#hero" className="hover:text-gold transition-colors text-sm">{t.nav.home}</a>
          <a href="#about" className="hover:text-gold transition-colors text-sm">{t.nav.about}</a>
          <div className="relative group">
            <button className="hover:text-gold transition-colors text-sm inline-flex items-center gap-1">
              {t.nav.courses}
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[240px]">
                <Link to="/courses" className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-primary/5 hover:text-primary font-medium">{t.courses.langTitle}</Link>
                <Link to="/it-skills" className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-primary/5 hover:text-primary font-medium">{t.courses.itTitle}</Link>
                <Link to="/support" className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-primary/5 hover:text-primary font-medium">{t.courses.supportTitle}</Link>
              </div>
            </div>
          </div>
          <a href="#testimonials" className="hover:text-gold transition-colors text-sm">{t.nav.testimonials}</a>
          <a href="#faq" className="hover:text-gold transition-colors text-sm">{t.nav.faq}</a>
          <a href="#branches" className="hover:text-gold transition-colors text-sm">{t.nav.branches}</a>
          <LanguageDropdown />
          <Button asChild className="bg-gold text-primary hover:bg-gold-dark font-bold">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">{t.nav.contact}</a>
          </Button>
        </div>
        <div className="md:hidden"><LanguageDropdown /></div>
      </div>
    </nav>
  );
}

function BottomTabBar() {
  const { t } = useLang();
  const [active, setActive] = useState("hero");
  const tabs = [
    { id: "hero", icon: HomeIcon, label: t.nav.home },
    { id: "courses", icon: BookOpen, label: t.nav.courses },
    { id: "branches", icon: MapPin, label: t.nav.branches },
    { id: "faq", icon: HelpCircle, label: t.nav.faq },
    { id: "contact", icon: Phone, label: t.nav.contact },
  ];
  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver((entries) => {
      const v = entries.filter((e) => e.isIntersecting);
      if (v.length) {
        const top = v.reduce((a, b) => a.boundingClientRect.top < b.boundingClientRect.top ? a : b);
        setActive((top.target as HTMLElement).id);
      }
    }, { threshold: 0.3 });
    els.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-t border-white/10 flex items-stretch" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map(({ id, icon: Icon, label }) => {
        const a = active === id;
        return (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all ${a ? "text-gold" : "text-white/60"}`}>
            <Icon size={20} strokeWidth={a ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold leading-tight">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Hero() {
  const { t } = useLang();
  return (
    <section id="hero" className="min-h-screen relative flex flex-col items-center justify-center pt-20 bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-gold/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none animate-pulse" />
      <div className="container mx-auto px-4 relative z-10 text-center text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          {t.hero.title} <span className="text-gold">{t.hero.brand}</span>
        </h1>
        <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">{t.hero.subtitle}</p>
        <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-dark font-bold text-xl px-10 py-6 rounded-full shadow-lg">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">{t.hero.cta}</a>
        </Button>
      </div>
    </section>
  );
}

function About() {
  const { t } = useLang();
  const cards = [
    { icon: <Users className="w-7 h-7 text-white" />, target: 1000, suffix: "+", label: t.about.stat1, gradient: "from-blue-500 to-blue-700" },
    { icon: <GraduationCap className="w-7 h-7 text-white" />, target: 50, suffix: "+", label: t.about.stat2, gradient: "from-emerald-500 to-emerald-700" },
    { icon: <Award className="w-7 h-7 text-white" />, target: 15, suffix: "+", label: t.about.stat3, gradient: "from-yellow-500 to-yellow-700" },
    { icon: <Target className="w-7 h-7 text-white" />, target: 20, suffix: "+", label: t.about.stat4, gradient: "from-primary to-red-800" },
  ];
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.about.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.about.desc}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <Card key={i} className="text-center border-none shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="pt-6 pb-6 px-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>{c.icon}</div>
                <div className="text-2xl font-black text-gray-900 mb-1"><AnimatedCounter target={c.target} suffix={c.suffix} /></div>
                <div className="text-sm text-muted-foreground font-medium">{c.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const { t } = useLang();
  const parts = course.price.split(" / ");
  return (
    <div className={`relative bg-white rounded-2xl flex flex-col transition-all duration-300 ${course.is_featured ? "border-2 border-primary shadow-2xl md:scale-105 z-10" : "border border-gray-100 shadow-md"}`}>
      {course.is_featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">{t.courses.popular}</span>
        </div>
      )}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-center mb-4 text-primary"><CourseIcon icon={course.icon} /></div>
        <h3 className="text-xl font-bold text-center text-gray-900 mb-3">{course.title}</h3>
        <div className="text-center mb-6">
          <span className="text-3xl font-black text-primary">{parts[0]}</span>
          {parts[1] && <span className="text-gray-400 text-sm"> / {parts[1]}</span>}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 text-center">{course.description}</p>
        {course.duration && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
            <CheckCircle size={16} className="text-primary" />
            <span>{course.duration}</span>
          </div>
        )}
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${course.is_featured ? "bg-primary text-white hover:bg-primary/90 shadow-lg" : "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary"}`}>
          {t.courses.enroll}
        </a>
        <Link to="/courses/$id" params={{ id: course.id }} className="block text-center text-primary text-xs font-semibold mt-3 hover:underline">
          {t.courses.learnMore}
        </Link>
      </div>
    </div>
  );
}

function CoursesGrid() {
  const [tab, setTab] = useState("adults");
  const { data: courses, isLoading } = useCourses();
  const { t } = useLang();
  const all = courses ?? [];
  const adults = all.filter((c) => c.category === "adults");
  const kids = all.filter((c) => c.category === "kids");
  const tabs = [
    ...(adults.length ? [{ id: "adults", label: t.courses.adultsTab }] : []),
    ...(kids.length ? [{ id: "kids", label: t.courses.kidsTab }] : []),
  ];
  const active = tabs.some((x) => x.id === tab) ? tab : (tabs[0]?.id ?? "adults");
  const list = active === "adults" ? adults : kids;
  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">{t.courses.badge}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.courses.title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t.courses.desc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
          <Link to="/courses" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-8 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-2xl font-bold mb-2">{t.courses.langTitle}</h3>
            <p className="text-white/90 text-sm mb-4">{t.courses.langDesc}</p>
            <span className="inline-flex items-center gap-1 font-semibold text-sm">{t.courses.langCta} <span className="group-hover:translate-x-1 transition-transform">→</span></span>
          </Link>
          <Link to="/it-skills" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 p-8 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="text-4xl mb-3">💻</div>
            <h3 className="text-2xl font-bold mb-2">{t.courses.itTitle}</h3>
            <p className="text-white/90 text-sm mb-4">{t.courses.itDesc}</p>
            <span className="inline-flex items-center gap-1 font-semibold text-sm">{t.courses.itCta} <span className="group-hover:translate-x-1 transition-transform">→</span></span>
          </Link>
          <Link to="/support" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="text-2xl font-bold mb-2">{t.courses.supportTitle}</h3>
            <p className="text-white/90 text-sm mb-4">{t.courses.supportDesc}</p>
            <span className="inline-flex items-center gap-1 font-semibold text-sm">{t.courses.supportCta} <span className="group-hover:translate-x-1 transition-transform">→</span></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

const REVIEWS_DRIVE_ID = "1FZWLh56OimAPSN0bBCCxd-CP6Jgk3Sgx";

function Testimonials() {
  const { t } = useLang();
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.testimonials.title}</h2>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-50">
          <iframe
            src={`https://drive.google.com/file/d/${REVIEWS_DRIVE_ID}/preview`}
            className="w-full h-[600px] md:h-[720px]"
            allow="autoplay"
            title="Reviews"
          />
        </div>
        <div className="text-center mt-8">
          <a
            href={`https://drive.google.com/file/d/${REVIEWS_DRIVE_ID}/view`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            {t.testimonials.viewAll}
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { data, isLoading } = useFaq();
  const { t, lang } = useLang();
  const pick = (item: any, base: "question" | "answer") =>
    (lang !== "ar" && item[`${base}_${lang}`]) || item[base];
  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.faq.title}</h2>
        </div>
        {isLoading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {(data ?? []).map((item: any) => (
              <AccordionItem key={item.id} value={item.id} className="bg-white px-6 rounded-lg mb-4 border shadow-sm">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary py-4 text-start">{pick(item, "question")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">{pick(item, "answer")}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}

function Branches() {
  const { t } = useLang();
  const branches = [
    { name: t.branches.branch1, address: "Hay Arroudj, Centre des Affaires Erriadh N°02, Chlef", maps: "https://maps.app.goo.gl/sHU7mRKx5rNMk89SA", uc: false },
    { name: t.branches.branch2, address: "Hay Arroudj, Centre des Affaires Erriadh N°02, Chlef", maps: "https://maps.app.goo.gl/PqruSFBzrdkExpy89", uc: false },
    { name: t.branches.branch3, address: "", maps: "", uc: true },
  ];
  return (
    <section id="branches" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.branches.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.branches.desc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {branches.map((b, i) => (
            <div key={i} className={`relative bg-white rounded-2xl p-7 shadow-md border flex flex-col gap-4 ${b.uc ? "border-amber-200 opacity-80" : "border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all"}`}>
              {b.uc && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />{t.branches.underConstruction}
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${b.uc ? "bg-amber-50" : "bg-red-50"}`}>
                  <MapPin size={22} className={b.uc ? "text-amber-500" : "text-primary"} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{b.name}</h3>
              </div>
              <p className={`text-sm leading-relaxed flex-1 ${b.address ? "text-gray-600" : "text-gray-400 italic"}`}>{b.address || "— —"}</p>
              {b.uc ? (
                <span className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-semibold text-sm py-2.5 px-5 rounded-xl"><MapPin size={16} />{t.branches.mapsBtn}</span>
              ) : (
                <a href={b.maps} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm py-2.5 px-5 rounded-xl shadow">
                  <MapPin size={16} />{t.branches.mapsBtn}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { data: ci } = useContactInfo();
  const { t } = useLang();

  const items = [
    { icon: <Phone size={26} className="text-white" />, title: t.contact.phone, info: ci?.phone ?? "0770 764 200", dir: "ltr" as const, gradient: "from-blue-500 to-blue-700" },
    { icon: <Mail size={26} className="text-white" />, title: t.contact.email, info: ci?.email ?? "nooracademyalgeria@gmail.com", gradient: "from-primary to-red-700" },
    { icon: <MapPin size={26} className="text-white" />, title: t.contact.address, info: ci?.address ?? "Chlef, Algérie", gradient: "from-emerald-500 to-emerald-700" },
  ];
  return (
    <section id="contact" className="py-20 bg-white border-t">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">{t.contact.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          {items.map((it, i) => (
            <div key={i} className="flex flex-col items-center p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${it.gradient} flex items-center justify-center mb-4 shadow-lg`}>{it.icon}</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">{it.title}</h3>
              <p className="text-gray-800 font-semibold text-base whitespace-pre-line" dir={it.dir}>{it.info}</p>
            </div>
          ))}
        </div>
        <div className="max-w-lg mx-auto">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-lg h-14 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            {t.nav.contact}
          </a>
        </div>
        <div className="max-w-lg mx-auto mt-8 bg-gray-50 rounded-2xl px-8 py-6 shadow-md border border-gray-100 flex flex-col items-center gap-4">
          <p className="text-base font-bold text-gray-600 tracking-wide">{t.contact.followUs}</p>
          <div className="flex gap-5">
            <a href="https://www.instagram.com/noor_academyalgeria" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow hover:scale-110 transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com/NoorAcademy.Algeria/" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow hover:scale-110 transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/channel/UC6HwVZGpRGfOhv_dpVarcbA" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow hover:scale-110 transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { data: ci } = useContactInfo();
  const { t } = useLang();
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold mb-4"><span className="text-white">{t.brandFirst}</span> <span className="text-gold">{t.brandSecond}</span></div>
            <p className="text-white/80 max-w-sm">{t.footer.tagline}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6 text-gold">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li><a href="#hero" className="text-white/80 hover:text-white">{t.nav.home}</a></li>
              <li><a href="#about" className="text-white/80 hover:text-white">{t.nav.about}</a></li>
              <li><a href="#courses" className="text-white/80 hover:text-white">{t.footer.ourCourses}</a></li>
              <li><a href="#faq" className="text-white/80 hover:text-white">{t.nav.faq}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6 text-gold">{t.footer.contactCol}</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center gap-2"><MapPin size={18} className="text-gold" /> {ci?.address ?? "Chlef, Algérie"}</li>
              <li className="flex items-start gap-2"><Phone size={18} className="text-gold mt-1 shrink-0" /> <span dir="ltr" className="whitespace-pre-line">{ci?.phone ?? "0770 764 200"}</span></li>
              <li className="flex items-center gap-2"><Mail size={18} className="text-gold" /> {ci?.email ?? "contact@nour-academy.dz"}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  const { dir } = useLang();
  return (
    <div className="min-h-screen bg-background overflow-x-hidden pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0" dir={dir}>
      <Navbar />
      <Hero />
      <About />
      <CoursesGrid />
      <Testimonials />
      <FAQSection />
      <Branches />
      <ContactSection />
      <Footer />
      <a href="https://api.whatsapp.com/send?phone=213770764200&text=%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1" target="_blank" rel="noreferrer"
        className="fixed start-6 z-50 w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:scale-110 transition-transform"
        style={{ background: "#25D366", bottom: "calc(4rem + env(safe-area-inset-bottom) + 0.75rem)" }} aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <BottomTabBar />
    </div>
  );
}
