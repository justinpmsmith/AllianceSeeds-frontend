<template>
  <div>
    <AppHeader />

    <!-- Hero Section -->
    <HeroSection />

    <!-- Success Gallery with Image Carousel -->
    <div class="py-12 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8"
        >
          Success Gallery
        </h2>
        <p
          class="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
        >
          See the impressive results farmers have achieved with our high-quality
          seeds.
        </p>
        <ImageCarousel :images="carouselImages"  />
      </div>
    </div>

    <!-- Quick Access Cards -->
    <QuickAccessCards />

    <!-- Partner Links -->
    <PartnerLinks />

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AppHeader from "~/components/base/AppHeader.vue";
import AppFooter from "~/components/base/AppFooter.vue";
import ImageCarousel from "~/components/ImageCarousel.vue";
import PartnerLinks from "~/components/PartnerLinks.vue";
import QuickAccessCards from "~/components/QuickAccessCards.vue";
import HeroSection from "~/components/HeroSection.vue";

// Use Vite's import.meta.glob to dynamically import all images from the carousel directory
const carouselImageModules = import.meta.glob(
  "/public/images/carousel/*.{jpg,jpeg,png,gif,webp}",
  { eager: true }
);

// Process the image modules into the format needed for the carousel
const carouselImages = computed(() => {
  return Object.entries(carouselImageModules).map(([path, module]) => {
    // Extract filename without extension to use as caption
    const fileName = path.split("/").pop().split(".")[0];
    const displayName = fileName
      .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word

    return {
      src: path.replace("/public", ""), // Remove '/public' prefix to get correct URL
      alt: displayName,
      caption: displayName,
    };
  });
});

// Fallback images in case the dynamic loading doesn't work
const fallbackImages = [
  {
    src: "/images/placeholder-1.jpg",
    alt: "Healthy tomato plants",
    caption: "Tomato crop grown from Alliance Seeds",
  },
  {
    src: "/images/placeholder-2.jpg",
    alt: "Corn field",
    caption: "High-yield corn variety",
  },
];

onMounted(() => {
  // If no images were found with the glob pattern, use fallback images
  if (carouselImages.value.length === 0) {
    console.warn("No carousel images found. Using fallback images.");
    carouselImages.value = fallbackImages;
  }
});
</script>
