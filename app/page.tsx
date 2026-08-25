import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Plans from "./components/Plans";
import Specs from "./components/Specs";
import Locations from "./components/Locations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Plans />
        <Specs />
        <Locations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
