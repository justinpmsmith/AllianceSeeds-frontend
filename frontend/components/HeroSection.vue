<template>
  <div class="relative bg-gray-900 overflow-hidden">
    <!-- Background image -->
    <div class="absolute inset-0">
      <img 
        src="/assets/static/images/home/hero-background.jpg" 
        alt="Field of crops" 
        class="w-full h-full object-cover opacity-60"
      />
    </div>
    
    <!-- Content -->
    <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div class="max-w-2xl">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">AllianceSeeds</h1>
        <p class="text-xl text-gray-200 mb-8">
          Seeding The Future Together
        </p>
        <NuxtLink 
          to="/products" 
          class="inline-flex items-center px-6 py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-300"
        >
          <i class="iconify mr-2" data-icon="mdi:seed"></i>
          Browse Our Products
        </NuxtLink>
      </div>
    </div>
  </div>
</template>