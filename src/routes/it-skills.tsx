import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { ArrowLeft, Monitor, BarChart3, Globe, FileText, CheckCircle2, Award, Users, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import designClassImg from "@/assets/it/design-class.jpg";
import focusedStudentImg from "@/assets/it/focused-student.jpg";
import wordCvImg from "@/assets/it/word-cv.jpg";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/it-skills")({
  head: () => ({
    meta: [
      { title: "IT & Digital Skills Academy — Noor Academy Chlef" },
      { name: "description", content: "Practical IT training in Chlef: Data Entry, Advanced Excel, Web Development, and the Essential Office Suite. Earn a Certificate of Proficiency." },
      { property: "og:title", content: "IT Skills Are No Longer an Option — They're a Necessity." },
      { property: "og:description", content: "Hands-on IT training programs designed to help you excel in the job market." },
    ],
  }),
  component: ITSkillsPage,
});

function ITSkillsPage() {
  const { dir, t } = useLang();
  const s = t.itSkills;

  const tracks = [
    { icon: Monitor, emoji: "💻", title: s.track1Title, subtitle: s.track1Sub, desc: s.track1Desc, accent: "from-blue-500 to-blue-700" },
    { icon: BarChart3, emoji: "📊", title: s.track2Title, subtitle: s.track2Sub, desc: s.track2Desc, accent: "from-emerald-500 to-emerald-700" },
    { icon: Globe, emoji: "🌐", title: s.track3Title, subtitle: s.track3Sub, desc: s.track3Desc, accent: "from-indigo-500 to-purple-600" },
    { icon: FileText, emoji: "🖥️", title: s.track4Title, subtitle: s.track4Sub, desc: s.track4Desc, accent: "from-amber-500 to-orange-600" },
  ];

  const reasons = [
    { icon: CheckCircle2, title: s.reason1Title, desc: s.reason1Desc },
    { icon: Users, title: s.reason2Title, desc: s.reason2Desc },
    { icon: Award, title: s.reason3Title, desc: s.reason3Desc },
    { icon: Sparkles, title: s.reason4Title, desc: s.reason4Desc },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const gallery = [
    { src: designClassImg, caption: s.track3Title, alt: "Web development and design class" },
    { src: focusedStudentImg, caption: s.track2Title, alt: "Student focused on laptop" },
    { src: wordCvImg, caption: s.track4Title, alt: "Office suite class — designing a CV in Word" },
  ];
  const openAt = (i: number) => setOpenIdx(i);
  const close = () => setOpenIdx(null);
  const prev = () => setOpenIdx((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length));
  const next = () => setOpenIdx((i) => (i === null ? null : (i + 1) % gallery.length));

  const stripRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const tick = () => {
      if (!el || pausedRef.current || openIdx !== null || !mq.matches) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-gallery-card]");
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth + 12;
      const currentIdx = Math.round(el.scrollLeft / cardWidth);
      const nextIdx = (currentIdx + 1) % cards.length;
      el.scrollTo({ left: nextIdx * cardWidth, behavior: "smooth" });
    };
    const timer = window.setInterval(tick, 3000);

    let resumeTimer: number | undefined;
    const pause = () => {
      pausedRef.current = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
    };
    const resumeSoon = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => { pausedRef.current = false; }, 4000);
    };
    const onScroll = () => { pause(); resumeSoon(); };

    let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
    const onTouchStart = (e: TouchEvent) => {
      pause();
      const t = e.touches[0];
      touchStartX = t.clientX; touchStartY = t.clientY; touchStartTime = Date.now();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const dt = Date.now() - touchStartTime;
      resumeSoon();
      const isFastSwipe = dt < 300 && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.5;
      if (!isFastSwipe) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-gallery-card]");
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth + 12;
      const currentIdx = Math.round(el.scrollLeft / cardWidth);
      const dirSign = dx < 0 ? 1 : -1;
      const targetIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + dirSign));
      el.scrollTo({ left: targetIdx * cardWidth, behavior: "smooth" });
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resumeSoon);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resumeSoon);
    return () => {
      window.clearInterval(timer);
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



  return (
    <div dir={dir} className="min-h-screen bg-gray-50">
      <header className="relative bg-gradient-to-br from-primary via-red-800 to-red-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8">
            <ArrowLeft size={16} /> {s.home}
          </Link>
          <p className="text-sm font-bold text-gold uppercase tracking-wider mb-3">{s.eyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-[1.05]">
            {s.titleA}<span className="text-gold">{s.titleB}</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/85 max-w-2xl">{s.subtitle}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/25 text-white font-bold hover:bg-white/20 transition">
              {s.enrollBtn}
            </a>
          </div>
        </div>
      </header>

      <section id="tracks" className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{s.tracksEyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">{s.tracksTitle}</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {tracks.map((tr, i) => (
            <article
              key={tr.title}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden animate-fade-in"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className={`h-2 bg-gradient-to-r ${tr.accent}`} />
              <div className="p-7 flex gap-5">
                <div className="text-5xl shrink-0">{tr.emoji}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{tr.title}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mt-1">{tr.subtitle}</p>
                  <p className="text-gray-600 mt-3 leading-relaxed">{tr.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery — tap to preview */}
      <section className="pb-6 md:pb-10">
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
                  <img src={g.src} alt={g.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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

      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-[100vw] sm:max-w-5xl w-full p-0 bg-black/95 border-none shadow-none [&>button]:hidden">
          {openIdx !== null && (
            <div dir="ltr" className="relative flex items-center justify-center min-h-[80vh]">
              <img src={gallery[openIdx].src} alt={gallery[openIdx].alt} className="max-h-[90vh] max-w-full w-auto h-auto object-contain" />
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

      <section className="bg-white border-y border-gray-100">

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{s.whyEyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">{s.whyTitle}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r, i) => (
              <div key={r.title} className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="absolute -top-3 left-6 text-xs font-black text-primary/30">0{i + 1}</div>
                <r.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-primary to-red-900 rounded-3xl p-10 md:p-14 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-3">{s.ctaTitle}</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-7">{s.ctaDesc}</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition">
            {s.ctaBtn}
          </a>
        </div>
      </section>
    </div>
  );
}
