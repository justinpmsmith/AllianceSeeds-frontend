<template>
  <div class="carousel-container relative overflow-hidden mx-auto">
    <!-- Images -->
    <div 
      v-for="(image, index) in images" 
      :key="index"
      class="absolute top-0 left-0 w-full h-full transition-opacity duration-500"
      :class="{ 'opacity-100': currentIndex === index, 'opacity-0': currentIndex !== index }"
    >
      <div class="w-full h-full flex justify-center items-center">
        <img 
          :src="image.src" 
          :alt="image.alt" 
          class="object-cover w-full h-full"
        />
      </div>
      
      <!-- Optional caption -->
      <div 
        v-if="showCaptions && image.caption" 
        class="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white"
      >
        <p>{{ image.caption }}</p>
      </div>
    </div>

    <!-- Navigation buttons -->
    <button 
      @click="prev" 
      class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full focus:outline-none"
      aria-label="Previous image"
    >
      <i class="iconify" data-icon="heroicons:chevron-left"></i>
    </button>

    <button 
      @click="next" 
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full focus:outline-none"
      aria-label="Next image"
    >
      <i class="iconify" data-icon="heroicons:chevron-right"></i>
    </button>

    <!-- Indicators (dots) -->
    <div 
      v-if="showIndicators" 
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
    >
      <button 
        v-for="(_, index) in images" 
        :key="index"
        @click="goToSlide(index)"
        class="w-2 h-2 rounded-full focus:outline-none transition-colors duration-300"
        :class="currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  // Array of image objects with src, alt, and optional caption
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  // Auto-rotation interval in milliseconds (0 to disable)
  interval: {
    type: Number,
    default: 5000
  },
  // Show image captions
  showCaptions: {
    type: Boolean,
    default: false
  },
  // Show indicator dots
  showIndicators: {
    type: Boolean,
    default: true
  }
});

const currentIndex = ref(0);
let autoplayInterval = null;

const next = () => {
  if (currentIndex.value >= props.images.length - 1) {
    currentIndex.value = 0;
  } else {
    currentIndex.value++;
  }
};

const prev = () => {
  if (currentIndex.value <= 0) {
    currentIndex.value = props.images.length - 1;
  } else {
    currentIndex.value--;
  }
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

// Start autoplay if interval > 0
const startAutoplay = () => {
  if (props.interval > 0) {
    autoplayInterval = setInterval(() => {
      next();
    }, props.interval);
  }
};

// Stop autoplay
const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>

<style scoped>
.carousel-container {
  /* Default for large screens */
  width: 60%;
  height: 500px;
}

/* Medium-sized screens (tablets) */
@media (max-width: 1024px) {
  .carousel-container {
    width: 80%;
    height: 350px;
  }
}

/* Small screens (phones) */
@media (max-width: 500px) {
  .carousel-container {
    width: 80%;
    height: 150px;
  }
}
</style>