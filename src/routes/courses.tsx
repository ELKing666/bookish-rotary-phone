import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { ArrowLeft, Drama, Globe2, Headphones, Award, BookOpen, Briefcase, Plane, Users, Zap, GraduationCap, Map, Trees, ClipboardCheck, MessagesSquare, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import GB from "country-flag-icons/react/3x2/GB";
import FR from "country-flag-icons/react/3x2/FR";
import ES from "country-flag-icons/react/3x2/ES";
import DE from "country-flag-icons/react/3x2/DE";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import studioImg from "@/assets/courses/studio.jpg";
import outdoorImg from "@/assets/courses/outdoor.jpg";
import listeningImg from "@/assets/courses/listening.jpg";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Language Programs — Noor Academy Chlef" },
      { name: "description", content: "Master English, French, Spanish, or German through drama, outdoor learning, and audiovisual tech at our Chlef center." },
      { property: "og:title", content: "Don't Just Learn a Language—Live It." },
      { property: "og:description", content: "CEFR-certified programs A1–C2 with the Drama Method, outdoor learning and EU-standard multimedia." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { dir, t } = useLang();
  const c = t.coursesPage;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const gallery = [
    { src: studioImg, caption: c.m3T, alt: "Audiovisual studio session at Noor Academy" },
    { src: outdoorImg, caption: c.m2T, alt: "Outdoor language learning activity" },
    { src: listeningImg, caption: c.f1T, alt: "Student in language listening lab" },
  ];

  const openAt = (i: number) => setOpenIdx(i);
  const close = () => setOpenIdx(null);
  const prev = () => setOpenIdx((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length));
  const next = () => setOpenIdx((i) => (i === null ? null : (i + 1) % gallery.length));

  // Mobile autoplay for the gallery strip
  const stripRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    // Only autoplay on mobile (md breakpoint = 768)
    const mq = window.matchMedia("(max-width: 767px)");
    let timer: number | undefined;
    const tick = () => {
      if (!el || pausedRef.current || openIdx !== null || !mq.matches) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-gallery-card]");
      if (!cards.length) return;
      // Find current most-visible card
      const scrollLeft = el.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 12; // gap-3 = 12px
      const currentIdx = Math.round(scrollLeft / cardWidth);
      const nextIdx = (currentIdx + 1) % cards.length;
      // Scroll horizontally only — do NOT use scrollIntoView (it scrolls the page vertically too)
      el.scrollTo({ left: nextIdx * cardWidth, behavior: "smooth" });
    };
    timer = window.setInterval(tick, 3000);

    // Pause autoplay during user interaction, resume after a brief grace period
    // so a swipe instantly moves the user's chosen card without autoplay fighting it.
    let resumeTimer: number | undefined;
    const pause = () => {
      pausedRef.current = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
    };
    const resumeSoon = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => { pausedRef.current = false; }, 4000);
    };
    const onScroll = () => {
      // User-driven scroll (touch/swipe) pauses autoplay briefly
      pause();
      resumeSoon();
    };

    // Fast swipe detection — advance one card on a quick horizontal flick,
    // regardless of how far the user actually scrolled.
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    const onTouchStart = (e: TouchEvent) => {
      pause();
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchStartTime = Date.now();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const dt = Date.now() - touchStartTime;
      resumeSoon();
      // Detect a fast horizontal swipe: short duration, decent distance, mostly horizontal
      const isFastSwipe = dt < 300 && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.5;
      if (!isFastSwipe) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-gallery-card]");
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth + 12;
      const currentIdx = Math.round(el.scrollLeft / cardWidth);
      // In RTL/LTR the visual swipe direction matches dx sign: swipe left (dx<0) = next
      const dirSign = dx < 0 ? 1 : -1;
      const targetIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + dirSign));
      const cardWidth2 = cards[0].offsetWidth + 12;
      el.scrollTo({ left: targetIdx * cardWidth2, behavior: "smooth" });
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resumeSoon);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resumeSoon);
    return () => {
      if (timer) window.clearInterval(timer);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resumeSoon);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resumeSoon);
    };
  }, [openIdx]);




  

  const languages = [
    { code: "en", Flag: GB, name: c.english, icon: Briefcase, accent: "from-blue-500 to-blue-700" },
    { code: "fr", Flag: FR, name: c.french, icon: BookOpen, accent: "from-indigo-500 to-indigo-700" },
    { code: "es", Flag: ES, name: c.spanish, icon: Plane, accent: "from-amber-500 to-orange-600" },
    { code: "de", Flag: DE, name: c.german, icon: Globe2, accent: "from-zinc-600 to-zinc-800" },
  ];

  const methods = [
    { emoji: "🎭", title: c.m1T, desc: c.m1D },
    { emoji: "🌍", title: c.m2T, desc: c.m2D },
    { emoji: "🎧", title: c.m3T, desc: c.m3D },
    { emoji: "🏆", title: c.m4T, desc: c.m4D },
  ];

  const features = [
    { Icon: MessagesSquare, title: c.f1T, desc: c.f1D },
    { Icon: Users, title: c.f2T, desc: c.f2D },
    { Icon: Zap, title: c.f3T, desc: c.f3D },
    { Icon: GraduationCap, title: c.f4T, desc: c.f4D },
    { Icon: Map, title: c.f5T, desc: c.f5D },
    { Icon: Trees, title: c.f6T, desc: c.f6D },
    
  ];

  return (
    <div dir={dir} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="relative bg-gradient-to-br from-primary via-red-800 to-red-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8">
            <ArrowLeft size={16} /> {c.home}
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-[1.05]">
            {c.titleA}<span className="text-gold">{c.titleB}</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/85 max-w-2xl">{c.subtitle}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/25 text-white font-bold hover:bg-white/20 transition">
              {c.bookBtn}
            </a>
          </div>
        </div>
      </header>

      {/* Language Grid */}
      <section id="programs" className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mb-6">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{c.progEyebrow}</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">{c.progTitle}</h2>
        </div>

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {languages.map((l, i) => (
            <article
              key={l.code}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden animate-fade-in"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className={`h-1 bg-gradient-to-r ${l.accent}`} />
              <div className="p-4 flex flex-col items-center text-center">
                <l.Flag className="w-14 h-auto rounded shadow-sm ring-1 ring-black/5 mb-2 transition-transform duration-300 group-hover:scale-110" title={l.name} />
                <h3 className="text-base font-bold text-gray-900">{l.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery — tap to preview */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div ref={stripRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible scroll-smooth">
            {gallery.map((g, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openAt(i)}
                data-gallery-card
                className="group relative shrink-0 w-[78%] sm:w-[60%] md:w-auto snap-start overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={`Open image: ${g.alt}`}
              >
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex items-end justify-between gap-2">
                  <span className="text-white text-sm font-bold drop-shadow line-clamp-2">{g.caption}</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-white/90 text-gray-900 flex items-center justify-center opacity-90 group-hover:opacity-100">
                    <ZoomIn size={16} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-[100vw] sm:max-w-5xl w-full p-0 bg-black/95 border-none shadow-none [&>button]:hidden">
          {openIdx !== null && (
            <div dir="ltr" className="relative flex items-center justify-center min-h-[80vh]">
              <img
                src={gallery[openIdx].src}
                alt={gallery[openIdx].alt}
                className="max-h-[90vh] max-w-full w-auto h-auto object-contain"
              />
              <button onClick={close} aria-label="Close" className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur transition">
                <X size={20} />
              </button>
              <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur transition">
                <ChevronLeft size={22} />
              </button>
              <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur transition">
                <ChevronRight size={22} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-medium">
                {openIdx + 1} / {gallery.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>





      {/* Features — What sets us apart */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{c.featEyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">{c.featTitle}</h2>
          <p className="text-gray-600 mt-3 text-lg leading-relaxed">{c.featIntro}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={i}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <f.Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>

        {/* International exams highlight */}
        <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-7 md:p-9">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gold/20 text-gold items-center justify-center shrink-0">
              <Award size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold mb-1">{c.f7T}</h3>
              <p className="text-white/70 mb-4">{c.examsIntro}</p>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm">
                {[c.exEn, c.exFr, c.exDe, c.exEs].map((line, i) => (
                  <li key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-primary to-red-900 rounded-3xl p-10 md:p-14 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-3">{c.ctaTitle}</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-7">{c.ctaDesc}</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition">
            {c.ctaBtn}
          </a>
        </div>
      </section>
    </div>
  );
}
