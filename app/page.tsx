import Nav from "@/components/Nav";
import MeshBackdrop from "@/components/MeshBackdrop";
import SignalField from "@/components/SignalField";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import ScrollJourney from "@/components/ScrollJourney";
import RecruiterSignals from "@/components/RecruiterSignals";
import Hero from "@/components/Hero";
import FeaturedPatent from "@/components/FeaturedPatent";
import EngineeringWorks from "@/components/EngineeringWorks";
import Arsenal from "@/components/Arsenal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top" className="bg-noise relative min-h-screen scroll-mt-28">
      <MeshBackdrop />
      <SignalField />
      <CustomCursor />
      <Nav />
      <ScrollProgress />
      <ScrollJourney />
      <main>
        <Hero />
        <RecruiterSignals />
        <FeaturedPatent />
        <EngineeringWorks />
        <Arsenal />
      </main>
      <Footer />
    </div>
  );
}
