<template>
  <div class="py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Quick Access</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <NuxtLink 
          v-for="(card, index) in quickAccessCards" 
          :key="index" 
          :to="card.link" 
          class="group block"
        >
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg h-full flex flex-col">
            <div class="flex-1 flex flex-col items-center justify-center p-6">
              <!-- <div class="bg-green-100 dark:bg-green-900/30 p-5 rounded-full mb-4"> -->
                <Icon 
                  :name="card.icon" 
                  mode="svg" 
                  style="color: #16a34a" 
                  size="2rem" 
                />
              <!-- </div> -->
               <br>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 text-center">
                {{ card.title }}
              </h3>
              <p v-if="card.description" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                {{ card.description }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const quickAccessCards = [
  {
    title: 'Products',
    icon: 'material-symbols:storefront-outline',
    description: 'Browse our catalog',
    link: '/products'
  },
  {
    title: 'Brochures',
    icon: 'material-symbols:folder-info',
    description: 'Download product information',
    link: '/brochures'
  },
  {
    title: 'Articles',
    icon: 'material-symbols:article',
    description: 'Read farming insights',
    link: '/articles'
  },
  {
    title: 'About Us',
    icon: 'material-symbols:account-box-sharp',
    description: 'Learn our story',
    link: '/about'
  },
  {
    title: 'Contact',
    icon: 'material-symbols:chat-info-outline',
    description: 'Get in touch with us',
    link: '/contact'
  }
];
</script>