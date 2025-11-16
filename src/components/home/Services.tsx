/**
 * Services component - Services overview section
 * Phase 2: Add detailed service descriptions, images, and icons
 * Features:
 * - Kitchen remodeling services
 * - Bathroom remodeling services
 * - Custom design options
 * - Consultation services
 */
export function Services() {
  const services = [
    {
      title: "Kitchen Remodeling",
      description:
        "Transform your kitchen into a beautiful, functional space with custom cabinetry, premium appliances, and expert installation.",
      // Phase 2: Add service image
    },
    {
      title: "Bathroom Remodeling",
      description:
        "Create a luxurious bathroom retreat with high-end fixtures, custom tile work, and thoughtful design details.",
      // Phase 2: Add service image
    },
    {
      title: "Custom Design",
      description:
        "Work with our design team to create a space that reflects your style and meets your functional needs.",
      // Phase 2: Add service image
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer comprehensive remodeling services for your home, focusing on
            quality craftsmanship and attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
            >
              {/* Phase 2: Add service icon or image here */}
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

