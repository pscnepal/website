import { FeatureSection } from '../components/home/FeatureSection';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';

export function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <PageTransition>
        <main className="flex-1">
          <FeatureSection />
        </main>
        <Footer />
      </PageTransition>
    </div>
  );
}
