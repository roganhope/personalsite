import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Hero from "@/components/hero";
import Mission from "@/components/mission";
import Projects from "@/components/projects";
import Reviews from "@/components/reviews";
import Skills from "@/components/skills";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="relative z-10">
        <Hero />
        <Mission />
        <Projects />
        <Experience />
        <Skills />
        <Reviews />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
