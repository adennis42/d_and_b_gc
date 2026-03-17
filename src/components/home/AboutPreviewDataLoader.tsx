import Image from 'next/image';
import Link from 'next/link';
import { getAboutPreview } from '@/lib/site-content';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export const dynamic = 'force-dynamic';

export async function AboutPreviewDataLoader() {
  const preview = await getAboutPreview();

  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <ScrollReveal direction="right" className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              {preview.imageUrl ? (
                <Image
                  src={preview.imageUrl}
                  alt={preview.imageAlt || 'About our work'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                  <span className="text-neutral-400 text-sm">About Image</span>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Text Side */}
          <ScrollReveal direction="left" className="order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900">
                {preview.heading}
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                {preview.bodyText}
              </p>
              <Link
                href="/about"
                className="inline-block text-lg font-medium text-neutral-900 border-b-2 border-neutral-900 pb-1 hover:opacity-70 transition-opacity"
              >
                Learn More About Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
