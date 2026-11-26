import { GoogleAdUnit } from '../components/ads/GoogleAdUnit';
import { BrowseMaterials } from '../components/home/BrowseMaterials';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';

export function MaterialsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <PageTransition>
        <main className="flex-1">
          <BrowseMaterials />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
            <GoogleAdUnit variant="horizontal" />
          </div>
        </main>
        <Footer />
      </PageTransition>
    </div>
  );
}
