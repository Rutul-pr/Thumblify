import { Sparkles, Wand2, Gauge, ShieldCheck } from "lucide-react";
import SoftBackdrop from "../components/SoftBackdrop";

const cards = [
  {
    title: "AI-first generation",
    description: "Generate scroll-stopping thumbnails in seconds with style, ratio, and color presets.",
    icon: Wand2,
  },
  {
    title: "Creator focused workflow",
    description: "From idea to preview to saved history, every step is optimized for YouTube creators.",
    icon: Gauge,
  },
  {
    title: "Reliable quality",
    description: "Strong prompts, smart defaults, and clean output handling for production-ready images.",
    icon: ShieldCheck,
  },
];

const About = () => {
  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <section className="p-6 sm:p-8 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
            <div className="inline-flex items-center gap-2 text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-full px-3 py-1 text-xs sm:text-sm">
              <Sparkles className="size-4" />
              Built for modern creators
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-zinc-100">
              About Thumblify
            </h1>
            <p className="mt-4 text-zinc-300 max-w-3xl leading-relaxed">
              Hi, I am Rutul. Thumblify is a sample college project built to solve a real creator problem: generating
              engaging thumbnail ideas quickly. You choose the style, ratio, and color scheme, and the app creates
              visuals that align with your title and audience intent.
            </p>
            <p className="mt-3 text-zinc-400 max-w-3xl leading-relaxed">
              This project reflects my focus on practical UI design, clean backend integration, and smooth user
              experience. The goal is simple: help creators spend less time designing and more time creating content.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-4 mt-6">
            {cards.map(({ title, description, icon: Icon }) => (
              <article key={title} className="p-5 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
                <div className="size-10 rounded-xl bg-pink-500/15 border border-pink-500/25 grid place-items-center text-pink-400">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-zinc-100">{title}</h2>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{description}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 p-6 sm:p-8 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
            <h3 className="text-xl font-semibold text-zinc-100">How it works</h3>
            <ol className="mt-4 space-y-3 text-zinc-300">
              <li>1. Enter your video title and optional prompt details.</li>
              <li>2. Select style, aspect ratio, and color theme.</li>
              <li>3. Generate and preview your thumbnail, then iterate quickly.</li>
            </ol>
          </section>
        </main>
      </div>
    </>
  );
};

export default About;
