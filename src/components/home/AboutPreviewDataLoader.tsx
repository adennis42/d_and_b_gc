import Image from 'next/image';
import Link from 'next/link';
import { getAboutContent } from '@/lib/site-content';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export const dynamic = 'force-dynamic';

export async function AboutPreviewDataLoader() {
  const about = await getAboutContent();

  return (
    <section
      style={{
        background: "var(--paper-2, #EDE6DA)",
        padding: "clamp(64px, 10vw, 128px) max(24px, 4vw)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "var(--container, 1280px)", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(40px, 6vw, 80px)", alignItems: "center" }}>
          {/* Image */}
          <ScrollReveal direction="right">
            <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: "4px", overflow: "hidden", background: "#E2D8C6", boxShadow: "0 24px 48px rgba(27,26,23,0.18)" }}>
              {about.imageUrl ? (
                <Image
                  src={about.imageUrl}
                  alt={about.imageAlt || 'About Raise Design & Build'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#A39E94", fontSize: "0.875rem" }}>About Image</span>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="left">
            <div>
              {/* Eyebrow */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "1.25rem" }}>
                <span style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontStyle: "italic", fontSize: "18px", color: "#A8804A" }}>iii</span>
                <span className="eyebrow">Studio</span>
              </div>

              {/* Headline */}
              <h2 style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1B1A17", marginBottom: "1.5rem" }}>
                {about.headline}
              </h2>

              {/* Body paragraphs */}
              {about.bodyParagraphs.map((para, i) => (
                <p key={i} style={{ fontFamily: "var(--font-sans, 'Inter', sans-serif)", fontSize: "1rem", lineHeight: 1.75, color: "#4A4842", marginBottom: "1rem" }}>
                  {para}
                </p>
              ))}

              {/* Team names */}
              {about.teamNames.length > 0 && (
                <p style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontStyle: "italic", fontSize: "1.125rem", color: "#76726A", marginTop: "1.5rem" }}>
                  {about.teamNames.join(" · ")}
                </p>
              )}

              <Link
                href="/about"
                style={{
                  display: "inline-block", marginTop: "2rem",
                  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                  fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#1B1A17",
                  borderBottom: "1px solid #1B1A17", paddingBottom: "2px",
                  textDecoration: "none", transition: "opacity 0.18s ease",
                }}
              >
                Our Story
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
