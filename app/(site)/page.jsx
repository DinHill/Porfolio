import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Hero />
      <Marquee />
      <Work />
      <Experience />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
