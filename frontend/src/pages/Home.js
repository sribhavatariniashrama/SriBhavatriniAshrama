import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/sections/Hero";
import EditorialMarquee from "../components/sections/EditorialMarquee";
import AboutUs from "../components/sections/AboutUs";
import GuidingIdeals from "../components/sections/GuidingIdeals";
import Activities from "../components/sections/Activities";
import Events from "../components/sections/Events";
import Gallery from "../components/sections/Gallery";
import AshramaCarousel from "../components/sections/AshramaCarousel";
import VisitUs from "../components/sections/VisitUs";
import Donate from "../components/sections/Donate";
import Contact from "../components/sections/Contact";

const Home = () => (
  <div style={{ background: "var(--bg-primary)" }}>
    <div className="grain" />
    <Navbar />
    <main>
      <Hero />
      <EditorialMarquee />
      <AboutUs />
      <GuidingIdeals />
      <Activities />
      <Events />
      <Gallery />
      <AshramaCarousel />
      <VisitUs />
      <Donate />
      <Contact />
    </main>
    <Footer />
  </div>
);

export default Home;
