import Nav from "@/components/Nav";
import MeshBackdrop from "@/components/MeshBackdrop";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import ScrollJourney from "@/components/ScrollJourney";
import RecruiterSignals from "@/components/RecruiterSignals";
import AsteroidGame from "@/components/AsteroidGame";
import Hero from "@/components/Hero";
import FeaturedPatent from "@/components/FeaturedPatent";
import EngineeringWorks from "@/components/EngineeringWorks";
import Arsenal from "@/components/Arsenal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-noise relative min-h-screen">
      <MeshBackdrop />
      <AsteroidGame />
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
