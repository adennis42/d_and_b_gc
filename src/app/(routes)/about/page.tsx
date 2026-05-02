import { CheckCircle2, MapPin, Shield, Users, Clock } from "lucide-react";
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

  const serviceAreas = ["Suffolk County", "Nassau County", "Long Island"];

  const differentiators = [
    {
      icon: Shield,
      title: "Maintaining Standards",
      description:
        "We stay consistent, we stay accountable, and we stand behind our work. When you choose us, you’re choosing a team that values honesty, reliability, and results that last.",
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

          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About Us
          </h1>

          {/* About Company Section */}
          <section className="mb-16 md:mb-24">
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Our company is a true family operation rooted in craftsmanship
                and integrity. Led by a second-generation master carpenter,
                Paul, with over 40 years of hands-on experience, we bring
                decades of building expertise to every project. He learned the
                trade the traditional way—on the job, day after day, perfecting
                the details that make a home truly special. After building
                houses in the 80s/90s, as the industry changed, Paul shifted his
                focus to interior millwork, kitchens, and bathrooms, bringing
                the same level of precision and craftsmanship to each project.
              </p>
              <p>
                Today, he works alongside his son, Paul Jr, on every site,
                carrying forward a legacy built on skill, trust, and pride in a
                job well done. Ensuring quality that only comes from people who
                take joy in their craft. Complementing this is his daughter,
                Jessica, who adds a design-forward perspective, helping clients
                with design choices, interior layouts, and finish selections to
                create spaces that feel cohesive, elevated, and uniquely theirs.
                When the pandemic reshaped the way people lived in and used
                their homes, we expanded our services to include custom
                sunrooms—designing and installing bright, beautiful spaces that
                bring the outdoors in. This includes full sunroom fit-outs,
                blending our construction background with our passion for
                creating comfortable, functional spaces
              </p>
              <p>
                At the heart of our company is a commitment to honest work,
                personal service, and exceptional results. As a Design & Build
                operation, you’ll save thousands compared to boutique showrooms
                that overcharge and under-listen. We aim higher than your
                expectations to delivery you a space that is a masterpiece of
                craftsmanship and sophistication.
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
