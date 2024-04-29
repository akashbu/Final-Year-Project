import Banner from "@/components/Banner/Banner";
import Feature from "@/components/Feature/Feature"
import Contact from "@/components/Contact/Contact"
import Story from '@/components/Story/Story'
import Work from "@/components/Work/Work";

export default function Home() {
  return (
    <>
      <Banner />
      <Feature/>
      <Work/>
      <Story/>
      <Contact/>
    </>
  );
}
