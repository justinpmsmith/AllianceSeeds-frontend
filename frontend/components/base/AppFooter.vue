<template>
  <footer class="bg-gray-600">
    <!-- dark:bg-gray-800 mt-16 -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Company Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ companyInfo.name }}</h3>
          <div class="space-y-2">
            <p class="text-gray-600 dark:text-gray-300">
              {{ companyInfo.contact.address.street }}<br>
              {{ companyInfo.contact.address.city }}, {{ companyInfo.contact.address.country }}
            </p>
            <p class="text-gray-600 dark:text-gray-300">{{ companyInfo.contact.phone }}</p>
            <p class="text-gray-600 dark:text-gray-300">{{ companyInfo.contact.email }}</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="(item, index) in companyInfo.navigation" :key="index">
              <NuxtLink 
                :to="item.path" 
                class="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Business Hours -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Hours</h3>
          <div class="space-y-2">
            <div>
              <p class="text-gray-600 dark:text-gray-300 font-medium">{{ businessHours.weekdays.days }}</p>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ businessHours.weekdays.hours }}</p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-300 font-medium">{{ businessHours.saturday.days }}</p>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ businessHours.saturday.hours }}</p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-300 font-medium">{{ businessHours.sunday.days }}</p>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ businessHours.sunday.hours }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
        <p>© {{ currentYear }} {{ companyInfo.name }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import config from "~/config";

export default {
  name: 'AppFooter',
  
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    
    companyInfo() {
      return config.company;
    },
    
    businessHours() {
      return config.company.businessHours;
    }
  }
};
</script>