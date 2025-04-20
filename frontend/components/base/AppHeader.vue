<template>
  <header class="bg-gray-1000">
    <!-- dark:border-gray-800 -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <img src="/assets/static/images/logo_final.png" alt="Alliance Seeds Logo" class="h-10 w-auto" />
          <span class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Alliance Seeds</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/" class="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
            Home
          </NuxtLink>
          <NuxtLink to="/products" class="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
            Products
          </NuxtLink>
          <NuxtLink to="/brochures" class="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
            Brochures
          </NuxtLink>
          <NuxtLink to="/articles" class="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
            Articles
          </NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
            About
          </NuxtLink>
          <NuxtLink to="/contact" class="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400">
            Contact
          </NuxtLink>
        </nav>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="isMenuOpen = !isMenuOpen" 
            type="button" 
            class="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="Toggle menu"
          >
            <i v-if="isMenuOpen" class="iconify h-6 w-6" data-icon="heroicons:x-mark"></i>
            <i v-else class="iconify h-6 w-6" data-icon="heroicons:bars-3"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden pb-4">
        <div class="flex flex-col space-y-4">
          <NuxtLink 
            v-for="(item, index) in navItems" 
            :key="index" 
            :to="item.path" 
            class="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Brochures', path: '/brochures' },
  { name: 'Articles', path: '/articles' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
];
</script>