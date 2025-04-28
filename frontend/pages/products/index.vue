<template>
  <div>
    <AppHeader />

    <!-- Products Hero Section -->
    <ProductPageHero 
      title="Product Categories" 
      subtitle="Explore our premium quality seeds."
    />

    <!-- Breadcrumbs -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <Breadcrumbs :breadcrumbs="breadcrumbs" />
    </div>

    <!-- Categories Section -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Category Filter -->
      <CategoryFilter @filter="filterCategories" />
      
      <LoadingSpinner v-if="loading" text="Loading categories..." />
      
      <ErrorMessage 
        v-else-if="error" 
        :message="error" 
        actionLink="/" 
        actionText="Return to Home" 
        actionIcon="material-symbols:home"
      />

      <div v-else-if="filteredCategories.length === 0" class="text-center py-12">
        <Icon name="material-symbols:category-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-xl text-gray-600 dark:text-gray-400">No categories found matching your search.</p>
        <button 
          @click="resetFilter" 
          class="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Icon name="material-symbols:refresh" class="mr-1" />
          Show All Categories
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="(category, index) in filteredCategories" :key="index">
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
import ProductPageHero from '~/components/ProductPageHero.vue';
import CategoryFilter from '~/components/CategoryFilter.vue';
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
    ProductPageHero,
    CategoryFilter
  },
  
  data() {
    return {
      categories: [],
      filteredCategories: [],
      searchQuery: '',
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
    
    filterCategories(query) {
      this.searchQuery = query;
      
      if (!query) {
        // If no search query, show all categories
        this.filteredCategories = [...this.categories];
      } else {
        // Filter categories by name
        const searchLower = query.toLowerCase();
        this.filteredCategories = this.categories.filter(category => 
          this.formatCategoryName(category.name).toLowerCase().includes(searchLower)
        );
      }
    },
    
    resetFilter() {
      this.searchQuery = '';
      this.filteredCategories = [...this.categories];
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
        
        // Initialize filtered categories with all categories
        this.filteredCategories = [...this.categories];
        
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