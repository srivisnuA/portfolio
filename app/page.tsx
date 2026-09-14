import Nav from "@/components/Nav";
import MeshBackdrop from "@/components/MeshBackdrop";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import ScrollJourney from "@/components/ScrollJourney";
import Hero from "@/components/Hero";
import FeaturedPatent from "@/components/FeaturedPatent";
import EngineeringWorks from "@/components/EngineeringWorks";
import Arsenal from "@/components/Arsenal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-noise relative min-h-screen">
      <MeshBackdrop />
      <CustomCursor />
      <Nav />
      <ScrollProgress />
      <ScrollJourney />
      <main>
        <Hero />
        <FeaturedPatent />
        <EngineeringWorks />
        <Arsenal />
      </main>
      <Footer />
    </div>
  );
}
