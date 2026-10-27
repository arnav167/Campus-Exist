import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  Leaf,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { StatusBadge } from "@/components/common/page-parts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusExist — Your campus essentials hub" },
      {
        name: "description",
        content:
          "Buy, sell, borrow and recover college essentials with students at IILM University.",
      },
      { property: "og:title", content: "CampusExist — Your campus essentials hub" },
      {
        property: "og:description",
        content: "Buy, sell, borrow and recover college essentials with fellow students.",
      },
    ],
  }),
  component: Home,
});

const DESCRIPTIONS: Record<string, string> = {
  "/marketplace": "Find affordable books, calculators, lab gear and campus essentials.",
  "/lost-found": "Help a lost item find its way back to its owner.",
  "/borrowing": "Borrow what you need and keep track of returns.",
  "/belongings": "Keep a private inventory of the things you own.",
  "/help": "Simple tips for safer, smarter campus sharing.",
};

const CARD_STYLES: Record<string, string> = {
  "/marketplace": "bg-orange-50 text-orange-700 ring-orange-100",
  "/lost-found": "bg-rose-50 text-rose-700 ring-rose-100",
  "/borrowing": "bg-violet-50 text-violet-700 ring-violet-100",
  "/belongings": "bg-teal-50 text-teal-700 ring-teal-100",
  "/help": "bg-sky-50 text-sky-700 ring-sky-100",
};

function Home() {
  return (
    <div className="home-page space-y-12 md:space-y-16">
      <section className="home-hero relative isolate overflow-hidden rounded-[2rem] px-6 py-9 text-white shadow-xl shadow-violet-950/10 sm:px-9 sm:py-12 lg:px-14 lg:py-16">
        <div aria-hidden className="hero-orb hero-orb-one" />
        <div aria-hidden className="hero-orb hero-orb-two" />
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-200" aria-hidden />
              Your campus, shared smarter
            </div>
            <p className="text-sm font-medium text-violet-100">IILM University · Greater Noida</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Good campus finds. <span className="text-amber-200">Better together.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Need a book for one class or a calculator for exam week? Find it, borrow it, pass it on — all with your campus community.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-amber-300 px-6 font-bold text-violet-950 shadow-md shadow-violet-950/15 hover:bg-amber-200">
                <Link to="/marketplace">
                  Explore marketplace <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white">
                <Link to="/lost-found">Lost something? Find it <SearchCheck className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-violet-100">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-200" /> Campus-first community</span>
              <span className="inline-flex items-center gap-2"><Leaf className="h-4 w-4 text-emerald-200" /> Reuse more, waste less</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none" aria-label="Examples of items students can share">
            <div className="hero-sticker hero-sticker-book absolute -left-1 top-4 z-10 rotate-[-8deg] sm:-left-5">
              <BookOpen className="h-5 w-5" /> <span>Pass it on</span>
            </div>
            <div className="hero-item-card relative ml-auto w-[88%] rotate-[3deg] rounded-3xl bg-white p-4 text-slate-900 shadow-2xl shadow-violet-950/25 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 sm:h-16 sm:w-16">
                  <BookOpen className="h-8 w-8" aria-hidden />
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Ready to share</span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Campus essentials</p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">One item, more possibilities.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Books, lab tools, calculators and little things that make student life easier.</p>
              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-violet-700">
                Made for student-to-student sharing <ArrowDownRight className="h-4 w-4" />
              </div>
            </div>
            <div className="hero-float-card absolute -bottom-5 left-0 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-3 text-slate-900 shadow-xl sm:-left-2 sm:p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><HeartHandshake className="h-5 w-5" /></span>
              <span><strong className="block text-sm">Share the good stuff</strong><span className="text-xs text-slate-500">Help a fellow student out</span></span>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-heading">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Your campus toolkit</p>
            <h2 id="features-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">What do you need today?</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">A few helpful ways to save money, find your stuff and look out for each other.</p>
          </div>
          <Link to="/marketplace" className="inline-flex items-center gap-1 self-start text-sm font-bold text-primary hover:underline sm:self-auto">Explore everything <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {NAV_ITEMS.filter((item) => item.to !== "/").map((item) => (
            <Link key={item.to} to={item.to} className="feature-card group rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-transform duration-200 group-hover:scale-110 ${CARD_STYLES[item.to] ?? "bg-secondary text-primary ring-border"}`}>
                  <item.icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:-rotate-45" aria-hidden />
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{DESCRIPTIONS[item.to]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl bg-amber-100 p-6 text-amber-950 sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-amber-700"><Leaf className="h-6 w-6" aria-hidden /></div>
          <h2 className="mt-5 text-2xl font-extrabold">A little sharing goes a long way.</h2>
          <p className="mt-3 leading-7 text-amber-950/80">Save a purchase, help a classmate, and give useful things another round of campus life.</p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4" /> Practical. Affordable. Community-powered.</div>
        </div>
        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><ShieldCheck className="h-6 w-6" aria-hidden /></span>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Clear at a glance</p><h2 className="text-2xl font-extrabold">Know your item’s status</h2></div>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Check common status labels used around the app to understand what’s available, pending or already returned.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <StatusBadge status="available" /><StatusBadge status="pending" /><StatusBadge status="lost" /><StatusBadge status="found" /><StatusBadge status="returned" />
          </div>
          <div className="mt-6 border-t pt-5 text-sm text-muted-foreground">New here? Start by browsing items, then sign in when you’re ready to post or request something.</div>
          <Link to="/marketplace" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><Store className="h-4 w-4" /> Browse campus items <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
