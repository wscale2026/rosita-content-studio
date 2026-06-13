import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Testimonials from './sections/Testimonials';
import Problems from './sections/Problems';
import Differentiation from './sections/Differentiation';
import Metrics from './sections/Metrics';
import Profiles from './sections/Profiles';
import OfferDetails from './sections/OfferDetails';
import MathArgument from './sections/MathArgument';
import CaseStudies from './sections/CaseStudies';
import Founder from './sections/Founder';
import Comparison from './sections/Comparison';
import QuickResults from './sections/QuickResults';
import Guarantee from './sections/Guarantee';
import FAQ from './sections/FAQ';
import OrganicProof from './sections/OrganicProof';
import Pricing from './sections/Pricing';
import LeadMagnet from './sections/LeadMagnet';
import Footer from './sections/Footer';
import ExitIntent from './components/ExitIntent';
import CheckoutModal from './components/CheckoutModal';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="frontoffice-theme min-h-screen bg-white text-body font-sans">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* Section 2: Hero with 3D Sculpture */}
        <Hero />

        {/* Section 3: Testimonials Carousel */}
        <Testimonials />

        {/* Section 4: Problem Diagnosis */}
        <Problems />

        {/* Section 5: Product Differentiation */}
        <Differentiation />

        {/* Section 6: Key Metrics */}
        <Metrics />

        {/* Section 7: Accepted Profiles */}
        <Profiles />

        {/* Section 8: Offer Details */}
        <OfferDetails />

        {/* Section 9: Math Argumentation */}
        <MathArgument />

        {/* Section 10: Case Studies */}
        <CaseStudies />

        {/* Section 11: Founder Credibility */}
        <Founder />

        {/* Section 12: Comparison Table */}
        <Comparison />

        {/* Section 13: Quick Results 
        <QuickResults />*/}

        {/* Section 14: Guarantee*/}
        <Guarantee />

        {/* Section 15: FAQ */}
        <FAQ />

        {/* Section 16: Organic Proof 
        <OrganicProof />*/}

        {/* Pricing Block */}
        <Pricing />

        {/* Section 17: Lead Magnet */}
        <LeadMagnet />

        {/* Section 18: Footer */}
        <Footer />
      </main>

      {/* Exit Intent Popup */}
      <ExitIntent />

      {/* Checkout Modal */}
      <CheckoutModal />

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
