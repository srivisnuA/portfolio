import Nav from "@/components/Nav";
import MeshBackdrop from "@/components/MeshBackdrop";
import Hero from "@/components/Hero";
import FeaturedPatent from "@/components/FeaturedPatent";
import EngineeringWorks from "@/components/EngineeringWorks";
import Arsenal from "@/components/Arsenal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-noise relative min-h-screen">
      <MeshBackdrop />
      <Nav />
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
