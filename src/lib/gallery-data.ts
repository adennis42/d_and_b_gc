import type { Project } from "@/types";
import {
  KITCHEN_BLUR_DATA_URL,
  BATHROOM_BLUR_DATA_URL,
  SUNROOM_BLUR_DATA_URL,
  MILLWORK_BLUR_DATA_URL,
} from "./image-utils";

/**
 * Gallery data with local image paths
 * 
 * Image Structure:
 * Place your images in /public/images/gallery/ following this structure:
 * 
 * /public/images/gallery/
 *   /kitchens/
 *     kitchen-001-1.jpg
 *     kitchen-001-2.jpg
 *     kitchen-002-1.jpg
 *     ...
 *   /bathrooms/
 *     bathroom-001-1.jpg
 *     bathroom-001-2.jpg
 *     ...
 * 
 * Update the image paths below to match your actual image filenames.
 * Ensure images are optimized (WebP or JPG, properly sized) before adding.
 */

const sampleProjects: Project[] = [
  // Kitchen Projects
  {
    id: "kitchen-001",
    title: "Modern White Kitchen Renovation",
    category: "kitchen",
    description:
      "Complete kitchen transformation featuring custom white cabinetry, quartz countertops, and premium stainless steel appliances. Open-concept design maximizes natural light and creates a welcoming space for family gatherings.",
    featured: true,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-001-1.jpg",
        alt: "Modern white kitchen with island and pendant lighting",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-001-2.jpg",
        alt: "Close-up of white kitchen cabinets and hardware",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-001-3.jpg",
        alt: "Kitchen island with bar seating and modern appliances",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "kitchen-002",
    title: "Luxury Dark Wood Kitchen Design",
    category: "kitchen",
    description:
      "Elegant dark wood kitchen featuring custom cabinetry, marble countertops, and professional-grade appliances. Sophisticated design combines functionality with timeless elegance.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-002-1.jpg",
        alt: "Dark wood kitchen with marble countertops",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-002-2.jpg",
        alt: "Kitchen with dark cabinets and modern lighting",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "kitchen-003",
    title: "Contemporary Open-Concept Kitchen",
    category: "kitchen",
    description:
      "Spacious open-concept kitchen renovation with custom storage solutions, large island, and seamless flow to dining area. Perfect for entertaining and family life.",
    featured: true,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-003-1.jpg",
        alt: "Open-concept kitchen with large island",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-003-2.jpg",
        alt: "Kitchen with modern appliances and storage",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-003-3.jpg",
        alt: "Kitchen detail showing custom cabinetry",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-003-4.jpg",
        alt: "Kitchen dining area integration",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "kitchen-004",
    title: "Farmhouse Style Kitchen Remodel",
    category: "kitchen",
    description:
      "Charming farmhouse-style kitchen featuring shaker cabinets, farmhouse sink, and rustic elements. Warm and inviting design perfect for family living.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-004-1.jpg",
        alt: "Farmhouse kitchen with shaker cabinets",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-2.jpg",
        alt: "Farmhouse sink and rustic details",
        width: 1920,
        height: 1280,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
    ],
  },
  // Bathroom Projects
  {
    id: "bathroom-001",
    title: "Spa-Inspired Master Bathroom",
    category: "bathroom",
    description:
      "Luxurious master bathroom renovation featuring freestanding tub, walk-in shower with rain head, and premium finishes. Creating a spa-like retreat in your home.",
    featured: true,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-001-1.jpg",
        alt: "Luxurious bathroom with freestanding tub",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-001-2.jpg",
        alt: "Walk-in shower with modern fixtures",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-001-3.jpg",
        alt: "Bathroom vanity with double sinks",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "bathroom-002",
    title: "Modern Minimalist Bathroom Design",
    category: "bathroom",
    description:
      "Clean, minimalist bathroom design with floating vanity, large format tiles, and sleek fixtures. Maximizing space and light in a compact footprint.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-002-1.jpg",
        alt: "Minimalist bathroom with floating vanity",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-002-2.jpg",
        alt: "Modern shower with glass enclosure",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "bathroom-003",
    title: "Classic Elegant Bathroom Renovation",
    category: "bathroom",
    description:
      "Timeless bathroom design featuring marble surfaces, traditional fixtures, and elegant details. Classic sophistication meets modern functionality.",
    featured: true,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-003-1.jpg",
        alt: "Elegant bathroom with marble finishes",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-003-2.jpg",
        alt: "Classic bathroom fixtures and details",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-003-3.jpg",
        alt: "Bathroom with traditional design elements",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "bathroom-004",
    title: "Compact Powder Room Makeover",
    category: "bathroom",
    description:
      "Smart design solutions for a small powder room, maximizing storage and style. Custom vanity and creative tile work create a standout space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-004-1.jpg",
        alt: "Compact powder room with custom vanity",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-004-2.jpg",
        alt: "Powder room detail showing tile work",
        width: 1920,
        height: 1280,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
    ],
  },

  // Sunroom Projects
  {
    id: "sunroom-001",
    title: "Sunroom Addition",
    category: "sunroom",
    description:
      "Sunroom addition featuring custom built-in seating, skylights, and natural light. Perfect for relaxation and entertainment.",
    featured: true,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-001-1.jpg",
        alt: "Sunroom with custom built-in seating",
        width: 1920,
        height: 1280,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "sunroom-002",
    title: "Sunroom Addition",
    category: "sunroom",
    description:
      "Sunroom addition featuring custom built-in seating, skylights, and natural light. Perfect for relaxation and entertainment.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-002-1.jpg",
        alt: "Sunroom with custom built-in seating",
        width: 1920,
        height: 1280,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "sunroom-003",
    title: "Sunroom Addition",
    category: "sunroom",
    description:
      "Sunroom addition featuring custom built-in seating, skylights, and natural light. Perfect for relaxation and entertainment.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-003-1.jpg",
        alt: "Sunroom with custom built-in seating",
        width: 1920,
        height: 1280,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
    ],
  },
  // Millwork Projects
  {
    id: "millwork-001",
    title: "Millwork Installation",
    category: "millwork",
    description:
      "Millwork installation featuring custom built-in seating, skylights, and natural light. Perfect for relaxation and entertainment.",
    images: [
      {
        url: "/images/gallery/millwork/millwork-001-1.jpg",
        alt: "Millwork installation with custom built-in seating",
        width: 1920,
        height: 1280,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
    ],
  },
  {
    id: "millwork-002",
    title: "Millwork Installation",
    category: "millwork",
    description:
      "Millwork installation featuring custom built-in seating, skylights, and natural light. Perfect for relaxation and entertainment.",
    images: [
      {
        url: "/images/gallery/millwork/millwork-002-1.jpg",
        alt: "Millwork installation with custom built-in seating",
        width: 1920,
        height: 1280,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
    ],
  },
];

/**
 * Get all projects
 * @returns Array of all projects
 */
export function getAllProjects(): Project[] {
  return sampleProjects;
}

/**
 * Get projects by category
 * @param category - Project category ('kitchen', 'bathroom', 'sunroom', or 'millwork')
 * @returns Array of projects matching the category
 */
export function getProjectsByCategory(
  category: "kitchen" | "bathroom" | "sunroom" | "millwork"
): Project[] {
  return sampleProjects.filter((project) => project.category === category);
}

/**
 * Get featured projects
 * @returns Array of featured projects
 */
export function getFeaturedProjects(): Project[] {
  return sampleProjects.filter((project) => project.featured === true);
}

/**
 * Get a single project by ID
 * @param id - Project ID
 * @returns Project if found, undefined otherwise
 */
export function getProjectById(id: string): Project | undefined {
  return sampleProjects.find((project) => project.id === id);
}

/**
 * Get project categories with counts
 * @returns Object with category counts
 */
export function getCategoryCounts(): {
  kitchen: number;
  bathroom: number;
  sunroom: number;
  millwork: number;
  total: number;
} {
  return {
    kitchen: getProjectsByCategory("kitchen").length,
    bathroom: getProjectsByCategory("bathroom").length,
    sunroom: getProjectsByCategory("sunroom").length,
    millwork: getProjectsByCategory("millwork").length,
    total: sampleProjects.length,
  };
}
