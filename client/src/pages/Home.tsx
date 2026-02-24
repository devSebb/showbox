import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import FightCard from "@/components/sections/FightCard";
import EventInfo from "@/components/sections/EventInfo";
import About from "@/components/sections/About";
import Sponsors from "@/components/sections/Sponsors";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        <EventInfo />
        <FightCard />
        <About />
        <Sponsors />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}