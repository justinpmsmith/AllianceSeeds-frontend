<template>
    <NuxtLink :to="categoryLink" class="block h-full group">
      <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg">
        <!-- Category Image -->
        <div class="relative aspect-square overflow-hidden">
          <img 
            v-if="categoryImage" 
            :src="categoryImage" 
            :alt="category.name" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Icon name="material-symbols:agriculture" class="w-24 h-24 text-green-500 dark:text-green-400" />
          </div>
        </div>
        
        <!-- Category Info -->
        <div class="p-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
            {{ formattedCategoryName }}
          </h3>
        </div>
      </div>
    </NuxtLink>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    category: {
      type: Object,
      required: true
    }
  });
  
  // Format the category name for display
  const formattedCategoryName = computed(() => {
    if (!props.category.name) return '';
    return props.category.name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });
  
  // Compute the category link
  const categoryLink = computed(() => {
    if (!props.category.name) return '/products';
    return `/products/${props.category.name.toLowerCase()}`;
  });
  
  // Extract the category image
  const categoryImage = computed(() => {
    if (!props.category.photo || props.category.photo === 'base64 string') {
      return null;
    }

    return props.category.photo;
  });
  </script>