<template>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
      <strong v-if="title" class="font-bold">{{ title }}</strong>
      <span :class="title ? 'block sm:inline ml-2' : ''">{{ message }}</span>
      
      <div v-if="actionLink && actionText" class="mt-4">
        <NuxtLink 
          :to="actionLink" 
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          <Icon v-if="actionIcon" :name="actionIcon" class="mr-2 w-5 h-5" />
          {{ actionText }}
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    title: {
      type: String,
      default: 'Error!'
    },
    message: {
      type: String,
      required: true
    },
    actionLink: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: ''
    },
    actionIcon: {
      type: String,
      default: ''
    }
  });
  </script>