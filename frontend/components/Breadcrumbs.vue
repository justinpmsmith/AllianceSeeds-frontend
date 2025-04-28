<template>
    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 py-4">
      <NuxtLink to="/" class="hover:text-green-600 dark:hover:text-green-400 flex items-center">
        <Icon v-if="showHomeIcon" name="material-symbols:home" class="mr-1" />
        Home
      </NuxtLink>
      
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <span class="mx-2">/</span>
        
        <NuxtLink 
          v-if="crumb.path && index < breadcrumbs.length - 1" 
          :to="crumb.path" 
          class="hover:text-green-600 dark:hover:text-green-400"
        >
          {{ crumb.name }}
        </NuxtLink>
        
        <span v-else class="text-green-600 dark:text-green-400">
          {{ crumb.name }}
        </span>
      </template>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    breadcrumbs: {
      type: Array,
      required: true,
      /* Example:
        [
          { name: 'Products', path: '/products' },
          { name: 'Tomatoes', path: '/products/tomatoes' },
          { name: 'Roma Tomato', path: null } // Last item doesn't need a path
        ]
      */
    },
    showHomeIcon: {
      type: Boolean,
      default: true
    }
  });
  </script>