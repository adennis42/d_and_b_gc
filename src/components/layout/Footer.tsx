import Link from "next/link";
import {
  TwitterLogoIcon,
  LinkedInLogoIcon,
  InstagramLogoIcon,
} from "@radix-ui/react-icons";

/**
 * Footer component - Site footer with contact info, social links, and navigation
 * Features:
 * - Company contact information placeholders
 * - Social media icons using @radix-ui/react-icons
 * - Quick links to main pages
 * - Responsive grid layout (stacks on mobile, multi-column on desktop)
 * - Professional design matching Header aesthetic
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/schedule", label: "Schedule" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      icon: InstagramLogoIcon,
      ariaLabel: "Visit our Instagram page",
    },
    {
      name: "Twitter",
      href: "#",
      icon: TwitterLogoIcon,
      ariaLabel: "Visit our Twitter page",
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: LinkedInLogoIcon,
      ariaLabel: "Visit our LinkedIn page",
    },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              D&B General Contactors
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start">
                <span className="sr-only">Address</span>
                <span>123 Main Street</span>
              </p>
              <p className="flex items-start">
                <span className="sr-only">City and State</span>
                <span>City, State 12345</span>
              </p>
              <p>
                <a
                  href="tel:+1234567890"
                  className="hover:text-foreground transition-colors"
                >
                  <span className="sr-only">Phone</span>
                  (123) 456-7890
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@contractor.com"
                  className="hover:text-foreground transition-colors"
                >
                  <span className="sr-only">Email</span>
                  info@contractor.com
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Kitchen Remodeling</li>
              <li>Bathroom Remodeling</li>
              <li>Custom Design</li>
              <li>Consultation</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.ariaLabel}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} D&B General Contactors. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
