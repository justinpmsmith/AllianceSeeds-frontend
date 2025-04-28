<template>
  <div class="relative bg-gray-900 py-12">
    <div class="absolute inset-0 z-0 opacity-60">
      <img
        src="/assets/static/images/home/productsHero.jpg"
        :alt="title"
        class="w-full h-full object-cover"
        :onerror="`this.src='${fallbackImage}'`"
      />
    </div>
    <div
      class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center"
    >
      <h1 class="text-4xl font-bold text-white mb-4">{{ title }}</h1>
      <p v-if="subtitle" class="text-xl text-gray-200 max-w-3xl mx-auto">
        {{ subtitle }}
      </p>
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  fallbackImage: {
    type: String,
    //   default: '/assets/static/images/home/hero-background.jpg'
  },
});
</script>
