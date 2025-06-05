<template>
    <div>
      <AppHeader />
  
      <!-- About Hero Section -->
      <ProductPageHero 
        title="About Alliance Seeds" 
        subtitle=""
      />
  
      <!-- Breadcrumbs -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </div>
  
      <!-- Company Information Section -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="max-w-4xl mx-auto">
          <div class="prose dark:prose-invert max-w-none">
            <div class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed space-y-6">
              <p>
                Alliance Seeds is founded on good relationships, personal service, and technical support to growers, offering an extensive range of high quality hybrid vegetable seed from CLAUSE. Providing the best available product to the farmer is critical to successful farming, this is what Alliance Seeds strives to accomplish. Planting high quality hybrid varieties with built in disease resistances, ensures peace of mind, marketable products, higher yields and more productive farmers.
              </p>
              
              <p>
                Thorough knowledge of local conditions, regional disease pressures and market needs is the key to success, this, combined with excellent personal service and the backup of one of the largest and oldest seed producing companies in the world, HM Clause, Alliance Seeds offers a comprehensive solution. Keeping up to date with problems specifically related to crop threatening diseases is of utmost importance. Knowledge of these diseases and the pressures that farmers face in various regions in Southern Africa enables Alliance Seeds to source high quality hybrid varieties that have resistance against these diseases thereby improving plant health and ultimately increasing marketable yields.
              </p>
              
              <p>
                Farming is a science in its own right, and Alliance Seeds can assist producers by offering the most suited variety adapted to specific conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Team Section -->
      <div class="bg-gray-50 dark:bg-gray-800 py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Meet The Team</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="(employee, index) in employees" :key="index" class="group">
              <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg">
                <!-- Employee Photo -->
                <div class="relative aspect-square overflow-hidden">
                  <img 
                    :src="`/images/about/${employee.image}`" 
                    :alt="employee.name" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    @error="handleImageError($event)"
                  />
                </div>
                
                <!-- Employee Info -->
                <div class="p-4">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ employee.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ employee.role }}
                  </p>
                  <div v-if="employee.cell" class="flex items-center text-sm text-green-600 dark:text-green-400">
                    <Icon name="material-symbols:phone-enabled" class="w-4 h-4 mr-1" />
                    <a :href="`tel:${employee.cell}`" class="hover:underline">
                      {{ employee.cell }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Contact CTA Section -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 text-center">
          <h3 class="text-2xl font-semibold text-green-800 dark:text-green-400 mb-4">
            Ready to Partner with Us?
          </h3>
          <p class="text-green-700 dark:text-green-300 mb-6 max-w-2xl mx-auto">
            Get in touch with our experienced team to discuss your seed requirements and discover how we can help improve your farming success.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/contact" 
              class="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <Icon name="material-symbols:mail-outline" class="mr-2" />
              Contact Us
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md transition-colors"
            >
              <Icon name="material-symbols:store-outline" class="mr-2" />
              View Products
            </NuxtLink>
          </div>
        </div>
      </div>
  
      <AppFooter />
    </div>
  </template>
  
  <script>
  import AppHeader from '~/components/base/AppHeader.vue';
  import AppFooter from '~/components/base/AppFooter.vue';
  import Breadcrumbs from '~/components/Breadcrumbs.vue';
  import ProductPageHero from '~/components/ProductPageHero.vue';
  
  export default {
    name: 'AboutPage',
    
    components: {
      AppHeader,
      AppFooter,
      Breadcrumbs,
      ProductPageHero
    },
    
    data() {
      return {
        employees: [
          {
            name: "Craig Nel",
            image: "craig.jpg",
            role: "Executive Director",
            cell: "+2783 630 6084"
          },
          {
            name: "Eugene Nel",
            image: "eugene.jpg",
            role: "Executive Logistics",
            cell: "+2782 460 4796"
          },
          {
            name: "Clint Deeks",
            image: "clint.jpg",
            role: "Executive Area Manager, Mpumalanga Incl. Eswatini & KZN",
            cell: "+2772 130 3322"
          },
          {
            name: "Tinus Burger",
            image: "tinus.jpg",
            role: "Area manager – Cape",
            cell: "+2760 910 5731"
          },
          {
            name: "Hanco Botha",
            image: "hanco.jpg",
            role: "Area Manager – Gauteng",
            cell: "+2772 345 7436"
          },
          {
            name: "Norman Mc Guire",
            image: "norman.jpg",
            role: "Area Manager – Limpopo",
            cell: "+2776 011 7621"
          },
          {
            name: "Brian Tilly",
            image: "brian.jpg",
            role: "Area Manager – Limpopo",
            cell: "+2783 310 6362"
          },
          {
            name: "Sienie vd Berg",
            image: "sienie.jpg",
            role: "Administration",
            cell: ""
          },
          {
            name: "Belinda Diederiks",
            image: "belinda.jpg",
            role: "Financial Administrator",
            cell: ""
          }
        ]
      };
    },
    
    computed: {
      breadcrumbs() {
        return [
          { name: 'About', path: null }
        ];
      }
    },
    
    methods: {
      handleImageError(event) {
        // Fallback to a default avatar if employee image fails to load
        event.target.src = '/images/about/default-avatar.jpg';
        // Or you could use a placeholder icon instead
        console.warn(`Failed to load image for employee: ${event.target.alt}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .font-cursive {
    font-family: 'Dancing Script', 'Brush Script MT', cursive;
  }
  
  /* Alternative cursive fonts you could use instead */
  /* font-family: 'Pacifico', cursive; */
  /* font-family: 'Great Vibes', cursive; */
  /* font-family: 'Satisfy', cursive; */
  </style>