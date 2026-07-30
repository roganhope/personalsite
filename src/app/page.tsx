import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Hero from "@/components/hero";
import Mission from "@/components/mission";
import Projects from "@/components/projects";
import SiteFooter from "@/components/site-footer";
import Toolbox from "@/components/toolbox";

export default function Home() {
  return (
    <>
      <main id="top" className="relative z-10">
        <Hero />
        <Toolbox />
        <Mission />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
