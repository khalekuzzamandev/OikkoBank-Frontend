import Contact from "@/components/Layout/Home/Contact";
import Hero from "@/components/Layout/Home/Hero";
import QuickAccess from "@/components/Layout/Home/QuickAccess";

export default function Home() {
  return (
   <div className="min-h-screen">
    <Hero/>
    <QuickAccess/>
    <Contact/>

   </div>
  );
}
