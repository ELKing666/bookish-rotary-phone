import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/contexts/LanguageContext";
import { ArrowLeft, GraduationCap, Users, Route as RouteIcon, Shield, ClipboardCheck, Activity, LineChart, BookOpen, Languages, Landmark } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Reinforcement Lessons — Noor Academy Chlef" },
      { name: "description", content: "Tutoring and academic support for Primary, Middle & High School students in Chlef. Specialized BEM & BAC preparation." },
      { property: "og:title", content: "Empowering the Next Generation of Achievers." },
      { property: "og:description", content: "High-quality tutoring and academic support for Primary, Middle, and High School students." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const { dir, t } = useLang();
  const s = t.support;

  const levels = [
    { emoji: "🌱", title: s.l1Title, tag: s.l1Tag, points: [s.l1p1, s.l1p2], accent: "from-emerald-500 to-emerald-700" },
    { emoji: "🌉", title: s.l2Title, tag: s.l2Tag, points: [s.l2p1, s.l2p2], accent: "from-blue-500 to-indigo-700" },
    { emoji: "🎯", title: s.l3Title, tag: s.l3Tag, points: [s.l3p1, s.l3p2], accent: "from-amber-500 to-orange-600" },
  ];

  const advantages = [
    { icon: GraduationCap, emoji: "🎓", title: s.a1T, desc: s.a1D },
    { icon: Users, emoji: "📉", title: s.a2T, desc: s.a2D },
    { icon: RouteIcon, emoji: "🔄", title: s.a3T, desc: s.a3D },
    { icon: Shield, emoji: "🛡️", title: s.a4T, desc: s.a4D },
  ];

  const methodology = [
    { icon: ClipboardCheck, title: s.m1T, desc: s.m1D },
    { icon: Activity, title: s.m2T, desc: s.m2D },
    { icon: LineChart, title: s.m3T, desc: s.m3D },
  ];

  const subjects = [
    { icon: BookOpen, title: s.s1T, items: s.s1Items },
    { icon: Languages, title: s.s2T, items: s.s2Items },
    { icon: Landmark, title: s.s3T, items: s.s3Items },
  ];

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
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition">
              {s.ctaEnroll}
            </a>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{s.levelsEyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">{s.levelsTitle}</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {levels.map((lv, i) => (
            <article
              key={lv.title}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden animate-fade-in"
              style={{ animationDelay: `${i * 120}ms`, animationFillMode: "forwards" }}
            >
              <div className={`h-2 bg-gradient-to-r ${lv.accent}`} />
              <div className="p-7">
                <div className="text-5xl mb-4">{lv.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900">{lv.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mt-1">{lv.tag}</p>
                <ul className="mt-4 space-y-2 text-gray-600 text-sm leading-relaxed">
                  {lv.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>


      <section className="bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{s.advEyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">{s.advTitle}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {advantages.map((a, i) => (
              <div key={a.title} className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="absolute -top-3 left-6 text-xs font-black text-primary/30">0{i + 1}</div>
                <div className="text-4xl mb-4">{a.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{s.methEyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">{s.methTitle}</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {methodology.map((m, i) => (
            <div key={m.title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black">{i + 1}</div>
                <m.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{m.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="subjects" className="bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{s.subjEyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">{s.subjTitle}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {subjects.map((sub) => (
              <div key={sub.title} className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6">
                <sub.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{sub.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{sub.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-primary to-red-900 rounded-3xl p-10 md:p-14 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-3">{s.finalTitle}</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-7">{s.finalDesc}</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition">
            {s.finalBtn}
          </a>
        </div>
      </section>
    </div>
  );
}
