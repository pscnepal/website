import {
  GraduationCap,
  HeartHandshake,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import {
  ABOUT_CADRES_HEADER,
  ABOUT_CADRE_SUMMARIES,
  ABOUT_CONTACT_CTA,
  ABOUT_EDITORIAL_INTEGRITY,
  ABOUT_HERO_CONTENT,
  ABOUT_MISSION_VISION,
  ABOUT_PILLARS_HEADER,
  ABOUT_PLATFORM_PILLARS,
  type AboutCadreSummary,
  type AboutMissionCard,
  type AboutPlatformPillar,
} from '../data/aboutContentData';

const MISSION_ICON_TONE: Record<AboutMissionCard['tone'], string> = {
  blue: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400',
  crimson:
    'bg-crimson-100 dark:bg-crimson-950/70 text-crimson-700 dark:text-crimson-400',
};

const PILLAR_ICON_TONE: Record<AboutPlatformPillar['tone'], string> = {
  blue: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400',
  crimson:
    'bg-crimson-50 dark:bg-crimson-950 text-crimson-700 dark:text-crimson-400',
  emerald:
    'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
  purple:
    'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400',
  amber: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400',
};

const PILLAR_LINK_TONE: Record<AboutPlatformPillar['tone'], string> = {
  blue: 'text-blue-700 dark:text-blue-400',
  crimson: 'text-crimson-700 dark:text-crimson-400',
  emerald: 'text-emerald-700 dark:text-emerald-400',
  purple: 'text-purple-700 dark:text-purple-400',
  amber: 'text-amber-700 dark:text-amber-400',
};

const CADRE_TONE_CLASSES: Record<
  AboutCadreSummary['tone'],
  { label: string; badge: string; link: string }
> = {
  blue: {
    label: 'text-blue-700 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200',
    link: 'text-blue-700 dark:text-blue-400',
  },
  crimson: {
    label: 'text-crimson-700 dark:text-crimson-400',
    badge:
      'bg-crimson-100 dark:bg-crimson-950 text-crimson-800 dark:text-crimson-200',
    link: 'text-crimson-700 dark:text-crimson-400',
  },
  emerald: {
    label: 'text-emerald-700 dark:text-emerald-400',
    badge:
      'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200',
    link: 'text-emerald-700 dark:text-emerald-400',
  },
  purple: {
    label: 'text-purple-700 dark:text-purple-400',
    badge:
      'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200',
    link: 'text-purple-700 dark:text-purple-400',
  },
};

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1 min-w-0 w-full">
          {/* Hero Banner Section */}
          <section className="relative overflow-hidden border-b border-zinc-200/90 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xs py-10 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-950/20"
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">About</span>
              </nav>

              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-700 dark:text-blue-400">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>{ABOUT_HERO_CONTENT.badge}</span>
                </div>

                <h1 className="font-serif text-fluid-h1 font-bold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                  {ABOUT_HERO_CONTENT.headline}
                </h1>

                <p className="text-fluid-lead text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {ABOUT_HERO_CONTENT.lead}
                </p>
              </div>
            </div>
          </section>

          {/* Main Content Body */}
          <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 min-w-0">
            {/* Mission & Vision Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ABOUT_MISSION_VISION.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${MISSION_ICON_TONE[card.tone]}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                      {card.title}
                    </h2>
                    <p className="text-fluid-body text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Core Pillars of the Platform */}
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {ABOUT_PILLARS_HEADER.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  {ABOUT_PILLARS_HEADER.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {ABOUT_PLATFORM_PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.id}
                      className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${PILLAR_ICON_TONE[pillar.tone]}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {pillar.description}
                      </p>
                      <Link
                        to={pillar.to}
                        className={`inline-flex items-center text-xs font-semibold hover:underline pt-1 ${PILLAR_LINK_TONE[pillar.tone]}`}
                      >
                        {pillar.linkLabel}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Target Cadres Overview */}
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  {ABOUT_CADRES_HEADER.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  {ABOUT_CADRES_HEADER.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ABOUT_CADRE_SUMMARIES.map((cadre) => {
                  const tone = CADRE_TONE_CLASSES[cadre.tone];
                  return (
                    <div
                      key={cadre.cadreId}
                      className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 min-w-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider font-mono ${tone.label}`}
                        >
                          {cadre.levelBadge}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${tone.badge}`}
                        >
                          {cadre.educationBadge}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                        {cadre.heading}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {cadre.description}
                      </p>
                      <Link
                        to={`/syllabus/${cadre.cadreId}`}
                        className={`inline-flex items-center text-xs font-semibold hover:underline pt-2 ${tone.link}`}
                      >
                        {cadre.ctaLabel}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Academic & Editorial Integrity */}
            <section className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/40 space-y-4">
              <div className="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100 font-semibold">
                <ShieldCheck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                <span>{ABOUT_EDITORIAL_INTEGRITY.title}</span>
              </div>
              <p className="text-fluid-body text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {ABOUT_EDITORIAL_INTEGRITY.leadBeforeDomain}
                <span className="font-mono text-zinc-800 dark:text-zinc-200">
                  {ABOUT_EDITORIAL_INTEGRITY.domain}
                </span>
                {ABOUT_EDITORIAL_INTEGRITY.leadAfterDomain}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-blue-700 dark:text-blue-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{ABOUT_EDITORIAL_INTEGRITY.reportErrataLabel}</span>
                </Link>
                <span className="text-zinc-300 dark:text-zinc-700" aria-hidden="true">·</span>
                <Link
                  to="/terms"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline"
                >
                  {ABOUT_EDITORIAL_INTEGRITY.termsLabel}
                </Link>
              </div>
            </section>

            {/* Connect & Contact Card */}
            <section className="p-6 sm:p-8 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold text-sm">
                  <HeartHandshake className="w-4 h-4" />
                  <span>{ABOUT_CONTACT_CTA.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {ABOUT_CONTACT_CTA.description}
                </p>
                <div className="pt-1">
                  <a
                    href={`mailto:${ABOUT_CONTACT_CTA.email}`}
                    className="font-mono text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 hover:underline break-all"
                  >
                    {ABOUT_CONTACT_CTA.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to={ABOUT_CONTACT_CTA.primaryCtaTo}
                  className="inline-flex items-center justify-center min-h-10 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  {ABOUT_CONTACT_CTA.primaryCtaLabel}
                </Link>
                <Link
                  to={ABOUT_CONTACT_CTA.secondaryCtaTo}
                  className="inline-flex items-center justify-center min-h-10 px-4 rounded-xl bg-crimson-700 hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  {ABOUT_CONTACT_CTA.secondaryCtaLabel}
                </Link>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
