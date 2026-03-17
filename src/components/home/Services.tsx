"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren } from "@/components/animations/StaggerChildren";
import type { ServiceItem } from "@/lib/site-content";

const GRADIENTS = [
  "from-amber-100 to-orange-50",
  "from-blue-100 to-cyan-50",
  "from-stone-100 to-neutral-50",
  "from-green-100 to-emerald-50",
];

export function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade" className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-neutral-900">
            Our Services
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Design-forward remodeling that transforms your space
          </p>
        </ScrollReveal>

        <StaggerChildren staggerDelay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Background: real image if set, otherwise gradient */}
                <div className="absolute inset-0">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.imageAlt || service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                  )}
                </div>

                {/* Text overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p
                    className="text-white/90 text-lg font-light drop-shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    {service.tagline}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </StaggerChildren>
      </div>
    </section>
  );
}
