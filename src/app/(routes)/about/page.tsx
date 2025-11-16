import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CheckCircle2, MapPin, Award, Users, Clock } from "lucide-react";
import { getAboutMetadata } from "@/lib/metadata";

/**
 * About page metadata for SEO
 * Generated using centralized metadata utility
 */
export const metadata = getAboutMetadata();

/**
 * Structured data for LocalBusiness schema (JSON-LD)
 * Helps with local SEO and Google Business Profile integration
 */
function LocalBusinessStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://yourdomain.com/#organization",
    name: "Contractor Name",
    description:
      "Professional general contractor specializing in high-end residential bathroom and kitchen remodels",
    url: "https://yourdomain.com",
    telephone: "+1-234-567-8900",
    email: "info@contractor.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Main Street",
      addressLocality: "City",
      addressRegion: "State",
      postalCode: "12345",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "40.7128",
      longitude: "-74.0060",
    },
    areaServed: {
      "@type": "City",
      name: "City, State",
    },
    priceRange: "$$$",
    image: "https://yourdomain.com/images/logo.jpg",
    sameAs: [
      "https://www.facebook.com/yourpage",
      "https://www.instagram.com/yourpage",
      "https://www.linkedin.com/company/yourcompany",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * About page component
 * Displays company information, process, service areas, and differentiators
 */
export default function AboutPage() {
  const processSteps = [
    {
      number: "01",
      title: "Design",
      description:
        "We collaborate with you to understand your vision and create detailed design plans that reflect your style and functional needs.",
    },
    {
      number: "02",
      title: "Plan",
      description:
        "Our team develops comprehensive project plans, timelines, and budgets, ensuring transparency and alignment before work begins.",
    },
    {
      number: "03",
      title: "Build",
      description:
        "Expert craftsmen execute the project with meticulous attention to detail, using premium materials and proven techniques.",
    },
    {
      number: "04",
      title: "Deliver",
      description:
        "We complete final inspections, walkthroughs, and ensure your complete satisfaction with the finished project.",
    },
  ];

  const serviceAreas = [
    "City Name",
    "Surrounding Area",
    "Metro Region",
    "Additional Cities",
  ];

  const differentiators = [
    {
      icon: Award,
      title: "Award-Winning Craftsmanship",
      description:
        "Recognized for excellence in residential remodeling with industry awards and certifications.",
    },
    {
      icon: Users,
      title: "Experienced Team",
      description:
        "Our skilled professionals bring decades of combined experience to every project.",
    },
    {
      icon: Clock,
      title: "Timely Completion",
      description:
        "We respect your time and deliver projects on schedule without compromising quality.",
    },
    {
      icon: CheckCircle2,
      title: "Quality Guarantee",
      description:
        "We stand behind our work with comprehensive warranties and ongoing support.",
    },
  ];

  return (
    <>
      <LocalBusinessStructuredData />
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={[{ label: "About", href: undefined }]} />

          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About Us
          </h1>

          {/* About Company Section */}
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              About Contractor Name
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                With over [X] years of experience in high-end residential
                remodeling, Contractor Name has established itself as a trusted
                leader in kitchen and bathroom renovations. Our commitment to
                excellence, attention to detail, and customer satisfaction sets
                us apart in the industry.
              </p>
              <p>
                We specialize in transforming residential spaces into beautiful,
                functional environments that reflect our clients' unique styles
                and needs. Every project is approached with meticulous planning,
                expert craftsmanship, and premium materials to ensure lasting
                quality and value.
              </p>
              <p>
                Our team combines traditional craftsmanship with modern design
                sensibilities, working closely with homeowners, designers, and
                architects to bring visions to life. From initial consultation
                to final walkthrough, we maintain clear communication and
                deliver results that exceed expectations.
              </p>
            </div>
          </section>

          {/* Our Process Section */}
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">
              Our Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative pb-8 border-l-2 border-primary/20 pl-6 last:border-l-0 last:pb-0"
                >
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary border-2 border-background" />
                  <div className="space-y-3">
                    <span className="text-sm font-semibold text-primary">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Service Areas Section */}
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Service Areas
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              We proudly serve homeowners throughout the following areas:
            </p>
            <div className="flex flex-wrap gap-3">
              {serviceAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border"
                >
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="font-medium">{area}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Don't see your area listed? Contact us to discuss your project
              location.
            </p>
          </section>

          {/* Why Choose Us Section */}
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {differentiators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
