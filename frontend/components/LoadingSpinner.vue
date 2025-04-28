<template>
    <div class="flex justify-center items-center py-8">
      <div 
        class="animate-spin rounded-full border-t-2 border-b-2 border-green-500"
        :class="sizeClass"
      ></div>
      <span v-if="text" class="ml-3 text-gray-600 dark:text-gray-400">{{ text }}</span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    size: {
      type: String,
      default: 'md', // Options: 'sm', 'md', 'lg'
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    text: {
      type: String,
      default: ''
    }
  });
  
  const sizeClass = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-16 w-16';
      case 'md':
      default:
        return 'h-12 w-12';
    }
  });
  </script>