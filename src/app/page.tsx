import { HeroDataLoader } from "@/components/home/HeroDataLoader";
import { ServicesDataLoader } from "@/components/home/ServicesDataLoader";
import { InstagramDataLoader } from "@/components/home/InstagramDataLoader";
import { AboutPreviewDataLoader } from "@/components/home/AboutPreviewDataLoader";
import { CtaDataLoader } from "@/components/home/CtaDataLoader";
import { getHomeMetadata } from "@/lib/metadata";

export const metadata = getHomeMetadata();
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <main>
      <HeroDataLoader />
      <ServicesDataLoader />
      <InstagramDataLoader />
      <AboutPreviewDataLoader />
      <CtaDataLoader />
    </main>
  );
}
