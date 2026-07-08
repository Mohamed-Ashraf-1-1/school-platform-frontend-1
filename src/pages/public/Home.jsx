import Hero from '../../components/public/Hero.jsx';
import StatsSection from '../../components/public/StatsSection.jsx';
import FeaturedSchools from '../../components/public/FeaturedSchools.jsx';
import CategoriesSection from '../../components/public/CategoriesSection.jsx';
import CTASection from '../../components/public/CTASection.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeaturedSchools />
      <CategoriesSection />
      <CTASection />
    </>
  );
}
