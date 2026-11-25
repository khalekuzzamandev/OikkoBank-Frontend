import Contact from "@/components/Layout/Home/Contact";
import Hero from "@/components/Layout/Home/Hero";
import QuickAccess from "@/components/Layout/Home/QuickAccess";
import InvestorsRelations from "./(public)/investors/page";
import AboutPage from "./(public)/about/page";

export default function Home() {
  return (
   <div className="min-h-screen">
    <Hero/>
    <QuickAccess/>
    <AboutPage/>
    <InvestorsRelations/>
    <Contact/>

   </div>
  );
}
