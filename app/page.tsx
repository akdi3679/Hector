import Header from '@/components/Header';
import MobileBar from '@/components/MobileBar';
import Footer from '@/components/Footer';
import RoadProgress from '@/components/RoadProgress';

 
import { Hero, StatsStrip, VideosSection, StorySection, EcosystemSection, MaterialSection, BrandsSection, ReviewsSection, MomentsSection , BoutiqueSection, GallerySection, NewsletterSection, FinalCTA } from '@/components/sections';

export default function Page() {
  return (
    <>
      <Header />
      <RoadProgress />
      <main>
        <Hero />
        <StatsStrip />
        <VideosSection />
        <StorySection />
        <EcosystemSection />
        <MaterialSection />

        <BrandsSection />
        <ReviewsSection />
        <BoutiqueSection />
        <MomentsSection />

        <GallerySection />
        <NewsletterSection />
        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}