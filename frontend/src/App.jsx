import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import Docs from "./pages/Docs";

const Home = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden bg-white min-h-screen">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Pricing />
        <Roadmap />
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/docs/*" element={<Docs />} />
    </Routes>
  );
};

export default App;
