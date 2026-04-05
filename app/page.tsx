import Header from "./components/Header";
import Hero from "./components/Hero";
import TranslatePanel from "./components/TranslatePanel";
import ExamplesSection from "./components/ExamplesSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <TranslatePanel />
      <ExamplesSection />
      <Footer />
    </>
  );
}
