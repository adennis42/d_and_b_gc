"use client";

import { ChefHat, Droplet, Hammer, Sun } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trackButtonClick } from "@/lib/analytics";

/**
 * Services component - Displays main service offerings
 * Features:
 * - Four main service cards: Kitchen, Bathroom, Millwork, and Sunrooms
 * - Each card includes icon, title, description, and features list
 * - Responsive CSS Grid layout (1 column mobile, 2 columns desktop)
 * - Hover effects for interactivity
 * - Clean, uncluttered design using Shadcn Card components
 */
export function Services() {
  const services = [
    {
      title: "Kitchen Remodeling",
      description:
        "Transform your kitchen into a beautiful, functional space that combines style with practicality.",
      icon: ChefHat,
      features: [
        "Custom cabinetry design",
        "Premium appliance installation",
        "Countertop selection & installation",
        "Lighting & electrical work",
        "Plumbing & fixture upgrades",
      ],
    },
    {
      title: "Bathroom Remodeling",
      description:
        "Create a luxurious bathroom retreat with high-end fixtures and thoughtful design details.",
      icon: Droplet,
      features: [
        "Custom tile work & design",
        "Luxury fixture installation",
        "Vanity & storage solutions",
        "Shower & tub upgrades",
        "Plumbing & ventilation",
      ],
    },
    {
      title: "Millwork",
      description:
        "Custom millwork and woodworking solutions that add elegance and functionality to your home.",
      icon: Hammer,
      features: [
        "Custom cabinetry & built-ins",
        "Crown molding & trim work",
        "Wainscoting & paneling",
        "Custom doors & windows",
        "Architectural details",
      ],
    },
    {
      title: "Sunrooms",
      description:
        "Bright, airy sunroom additions that bring the outdoors in and expand your living space.",
      icon: Sun,
      features: [
        "Custom sunroom design",
        "Energy-efficient windows",
        "Climate control systems",
        "Seamless indoor-outdoor flow",
        "Year-round comfort",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We specialize in high-end residential remodeling with meticulous
            attention to detail and expert craftsmanship.
          </p>
        </div>

        {/* CSS Grid: 1 column mobile, 2 columns desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span
                          className="text-primary mt-1"
                          aria-hidden="true"
                        >
                          •
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
