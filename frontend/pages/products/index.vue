<template>
    <div>
      <AppHeader />
  
      <!-- Products Hero Section -->
      <PageHero 
        title="Product Categories" 
        subtitle="Explore our premium quality seeds."
      />
  
      <!-- Breadcrumbs -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </div>
  
      <!-- Categories Section -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner v-if="loading" text="Loading categories..." />
        
        <ErrorMessage 
          v-else-if="error" 
          :message="error" 
          actionLink="/" 
          actionText="Return to Home" 
          actionIcon="material-symbols:home"
        />
  
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="(category, index) in categories" :key="index">
            <CategoryCard :category="category" />
          </div>
        </div>
      </div>
  
      <AppFooter />
    </div>
  </template>
  
  <script>
  import AppHeader from '~/components/base/AppHeader.vue';
  import AppFooter from '~/components/base/AppFooter.vue';
  import CategoryCard from '~/components/CategoryCard.vue';
  import LoadingSpinner from '~/components/LoadingSpinner.vue';
  import ErrorMessage from '~/components/ErrorMessage.vue';
  import Breadcrumbs from '~/components/Breadcrumbs.vue';
  import PageHero from '~/components/ProductPageHero.vue';
  import Product from '~/services/server/product';
  import { extractApiData, processApiResponses } from '~/utils/apiUtils';
  
  export default {
    name: 'ProductsIndexPage',
    
    components: {
      AppHeader,
      AppFooter,
      CategoryCard,
      LoadingSpinner,
      ErrorMessage,
      Breadcrumbs,
      PageHero
    },
    
    data() {
      return {
        categories: [],
        loading: true,
        error: null
      };
    },
    
    computed: {
      breadcrumbs() {
        return [
          { name: 'Products', path: null }
        ];
      }
    },
    
    methods: {
      formatCategoryName(name) {
        if (!name) return '';
        return name
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      },
      
      async fetchCategories() {
        try {
          this.loading = true;
          this.error = null;
          
          // Get all category names
          const response = await Product.getCategoryNames();
          const categoryNames = extractApiData(response);
          
          if (!categoryNames || !Array.isArray(categoryNames)) {
            throw new Error('Invalid category data received');
          }
          
          // Fetch details for each category
          const categoryPromises = categoryNames.map(name => Product.getCategoryByName(name));
          const categoryResponses = await Promise.all(categoryPromises);
          
          // Process the responses to extract data
          this.categories = processApiResponses(categoryResponses);
          
        } catch (err) {
          console.error('Error fetching categories:', err);
          // Generic user-friendly error message instead of displaying backend message
          this.error = 'Unable to load product categories. Please try again later.';
        } finally {
          this.loading = false;
        }
      }
    },
    
    mounted() {
      this.fetchCategories();
    }
  };
  </script>