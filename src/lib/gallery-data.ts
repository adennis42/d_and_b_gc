import type { Project } from "@/types";
import {
  KITCHEN_BLUR_DATA_URL,
  BATHROOM_BLUR_DATA_URL,
  SUNROOM_BLUR_DATA_URL,
  MILLWORK_BLUR_DATA_URL,
} from "./image-utils";
import { extractYouTubeId } from "./video-utils";

/**
 * Gallery data with local image paths and YouTube videos
 * 
 * This file is auto-generated. All projects are organized by category.
 * Each project includes actual image dimensions and proper alt text.
 * 
 * To add YouTube videos to a project:
 * 1. Add a `videos` array to the project object
 * 2. Use the `extractYouTubeId()` helper function to get video ID from URL
 * 3. Provide video dimensions (typically 1920x1080 for 16:9 aspect ratio)
 * 
 * Example:
 * ```typescript
 * {
 *   id: "kitchen-020",
 *   title: "Kitchen Renovation Video Tour",
 *   category: "kitchen",
 *   videos: [
 *     {
 *       type: 'youtube',
 *       videoId: extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
 *       alt: 'Kitchen renovation video tour',
 *       width: 1920,
 *       height: 1080,
 *     }
 *   ],
 *   images: [...], // Can have both images and videos
 * }
 * ```
 */

const sampleProjects: Project[] = [
  // Kitchen Project 001
  {
    id: "kitchen-001",
    title: "Modern Kitchen Renovation",
    category: "kitchen",
    description: "Complete kitchen transformation featuring custom cabinetry, premium countertops, and professional-grade appliances. Modern design maximizes functionality and style.",
    featured: true,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-001-1.webp",
        alt: "Kitchen design - Project 1, Image 1",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 002
  {
    id: "kitchen-002",
    title: "Luxury Kitchen Design",
    category: "kitchen",
    description: "Luxury kitchen renovation with custom storage solutions, elegant finishes, and seamless flow. Perfect for entertaining and everyday living.",
    featured: true,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-002-1.webp",
        alt: "Kitchen design - Project 2, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-002-2.webp",
        alt: "Custom kitchen cabinetry - Project 2, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 003
  {
    id: "kitchen-003",
    title: "Custom Kitchen Remodel",
    category: "kitchen",
    description: "Contemporary kitchen design featuring high-end materials, custom details, and thoughtful layout. Creating a beautiful and functional space.",
    featured: true,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-003-1.webp",
        alt: "Kitchen design - Project 3, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-003-2.webp",
        alt: "Custom kitchen cabinetry - Project 3, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 004
  {
    id: "kitchen-004",
    title: "Contemporary Kitchen",
    category: "kitchen",
    description: "Kitchen remodel showcasing custom cabinetry, premium appliances, and sophisticated design. Combining style with practical functionality.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-004-1.webp",
        alt: "Kitchen design - Project 4, Image 1 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-2.webp",
        alt: "Custom kitchen cabinetry - Project 4, Image 2 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-3.webp",
        alt: "Kitchen island - Project 4, Image 3 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-4.webp",
        alt: "Kitchen appliances - Project 4, Image 4 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-5.webp",
        alt: "Kitchen detail - Project 4, Image 5 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-6.webp",
        alt: "Kitchen view - Project 4, Image 6 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-7.webp",
        alt: "Kitchen interior - Project 4, Image 7 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-8.webp",
        alt: "Kitchen renovation - Project 4, Image 8 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-9.webp",
        alt: "Kitchen design - Project 4, Image 9 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-004-10.webp",
        alt: "Custom kitchen cabinetry - Project 4, Image 10 of 10",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 005
  {
    id: "kitchen-005",
    title: "Traditional Kitchen Design",
    category: "kitchen",
    description: "Complete kitchen renovation with attention to detail and quality craftsmanship. Modern amenities meet timeless design.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-005-1.webp",
        alt: "Kitchen design - Project 5, Image 1",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 006
  {
    id: "kitchen-006",
    title: "Gourmet Kitchen",
    category: "kitchen",
    description: "Complete kitchen transformation featuring custom cabinetry, premium countertops, and professional-grade appliances. Modern design maximizes functionality and style.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-006-1.webp",
        alt: "Kitchen design - Project 6, Image 1 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-006-2.webp",
        alt: "Custom kitchen cabinetry - Project 6, Image 2 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-006-3.webp",
        alt: "Kitchen island - Project 6, Image 3 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-006-4.webp",
        alt: "Kitchen appliances - Project 6, Image 4 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-006-5.webp",
        alt: "Kitchen detail - Project 6, Image 5 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 007
  {
    id: "kitchen-007",
    title: "Open-Concept Kitchen",
    category: "kitchen",
    description: "Luxury kitchen renovation with custom storage solutions, elegant finishes, and seamless flow. Perfect for entertaining and everyday living.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-007-1.webp",
        alt: "Kitchen design - Project 7, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-007-2.webp",
        alt: "Custom kitchen cabinetry - Project 7, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-007-3.webp",
        alt: "Kitchen island - Project 7, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 008
  {
    id: "kitchen-008",
    title: "Farmhouse Kitchen",
    category: "kitchen",
    description: "Contemporary kitchen design featuring high-end materials, custom details, and thoughtful layout. Creating a beautiful and functional space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-008-1.webp",
        alt: "Kitchen design - Project 8, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-008-2.webp",
        alt: "Custom kitchen cabinetry - Project 8, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 009
  {
    id: "kitchen-009",
    title: "Transitional Kitchen",
    category: "kitchen",
    description: "Kitchen remodel showcasing custom cabinetry, premium appliances, and sophisticated design. Combining style with practical functionality.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-009-1.webp",
        alt: "Kitchen design - Project 9, Image 1 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-009-2.webp",
        alt: "Custom kitchen cabinetry - Project 9, Image 2 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-009-3.webp",
        alt: "Kitchen island - Project 9, Image 3 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-009-4.webp",
        alt: "Kitchen appliances - Project 9, Image 4 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-009-5.webp",
        alt: "Kitchen detail - Project 9, Image 5 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 010
  {
    id: "kitchen-010",
    title: "European Kitchen Design",
    category: "kitchen",
    description: "Complete kitchen renovation with attention to detail and quality craftsmanship. Modern amenities meet timeless design.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-010-1.webp",
        alt: "Kitchen design - Project 10, Image 1 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-010-2.webp",
        alt: "Custom kitchen cabinetry - Project 10, Image 2 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-010-3.webp",
        alt: "Kitchen island - Project 10, Image 3 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-010-4.webp",
        alt: "Kitchen appliances - Project 10, Image 4 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-010-5.webp",
        alt: "Kitchen detail - Project 10, Image 5 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 011
  {
    id: "kitchen-011",
    title: "Minimalist Kitchen",
    category: "kitchen",
    description: "Complete kitchen transformation featuring custom cabinetry, premium countertops, and professional-grade appliances. Modern design maximizes functionality and style.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-011-1.webp",
        alt: "Kitchen design - Project 11, Image 1 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-011-2.webp",
        alt: "Custom kitchen cabinetry - Project 11, Image 2 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-011-3.webp",
        alt: "Kitchen island - Project 11, Image 3 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-011-4.webp",
        alt: "Kitchen appliances - Project 11, Image 4 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-011-5.webp",
        alt: "Kitchen detail - Project 11, Image 5 of 5",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 012
  {
    id: "kitchen-012",
    title: "Classic Kitchen Renovation",
    category: "kitchen",
    description: "Luxury kitchen renovation with custom storage solutions, elegant finishes, and seamless flow. Perfect for entertaining and everyday living.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-012-1.webp",
        alt: "Kitchen design - Project 12, Image 1 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-2.webp",
        alt: "Custom kitchen cabinetry - Project 12, Image 2 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-3.webp",
        alt: "Kitchen island - Project 12, Image 3 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-4.webp",
        alt: "Kitchen appliances - Project 12, Image 4 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-5.webp",
        alt: "Kitchen detail - Project 12, Image 5 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-6.webp",
        alt: "Kitchen view - Project 12, Image 6 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-7.webp",
        alt: "Kitchen interior - Project 12, Image 7 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-8.webp",
        alt: "Kitchen renovation - Project 12, Image 8 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-9.webp",
        alt: "Kitchen design - Project 12, Image 9 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-10.webp",
        alt: "Custom kitchen cabinetry - Project 12, Image 10 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-11.webp",
        alt: "Kitchen island - Project 12, Image 11 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-12.webp",
        alt: "Kitchen appliances - Project 12, Image 12 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-13.webp",
        alt: "Kitchen detail - Project 12, Image 13 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-14.webp",
        alt: "Kitchen view - Project 12, Image 14 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-012-15.webp",
        alt: "Kitchen interior - Project 12, Image 15 of 15",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 013
  {
    id: "kitchen-013",
    title: "High-End Kitchen",
    category: "kitchen",
    description: "Contemporary kitchen design featuring high-end materials, custom details, and thoughtful layout. Creating a beautiful and functional space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-013-1.webp",
        alt: "Kitchen design - Project 13, Image 1 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-2.webp",
        alt: "Custom kitchen cabinetry - Project 13, Image 2 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-3.webp",
        alt: "Kitchen island - Project 13, Image 3 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-4.webp",
        alt: "Kitchen appliances - Project 13, Image 4 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-5.webp",
        alt: "Kitchen detail - Project 13, Image 5 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-6.webp",
        alt: "Kitchen view - Project 13, Image 6 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-7.webp",
        alt: "Kitchen interior - Project 13, Image 7 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-8.webp",
        alt: "Kitchen renovation - Project 13, Image 8 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-9.webp",
        alt: "Kitchen design - Project 13, Image 9 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-10.webp",
        alt: "Custom kitchen cabinetry - Project 13, Image 10 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-013-11.webp",
        alt: "Kitchen island - Project 13, Image 11 of 11",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 014
  {
    id: "kitchen-014",
    title: "Kitchen Transformation",
    category: "kitchen",
    description: "Kitchen remodel showcasing custom cabinetry, premium appliances, and sophisticated design. Combining style with practical functionality.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-014-1.webp",
        alt: "Kitchen design - Project 14, Image 1 of 6",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-014-2.webp",
        alt: "Custom kitchen cabinetry - Project 14, Image 2 of 6",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-014-3.webp",
        alt: "Kitchen island - Project 14, Image 3 of 6",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-014-4.webp",
        alt: "Kitchen appliances - Project 14, Image 4 of 6",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-014-5.webp",
        alt: "Kitchen detail - Project 14, Image 5 of 6",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/kitchens/kitchen-014-6.webp",
        alt: "Kitchen view - Project 14, Image 6 of 6",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Kitchen Project 015
  {
    id: "kitchen-015",
    title: "Designer Kitchen",
    category: "kitchen",
    description: "Complete kitchen renovation with attention to detail and quality craftsmanship. Modern amenities meet timeless design.",
    featured: false,
    images: [
      {
        url: "/images/gallery/kitchens/kitchen-015-1.webp",
        alt: "Kitchen design - Project 15, Image 1",
        width: 1920, height: 1440,
        blurDataURL: KITCHEN_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 001
  {
    id: "bathroom-001",
    title: "Luxury Bathroom Renovation",
    category: "bathroom",
    description: "Luxurious bathroom renovation featuring premium fixtures, elegant finishes, and spa-like amenities. Creating a relaxing retreat in your home.",
    featured: true,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-001-1.webp",
        alt: "Bathroom design - Project 1, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 002
  {
    id: "bathroom-002",
    title: "Spa-Inspired Bathroom",
    category: "bathroom",
    description: "Complete bathroom transformation with custom vanity, walk-in shower, and high-end finishes. Modern design meets timeless elegance.",
    featured: true,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-002-1.webp",
        alt: "Bathroom design - Project 2, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 003
  {
    id: "bathroom-003",
    title: "Modern Bathroom Design",
    category: "bathroom",
    description: "Bathroom remodel showcasing quality craftsmanship and attention to detail. Beautiful design that enhances daily living.",
    featured: true,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-003-1.webp",
        alt: "Bathroom design - Project 3, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 004
  {
    id: "bathroom-004",
    title: "Master Bathroom Remodel",
    category: "bathroom",
    description: "Spa-inspired bathroom renovation with premium materials and thoughtful design. Creating a serene and functional space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-004-1.webp",
        alt: "Bathroom design - Project 4, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 005
  {
    id: "bathroom-005",
    title: "Contemporary Bathroom",
    category: "bathroom",
    description: "Bathroom makeover featuring custom details and elegant finishes. Transforming your space into a personal sanctuary.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-005-1.webp",
        alt: "Bathroom design - Project 5, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-005-2.webp",
        alt: "Bathroom vanity - Project 5, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-005-3.webp",
        alt: "Bathroom shower - Project 5, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 006
  {
    id: "bathroom-006",
    title: "Classic Bathroom Design",
    category: "bathroom",
    description: "Luxurious bathroom renovation featuring premium fixtures, elegant finishes, and spa-like amenities. Creating a relaxing retreat in your home.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-006-1.webp",
        alt: "Bathroom design - Project 6, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-006-2.webp",
        alt: "Bathroom vanity - Project 6, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 007
  {
    id: "bathroom-007",
    title: "Bathroom Transformation",
    category: "bathroom",
    description: "Complete bathroom transformation with custom vanity, walk-in shower, and high-end finishes. Modern design meets timeless elegance.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-007-1.webp",
        alt: "Bathroom design - Project 7, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-007-2.webp",
        alt: "Bathroom vanity - Project 7, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-007-3.webp",
        alt: "Bathroom shower - Project 7, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 008
  {
    id: "bathroom-008",
    title: "Custom Bathroom",
    category: "bathroom",
    description: "Bathroom remodel showcasing quality craftsmanship and attention to detail. Beautiful design that enhances daily living.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-008-1.webp",
        alt: "Bathroom design - Project 8, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-008-2.webp",
        alt: "Bathroom vanity - Project 8, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 009
  {
    id: "bathroom-009",
    title: "Elegant Bathroom",
    category: "bathroom",
    description: "Spa-inspired bathroom renovation with premium materials and thoughtful design. Creating a serene and functional space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-009-1.webp",
        alt: "Bathroom design - Project 9, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 010
  {
    id: "bathroom-010",
    title: "Minimalist Bathroom",
    category: "bathroom",
    description: "Bathroom makeover featuring custom details and elegant finishes. Transforming your space into a personal sanctuary.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-010-1.webp",
        alt: "Bathroom design - Project 10, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-010-2.webp",
        alt: "Bathroom vanity - Project 10, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 011
  {
    id: "bathroom-011",
    title: "Traditional Bathroom",
    category: "bathroom",
    description: "Luxurious bathroom renovation featuring premium fixtures, elegant finishes, and spa-like amenities. Creating a relaxing retreat in your home.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-011-1.webp",
        alt: "Bathroom design - Project 11, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-011-2.webp",
        alt: "Bathroom vanity - Project 11, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-011-3.webp",
        alt: "Bathroom shower - Project 11, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 012
  {
    id: "bathroom-012",
    title: "Bathroom Makeover",
    category: "bathroom",
    description: "Complete bathroom transformation with custom vanity, walk-in shower, and high-end finishes. Modern design meets timeless elegance.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-012-1.webp",
        alt: "Bathroom design - Project 12, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-012-2.webp",
        alt: "Bathroom vanity - Project 12, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 013
  {
    id: "bathroom-013",
    title: "High-End Bathroom",
    category: "bathroom",
    description: "Bathroom remodel showcasing quality craftsmanship and attention to detail. Beautiful design that enhances daily living.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-013-1.webp",
        alt: "Bathroom design - Project 13, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-013-2.webp",
        alt: "Bathroom vanity - Project 13, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-013-3.webp",
        alt: "Bathroom shower - Project 13, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 014
  {
    id: "bathroom-014",
    title: "Bathroom Renovation",
    category: "bathroom",
    description: "Spa-inspired bathroom renovation with premium materials and thoughtful design. Creating a serene and functional space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-014-1.webp",
        alt: "Bathroom design - Project 14, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-014-2.webp",
        alt: "Bathroom vanity - Project 14, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 015
  {
    id: "bathroom-015",
    title: "Designer Bathroom",
    category: "bathroom",
    description: "Bathroom makeover featuring custom details and elegant finishes. Transforming your space into a personal sanctuary.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-015-1.webp",
        alt: "Bathroom design - Project 15, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 016
  {
    id: "bathroom-016",
    title: "Bathroom Detail",
    category: "bathroom",
    description: "Luxurious bathroom renovation featuring premium fixtures, elegant finishes, and spa-like amenities. Creating a relaxing retreat in your home.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-016-1.webp",
        alt: "Bathroom design - Project 16, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-016-2.webp",
        alt: "Bathroom vanity - Project 16, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 017
  {
    id: "bathroom-017",
    title: "Powder Room",
    category: "bathroom",
    description: "Complete bathroom transformation with custom vanity, walk-in shower, and high-end finishes. Modern design meets timeless elegance.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-017-1.webp",
        alt: "Bathroom design - Project 17, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 018
  {
    id: "bathroom-018",
    title: "Guest Bathroom",
    category: "bathroom",
    description: "Bathroom remodel showcasing quality craftsmanship and attention to detail. Beautiful design that enhances daily living.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-018-1.webp",
        alt: "Bathroom design - Project 18, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 019
  {
    id: "bathroom-019",
    title: "Bathroom Project",
    category: "bathroom",
    description: "Spa-inspired bathroom renovation with premium materials and thoughtful design. Creating a serene and functional space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-019-1.webp",
        alt: "Bathroom design - Project 19, Image 1 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-2.webp",
        alt: "Bathroom vanity - Project 19, Image 2 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-3.webp",
        alt: "Bathroom shower - Project 19, Image 3 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-4.webp",
        alt: "Bathroom detail - Project 19, Image 4 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-5.webp",
        alt: "Bathroom interior - Project 19, Image 5 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-6.webp",
        alt: "Bathroom fixtures - Project 19, Image 6 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-7.webp",
        alt: "Bathroom tile work - Project 19, Image 7 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-8.webp",
        alt: "Bathroom renovation - Project 19, Image 8 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-9.webp",
        alt: "Bathroom design - Project 19, Image 9 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-10.webp",
        alt: "Bathroom vanity - Project 19, Image 10 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-019-11.webp",
        alt: "Bathroom shower - Project 19, Image 11 of 11",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 020
  {
    id: "bathroom-020",
    title: "Bathroom Design",
    category: "bathroom",
    description: "Bathroom makeover featuring custom details and elegant finishes. Transforming your space into a personal sanctuary.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-020-1.webp",
        alt: "Bathroom design - Project 20, Image 1 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-2.webp",
        alt: "Bathroom vanity - Project 20, Image 2 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-3.webp",
        alt: "Bathroom shower - Project 20, Image 3 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-4.webp",
        alt: "Bathroom detail - Project 20, Image 4 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-5.webp",
        alt: "Bathroom interior - Project 20, Image 5 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-6.webp",
        alt: "Bathroom fixtures - Project 20, Image 6 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-7.webp",
        alt: "Bathroom tile work - Project 20, Image 7 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-8.webp",
        alt: "Bathroom renovation - Project 20, Image 8 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-9.webp",
        alt: "Bathroom design - Project 20, Image 9 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-020-10.webp",
        alt: "Bathroom vanity - Project 20, Image 10 of 10",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 021
  {
    id: "bathroom-021",
    title: "Bathroom Interior",
    category: "bathroom",
    description: "Luxurious bathroom renovation featuring premium fixtures, elegant finishes, and spa-like amenities. Creating a relaxing retreat in your home.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-021-1.webp",
        alt: "Bathroom design - Project 21, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/bathrooms/bathroom-021-2.webp",
        alt: "Bathroom vanity - Project 21, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 022
  {
    id: "bathroom-022",
    title: "Bathroom Finish",
    category: "bathroom",
    description: "Complete bathroom transformation with custom vanity, walk-in shower, and high-end finishes. Modern design meets timeless elegance.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-022-1.webp",
        alt: "Bathroom design - Project 22, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Bathroom Project 023
  {
    id: "bathroom-023",
    title: "Bathroom Space",
    category: "bathroom",
    description: "Bathroom remodel showcasing quality craftsmanship and attention to detail. Beautiful design that enhances daily living.",
    featured: false,
    images: [
      {
        url: "/images/gallery/bathrooms/bathroom-023-1.webp",
        alt: "Bathroom design - Project 23, Image 1",
        width: 1920, height: 1440,
        blurDataURL: BATHROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 001
  {
    id: "sunroom-001",
    title: "Sunroom Addition",
    category: "sunroom",
    description: "Sunroom addition featuring custom construction, natural light, and seamless integration with your home. Perfect for year-round enjoyment.",
    featured: true,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-001-1.webp",
        alt: "Sunroom design - Project 1, Image 1 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-001-2.webp",
        alt: "Sunroom interior - Project 1, Image 2 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-001-3.webp",
        alt: "Sunroom detail - Project 1, Image 3 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-001-4.webp",
        alt: "Sunroom view - Project 1, Image 4 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 002
  {
    id: "sunroom-002",
    title: "Custom Sunroom",
    category: "sunroom",
    description: "Custom sunroom design with attention to detail and quality craftsmanship. Creating a bright and inviting space.",
    featured: true,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-002-1.webp",
        alt: "Sunroom design - Project 2, Image 1 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-002-2.webp",
        alt: "Sunroom interior - Project 2, Image 2 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-002-3.webp",
        alt: "Sunroom detail - Project 2, Image 3 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-002-4.webp",
        alt: "Sunroom view - Project 2, Image 4 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 003
  {
    id: "sunroom-003",
    title: "Three-Season Room",
    category: "sunroom",
    description: "Sunroom addition showcasing beautiful finishes and thoughtful design. Bringing the outdoors in with style.",
    featured: true,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-003-1.webp",
        alt: "Sunroom design - Project 3, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-003-2.webp",
        alt: "Sunroom interior - Project 3, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 004
  {
    id: "sunroom-004",
    title: "Sunroom Design",
    category: "sunroom",
    description: "Three-season room addition with custom details and premium materials. Expanding your living space beautifully.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-004-1.webp",
        alt: "Sunroom design - Project 4, Image 1 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-004-2.webp",
        alt: "Sunroom interior - Project 4, Image 2 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-004-3.webp",
        alt: "Sunroom detail - Project 4, Image 3 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-004-4.webp",
        alt: "Sunroom view - Project 4, Image 4 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-004-5.webp",
        alt: "Sunroom construction - Project 4, Image 5 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 005
  {
    id: "sunroom-005",
    title: "Sunroom Renovation",
    category: "sunroom",
    description: "Sunroom project featuring quality construction and elegant design. Creating a versatile space for relaxation.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-005-1.webp",
        alt: "Sunroom design - Project 5, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-005-2.webp",
        alt: "Sunroom interior - Project 5, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 006
  {
    id: "sunroom-006",
    title: "Sunroom Project",
    category: "sunroom",
    description: "Sunroom addition featuring custom construction, natural light, and seamless integration with your home. Perfect for year-round enjoyment.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-006-1.webp",
        alt: "Sunroom design - Project 6, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-006-2.webp",
        alt: "Sunroom interior - Project 6, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 007
  {
    id: "sunroom-007",
    title: "Sunroom Space",
    category: "sunroom",
    description: "Custom sunroom design with attention to detail and quality craftsmanship. Creating a bright and inviting space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-007-1.webp",
        alt: "Sunroom design - Project 7, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-007-2.webp",
        alt: "Sunroom interior - Project 7, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-007-3.webp",
        alt: "Sunroom detail - Project 7, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 008
  {
    id: "sunroom-008",
    title: "Sunroom Detail",
    category: "sunroom",
    description: "Sunroom addition showcasing beautiful finishes and thoughtful design. Bringing the outdoors in with style.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-008-1.webp",
        alt: "Sunroom design - Project 8, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-008-2.webp",
        alt: "Sunroom interior - Project 8, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-008-3.webp",
        alt: "Sunroom detail - Project 8, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 009
  {
    id: "sunroom-009",
    title: "Sunroom Interior",
    category: "sunroom",
    description: "Three-season room addition with custom details and premium materials. Expanding your living space beautifully.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-009-1.webp",
        alt: "Sunroom design - Project 9, Image 1",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 010
  {
    id: "sunroom-010",
    title: "Sunroom Construction",
    category: "sunroom",
    description: "Sunroom project featuring quality construction and elegant design. Creating a versatile space for relaxation.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-010-1.webp",
        alt: "Sunroom design - Project 10, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-010-2.webp",
        alt: "Sunroom interior - Project 10, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 011
  {
    id: "sunroom-011",
    title: "Sunroom Finish",
    category: "sunroom",
    description: "Sunroom addition featuring custom construction, natural light, and seamless integration with your home. Perfect for year-round enjoyment.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-011-1.webp",
        alt: "Sunroom design - Project 11, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-011-2.webp",
        alt: "Sunroom interior - Project 11, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 012
  {
    id: "sunroom-012",
    title: "Sunroom View",
    category: "sunroom",
    description: "Custom sunroom design with attention to detail and quality craftsmanship. Creating a bright and inviting space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-012-1.webp",
        alt: "Sunroom design - Project 12, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-012-2.webp",
        alt: "Sunroom interior - Project 12, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-012-3.webp",
        alt: "Sunroom detail - Project 12, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 013
  {
    id: "sunroom-013",
    title: "Sunroom Addition",
    category: "sunroom",
    description: "Sunroom addition showcasing beautiful finishes and thoughtful design. Bringing the outdoors in with style.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-013-1.webp",
        alt: "Sunroom design - Project 13, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-013-2.webp",
        alt: "Sunroom interior - Project 13, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 014
  {
    id: "sunroom-014",
    title: "Sunroom Design",
    category: "sunroom",
    description: "Three-season room addition with custom details and premium materials. Expanding your living space beautifully.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-014-1.webp",
        alt: "Sunroom design - Project 14, Image 1 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-014-2.webp",
        alt: "Sunroom interior - Project 14, Image 2 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-014-3.webp",
        alt: "Sunroom detail - Project 14, Image 3 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-014-4.webp",
        alt: "Sunroom view - Project 14, Image 4 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 015
  {
    id: "sunroom-015",
    title: "Sunroom Project",
    category: "sunroom",
    description: "Sunroom project featuring quality construction and elegant design. Creating a versatile space for relaxation.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-015-1.webp",
        alt: "Sunroom design - Project 15, Image 1",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 016
  {
    id: "sunroom-016",
    title: "Sunroom Space",
    category: "sunroom",
    description: "Sunroom addition featuring custom construction, natural light, and seamless integration with your home. Perfect for year-round enjoyment.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-016-1.webp",
        alt: "Sunroom design - Project 16, Image 1",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 017
  {
    id: "sunroom-017",
    title: "Sunroom Detail",
    category: "sunroom",
    description: "Custom sunroom design with attention to detail and quality craftsmanship. Creating a bright and inviting space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-017-1.webp",
        alt: "Sunroom design - Project 17, Image 1 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-017-2.webp",
        alt: "Sunroom interior - Project 17, Image 2 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-017-3.webp",
        alt: "Sunroom detail - Project 17, Image 3 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-017-4.webp",
        alt: "Sunroom view - Project 17, Image 4 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-017-5.webp",
        alt: "Sunroom construction - Project 17, Image 5 of 5",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 018
  {
    id: "sunroom-018",
    title: "Sunroom Interior",
    category: "sunroom",
    description: "Sunroom addition showcasing beautiful finishes and thoughtful design. Bringing the outdoors in with style.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-018-1.webp",
        alt: "Sunroom design - Project 18, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-018-2.webp",
        alt: "Sunroom interior - Project 18, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-018-3.webp",
        alt: "Sunroom detail - Project 18, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 019
  {
    id: "sunroom-019",
    title: "Sunroom Construction",
    category: "sunroom",
    description: "Three-season room addition with custom details and premium materials. Expanding your living space beautifully.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-019-1.webp",
        alt: "Sunroom design - Project 19, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-019-2.webp",
        alt: "Sunroom interior - Project 19, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 020
  {
    id: "sunroom-020",
    title: "Sunroom Finish",
    category: "sunroom",
    description: "Sunroom project featuring quality construction and elegant design. Creating a versatile space for relaxation.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-020-1.webp",
        alt: "Sunroom design - Project 20, Image 1",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 021
  {
    id: "sunroom-021",
    title: "Sunroom View",
    category: "sunroom",
    description: "Sunroom addition featuring custom construction, natural light, and seamless integration with your home. Perfect for year-round enjoyment.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-021-1.webp",
        alt: "Sunroom design - Project 21, Image 1 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-021-2.webp",
        alt: "Sunroom interior - Project 21, Image 2 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-021-3.webp",
        alt: "Sunroom detail - Project 21, Image 3 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-021-4.webp",
        alt: "Sunroom view - Project 21, Image 4 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 022
  {
    id: "sunroom-022",
    title: "Sunroom Addition",
    category: "sunroom",
    description: "Custom sunroom design with attention to detail and quality craftsmanship. Creating a bright and inviting space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-022-1.webp",
        alt: "Sunroom design - Project 22, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-022-2.webp",
        alt: "Sunroom interior - Project 22, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 023
  {
    id: "sunroom-023",
    title: "Sunroom Design",
    category: "sunroom",
    description: "Sunroom addition showcasing beautiful finishes and thoughtful design. Bringing the outdoors in with style.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-023-1.webp",
        alt: "Sunroom design - Project 23, Image 1",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 024
  {
    id: "sunroom-024",
    title: "Sunroom Project",
    category: "sunroom",
    description: "Three-season room addition with custom details and premium materials. Expanding your living space beautifully.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-024-1.webp",
        alt: "Sunroom design - Project 24, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-024-2.webp",
        alt: "Sunroom interior - Project 24, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-024-3.webp",
        alt: "Sunroom detail - Project 24, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 025
  {
    id: "sunroom-025",
    title: "Sunroom Space",
    category: "sunroom",
    description: "Sunroom project featuring quality construction and elegant design. Creating a versatile space for relaxation.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-025-1.webp",
        alt: "Sunroom design - Project 25, Image 1",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 026
  {
    id: "sunroom-026",
    title: "Sunroom Detail",
    category: "sunroom",
    description: "Sunroom addition featuring custom construction, natural light, and seamless integration with your home. Perfect for year-round enjoyment.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-026-1.webp",
        alt: "Sunroom design - Project 26, Image 1 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-026-2.webp",
        alt: "Sunroom interior - Project 26, Image 2 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-026-3.webp",
        alt: "Sunroom detail - Project 26, Image 3 of 3",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 027
  {
    id: "sunroom-027",
    title: "Sunroom Interior",
    category: "sunroom",
    description: "Custom sunroom design with attention to detail and quality craftsmanship. Creating a bright and inviting space.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-027-1.webp",
        alt: "Sunroom design - Project 27, Image 1 of 6",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-027-2.webp",
        alt: "Sunroom interior - Project 27, Image 2 of 6",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-027-3.webp",
        alt: "Sunroom detail - Project 27, Image 3 of 6",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-027-4.webp",
        alt: "Sunroom view - Project 27, Image 4 of 6",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-027-5.webp",
        alt: "Sunroom construction - Project 27, Image 5 of 6",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-027-6.webp",
        alt: "Sunroom space - Project 27, Image 6 of 6",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 028
  {
    id: "sunroom-028",
    title: "Sunroom Construction",
    category: "sunroom",
    description: "Sunroom addition showcasing beautiful finishes and thoughtful design. Bringing the outdoors in with style.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-028-1.webp",
        alt: "Sunroom design - Project 28, Image 1 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-028-2.webp",
        alt: "Sunroom interior - Project 28, Image 2 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-028-3.webp",
        alt: "Sunroom detail - Project 28, Image 3 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-028-4.webp",
        alt: "Sunroom view - Project 28, Image 4 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-028-5.webp",
        alt: "Sunroom construction - Project 28, Image 5 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-028-6.webp",
        alt: "Sunroom space - Project 28, Image 6 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-028-7.webp",
        alt: "Sunroom finish - Project 28, Image 7 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-028-8.webp",
        alt: "Sunroom addition - Project 28, Image 8 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-028-9.webp",
        alt: "Sunroom design - Project 28, Image 9 of 9",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 029
  {
    id: "sunroom-029",
    title: "Sunroom Finish",
    category: "sunroom",
    description: "Three-season room addition with custom details and premium materials. Expanding your living space beautifully.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-029-1.webp",
        alt: "Sunroom design - Project 29, Image 1 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-029-2.webp",
        alt: "Sunroom interior - Project 29, Image 2 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-029-3.webp",
        alt: "Sunroom detail - Project 29, Image 3 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/sunrooms/sunroom-029-4.webp",
        alt: "Sunroom view - Project 29, Image 4 of 4",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Sunroom Project 030
  {
    id: "sunroom-030",
    title: "Sunroom View",
    category: "sunroom",
    description: "Sunroom project featuring quality construction and elegant design. Creating a versatile space for relaxation.",
    featured: false,
    images: [
      {
        url: "/images/gallery/sunrooms/sunroom-030-1.webp",
        alt: "Sunroom design - Project 30, Image 1",
        width: 1920, height: 1440,
        blurDataURL: SUNROOM_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 001
  {
    id: "millwork-001",
    title: "Custom Millwork",
    category: "millwork",
    description: "Custom millwork installation featuring quality craftsmanship and attention to detail. Beautiful built-ins that enhance your home.",
    featured: true,
    images: [
      {
        url: "/images/gallery/millwork/millwork-001-1.webp",
        alt: "Millwork detail - Project 1, Image 1",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 002
  {
    id: "millwork-002",
    title: "Built-In Millwork",
    category: "millwork",
    description: "Millwork project showcasing custom cabinetry and trim work. Premium materials and expert installation.",
    featured: true,
    images: [
      {
        url: "/images/gallery/millwork/millwork-002-1.webp",
        alt: "Millwork detail - Project 2, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-002-2.webp",
        alt: "Built-in millwork - Project 2, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 003
  {
    id: "millwork-003",
    title: "Custom Cabinetry",
    category: "millwork",
    description: "Custom millwork design featuring built-in storage and elegant details. Quality craftsmanship throughout.",
    featured: true,
    images: [
      {
        url: "/images/gallery/millwork/millwork-003-1.webp",
        alt: "Millwork detail - Project 3, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-003-2.webp",
        alt: "Built-in millwork - Project 3, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 004
  {
    id: "millwork-004",
    title: "Millwork Installation",
    category: "millwork",
    description: "Millwork installation with custom details and premium finishes. Enhancing your home with beautiful woodwork.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-004-1.webp",
        alt: "Millwork detail - Project 4, Image 1 of 4",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-004-2.webp",
        alt: "Built-in millwork - Project 4, Image 2 of 4",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-004-3.webp",
        alt: "Custom cabinetry - Project 4, Image 3 of 4",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-004-4.webp",
        alt: "Millwork installation - Project 4, Image 4 of 4",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 005
  {
    id: "millwork-005",
    title: "Custom Woodwork",
    category: "millwork",
    description: "Custom millwork project featuring quality materials and expert craftsmanship. Creating functional and beautiful spaces.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-005-1.webp",
        alt: "Millwork detail - Project 5, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-005-2.webp",
        alt: "Built-in millwork - Project 5, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 006
  {
    id: "millwork-006",
    title: "Millwork Detail",
    category: "millwork",
    description: "Custom millwork installation featuring quality craftsmanship and attention to detail. Beautiful built-ins that enhance your home.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-006-1.webp",
        alt: "Millwork detail - Project 6, Image 1",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 007
  {
    id: "millwork-007",
    title: "Custom Trim Work",
    category: "millwork",
    description: "Millwork project showcasing custom cabinetry and trim work. Premium materials and expert installation.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-007-1.webp",
        alt: "Millwork detail - Project 7, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-007-2.webp",
        alt: "Built-in millwork - Project 7, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 008
  {
    id: "millwork-008",
    title: "Millwork Project",
    category: "millwork",
    description: "Custom millwork design featuring built-in storage and elegant details. Quality craftsmanship throughout.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-008-1.webp",
        alt: "Millwork detail - Project 8, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-008-2.webp",
        alt: "Built-in millwork - Project 8, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 009
  {
    id: "millwork-009",
    title: "Custom Built-Ins",
    category: "millwork",
    description: "Millwork installation with custom details and premium finishes. Enhancing your home with beautiful woodwork.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-009-1.webp",
        alt: "Millwork detail - Project 9, Image 1",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 010
  {
    id: "millwork-010",
    title: "Millwork Design",
    category: "millwork",
    description: "Custom millwork project featuring quality materials and expert craftsmanship. Creating functional and beautiful spaces.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-010-1.webp",
        alt: "Millwork detail - Project 10, Image 1 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-010-2.webp",
        alt: "Built-in millwork - Project 10, Image 2 of 2",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 011
  {
    id: "millwork-011",
    title: "Custom Carpentry",
    category: "millwork",
    description: "Custom millwork installation featuring quality craftsmanship and attention to detail. Beautiful built-ins that enhance your home.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-011-1.webp",
        alt: "Millwork detail - Project 11, Image 1 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-2.webp",
        alt: "Built-in millwork - Project 11, Image 2 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-3.webp",
        alt: "Custom cabinetry - Project 11, Image 3 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-4.webp",
        alt: "Millwork installation - Project 11, Image 4 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-5.webp",
        alt: "Woodwork detail - Project 11, Image 5 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-6.webp",
        alt: "Custom trim work - Project 11, Image 6 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-7.webp",
        alt: "Millwork finish - Project 11, Image 7 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-8.webp",
        alt: "Custom millwork - Project 11, Image 8 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-9.webp",
        alt: "Millwork detail - Project 11, Image 9 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-10.webp",
        alt: "Built-in millwork - Project 11, Image 10 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-11.webp",
        alt: "Custom cabinetry - Project 11, Image 11 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-011-12.webp",
        alt: "Millwork installation - Project 11, Image 12 of 12",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 012
  {
    id: "millwork-012",
    title: "Millwork Finish",
    category: "millwork",
    description: "Millwork project showcasing custom cabinetry and trim work. Premium materials and expert installation.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-012-1.webp",
        alt: "Millwork detail - Project 12, Image 1 of 6",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-012-2.webp",
        alt: "Built-in millwork - Project 12, Image 2 of 6",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-012-3.webp",
        alt: "Custom cabinetry - Project 12, Image 3 of 6",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-012-4.webp",
        alt: "Millwork installation - Project 12, Image 4 of 6",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-012-5.webp",
        alt: "Woodwork detail - Project 12, Image 5 of 6",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-012-6.webp",
        alt: "Custom trim work - Project 12, Image 6 of 6",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 013
  {
    id: "millwork-013",
    title: "Custom Details",
    category: "millwork",
    description: "Custom millwork design featuring built-in storage and elegant details. Quality craftsmanship throughout.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-013-1.webp",
        alt: "Millwork detail - Project 13, Image 1 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-2.webp",
        alt: "Built-in millwork - Project 13, Image 2 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-3.webp",
        alt: "Custom cabinetry - Project 13, Image 3 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-4.webp",
        alt: "Millwork installation - Project 13, Image 4 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-5.webp",
        alt: "Woodwork detail - Project 13, Image 5 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-6.webp",
        alt: "Custom trim work - Project 13, Image 6 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-7.webp",
        alt: "Millwork finish - Project 13, Image 7 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-8.webp",
        alt: "Custom millwork - Project 13, Image 8 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-9.webp",
        alt: "Millwork detail - Project 13, Image 9 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-10.webp",
        alt: "Built-in millwork - Project 13, Image 10 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-11.webp",
        alt: "Custom cabinetry - Project 13, Image 11 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-12.webp",
        alt: "Millwork installation - Project 13, Image 12 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-13.webp",
        alt: "Woodwork detail - Project 13, Image 13 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      },
      {
        url: "/images/gallery/millwork/millwork-013-14.webp",
        alt: "Custom trim work - Project 13, Image 14 of 14",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
    ],
  },

  // Millwork Project 014
  {
    id: "millwork-014",
    title: "Millwork Installation",
    category: "millwork",
    description: "Millwork installation with custom details and premium finishes. Enhancing your home with beautiful woodwork.",
    featured: false,
    images: [
      {
        url: "/images/gallery/millwork/millwork-014-1.webp",
        alt: "Millwork detail - Project 14, Image 1",
        width: 1920, height: 1440,
        blurDataURL: MILLWORK_BLUR_DATA_URL,
      }
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

/**
 * Helper function to create a video entry from YouTube URL
 * @param url - YouTube URL (any format) or video ID
 * @param alt - Alt text for accessibility
 * @param width - Video width (default: 1920)
 * @param height - Video height (default: 1080)
 * @returns Video object ready to add to project.videos array
 */
export function createVideoFromYouTubeUrl(
  url: string,
  alt: string,
  width: number = 1920,
  height: number = 1080
) {
  return {
    type: 'youtube' as const,
    videoId: extractYouTubeId(url),
    alt,
    width,
    height,
  };
}
