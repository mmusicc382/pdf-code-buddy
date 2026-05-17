import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hand, Mic, Languages, Sparkles, Play } from "lucide-react";
import heroImg from "@/assets/isl-hero.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-display text-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-saffron-gradient" />
            Saanket
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#story" className="hover:text-foreground transition-colors">Story</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/signin")} className="hidden sm:inline-flex">Sign in</Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5"
            >
              Try the demo <ArrowRight className="ml-1" />
            </Button>
          </div>
        </nav>
      </header>

      {/* HERO — split screen */}
      <section className="pt-28 lg:pt-32 pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 animate-slide-up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Real-time ISL translation
            </span>

            <h1 className="font-display text-balance text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight">
              A bridge<br />
              between <em className="italic text-accent">silence</em><br />
              and sound.
            </h1>

            <p className="max-w-xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Saanket translates Indian Sign Language into text and voice — and back — in real time.
              Built for classrooms, clinics, and conversations that finally feel effortless.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="xl"
                onClick={() => navigate("/dashboard")}
                className="bg-saffron-gradient text-accent-foreground hover:opacity-90 rounded-full shadow-glow px-8"
              >
                <Play className="mr-1" /> Start translating
              </Button>
              <Button
                size="xl"
                variant="ghost"
                onClick={() => navigate("/signup")}
                className="rounded-full underline-offset-4 hover:underline"
              >
                Create an account
              </Button>
            </div>

            <dl className="grid grid-cols-3 gap-6 pt-10 max-w-lg">
              {[
                ["98%", "Sign accuracy"],
                ["<120ms", "Avg. latency"],
                ["12+", "Indian languages"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-3xl text-foreground">{k}</dt>
                  <dd className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right portrait */}
          <div className="lg:col-span-5 relative animate-fade-in">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-elegant">
              <img
                src={heroImg}
                alt="A woman signing in Indian Sign Language, lit in warm saffron tones"
                width={1024}
                height={1280}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              {/* Floating caption card */}
              <div className="absolute left-5 right-5 bottom-5 bg-background/90 backdrop-blur rounded-2xl p-4 shadow-elegant animate-float">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Live transcription
                </div>
                <p className="font-display text-xl leading-tight">
                  "नमस्ते — how can I help you today?"
                </p>
              </div>
            </div>
            {/* decorative blob */}
            <div className="absolute -z-10 -top-8 -right-8 w-56 h-56 rounded-full bg-saffron-gradient blur-3xl opacity-40" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-border bg-card/40 py-5 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap font-display text-2xl text-muted-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 px-6">
              {["Hindi", "English", "Tamil", "Bengali", "Marathi", "Telugu", "Kannada", "Gujarati", "Punjabi", "Malayalam", "Odia", "Urdu"].map((l) => (
                <span key={l + i} className="flex items-center gap-12">
                  {l} <span className="text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 lg:py-32 bg-warm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 mb-16">
            <h2 className="lg:col-span-6 font-display text-5xl lg:text-7xl leading-[0.95]">
              Three gestures.<br /><em className="italic text-accent">One conversation.</em>
            </h2>
            <p className="lg:col-span-5 lg:col-start-8 text-lg text-muted-foreground self-end">
              No special gloves. No wearables. Just a camera, a microphone, and a model trained on the rich vocabulary of Indian Sign Language.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: Hand, t: "Sign", d: "Show a sign to your camera. Our vision model reads hand shape, motion and facial cues." },
              { n: "02", icon: Languages, t: "Translate", d: "Sequences are mapped to ISL grammar then converted into natural Indian-language text." },
              { n: "03", icon: Mic, t: "Speak", d: "Hear the translation in a clear human voice — or reverse the flow to sign back." },
            ].map((s) => (
              <article key={s.n} className="group relative bg-card border border-border rounded-3xl p-8 hover:shadow-elegant transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-10">
                  <span className="font-display text-5xl text-accent">{s.n}</span>
                  <s.icon className="w-7 h-7 text-foreground/70 group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-display text-3xl mb-2">{s.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — bento */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4">What you get</p>
            <h2 className="font-display text-5xl lg:text-6xl leading-[0.95]">
              Built for the <em className="italic">moments</em> that matter most.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 md:row-span-2 bg-hero text-primary-foreground rounded-3xl p-10 lg:p-12 relative overflow-hidden min-h-[420px]">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-accent">Live mode</span>
                <div>
                  <h3 className="font-display text-4xl lg:text-5xl leading-tight mb-4">
                    Real-time captions for every classroom, clinic and counter.
                  </h3>
                  <p className="text-primary-foreground/70 max-w-md">
                    Open Saanket on any device. Captions appear as you sign — no waiting, no editing.
                  </p>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-saffron-gradient blur-3xl opacity-50" />
            </div>

            <div className="bg-card border border-border rounded-3xl p-8">
              <Mic className="w-6 h-6 text-accent mb-6" />
              <h3 className="font-display text-2xl mb-2">Voice → Sign</h3>
              <p className="text-muted-foreground text-sm">Speak naturally and watch an avatar sign back in fluent ISL.</p>
            </div>

            <div className="bg-foreground text-background rounded-3xl p-8">
              <Languages className="w-6 h-6 text-accent mb-6" />
              <h3 className="font-display text-2xl mb-2">12 Indian languages</h3>
              <p className="text-background/70 text-sm">Hindi, Tamil, Bengali, Marathi & more — translated with native context.</p>
            </div>

            <div className="md:col-span-3 bg-secondary rounded-3xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-3xl lg:text-4xl mb-2">Private by design.</h3>
                <p className="text-muted-foreground max-w-xl">Video frames are processed on-device whenever possible. Nothing is stored unless you ask us to.</p>
              </div>
              <Button onClick={() => navigate("/signup")} className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
                Get started <ArrowRight className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="py-24 lg:py-32 bg-foreground text-background">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-6">Our story</p>
          <blockquote className="font-display italic text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-balance">
            "There are 63 million people in India with hearing loss. Saanket exists so a sign is never lost in translation again."
          </blockquote>
          <p className="mt-10 text-background/60 text-sm uppercase tracking-[0.2em]">— The Saanket team</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-warm">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-8">
            Start the <em className="italic text-accent">conversation</em>.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Try Saanket free. Sign in, point your camera, and watch silence become sound.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="xl" onClick={() => navigate("/dashboard")} className="bg-saffron-gradient text-accent-foreground rounded-full px-8 shadow-glow">
              Try the live demo
            </Button>
            <Button size="xl" variant="outline" onClick={() => navigate("/signup")} className="rounded-full border-foreground/20">
              Create free account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="font-display text-lg text-foreground">Saanket</p>
          <p>© {new Date().getFullYear()} Saanket. Made in India with care.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
