<template>
    <footer class="bg-gray-600 ">
      <!-- dark:bg-gray-800 mt-16 -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Company Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alliance Seeds</h3>
            <div class="flex items-start mb-2">
              <UIcon name="i-heroicons-map-pin" class="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-1" />
              <p class="text-gray-600 dark:text-gray-300">
                123 Seed Farm Road<br>
                Farmtown, South Africa
              </p>
            </div>
            <div class="flex items-center mb-2">
              <UIcon name="i-heroicons-phone" class="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <p class="text-gray-600 dark:text-gray-300">+27 12 345 6789</p>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <p class="text-gray-600 dark:text-gray-300">info@allianceseeds.co.za</p>
            </div>
          </div>
  
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li v-for="(item, index) in quickLinks" :key="index">
                <NuxtLink 
                  :to="item.path" 
                  class="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                >
                  {{ item.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
  
          <!-- Newsletter Signup (Optional) -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stay Updated</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Subscribe to our newsletter for the latest seed products and agricultural news.
            </p>
            <div class="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                class="flex-1 px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
              />
              <button 
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-md focus:outline-none"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
  
        <!-- Copyright -->
        <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>© {{ new Date().getFullYear() }} Alliance Seeds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Brochures', path: '/brochures' },
    { name: 'Articles', path: '/articles' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];
  </script>