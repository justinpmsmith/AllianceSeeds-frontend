<template>
    <div>
      <AppHeader />
  
      <!-- Category Hero Section -->
      <ProductPageHero 
        :title="formatCategoryName(category)" 
        :subtitle="`Explore our premium quality ${formatCategoryName(category).toLowerCase()} seeds`"
        :fallbackImage="categoryBackground"
      />
  
      <!-- Breadcrumbs -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </div>
  
      <!-- Products Section -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner v-if="loading" text="Loading products..." />
        
        <ErrorMessage 
          v-else-if="error" 
          :message="error" 
          actionLink="/products" 
          actionText="Browse All Categories" 
          actionIcon="material-symbols:category"
        />
  
        <div v-else>
          <!-- Product Filters -->
          <ProductFilter @update:filters="updateFilters" :initial-filters="filters" />
          
          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <Icon name="material-symbols:inventory-2-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-xl text-gray-600 dark:text-gray-400">
              {{ products.length === 0 ? 'No products found in this category.' : 'No products match your filter criteria.' }}
            </p>
            <button 
              v-if="products.length > 0" 
              @click="resetFilters" 
              class="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Icon name="material-symbols:refresh" class="mr-1" />
              Reset Filters
            </button>
            <NuxtLink 
              v-else
              to="/products" 
              class="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Browse all categories
            </NuxtLink>
          </div>
  
          <div v-else>
            <!-- Results Count -->
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Showing {{ filteredProducts.length }} of {{ products.length }} products
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div v-for="product in filteredProducts" :key="product.prodCode">
                <ProductCard :product="product" />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <AppFooter />
    </div>
  </template>
  
  <script>
  import AppHeader from '~/components/base/AppHeader.vue';
  import AppFooter from '~/components/base/AppFooter.vue';
  import ProductCard from '~/components/ProductCard.vue';
  import LoadingSpinner from '~/components/LoadingSpinner.vue';
  import ErrorMessage from '~/components/ErrorMessage.vue';
  import ProductFilter from '~/components/ProductFilter.vue';
  import Breadcrumbs from '~/components/Breadcrumbs.vue';
  import ProductPageHero from '~/components/ProductPageHero.vue';
  import Product from '~/services/server/product';
  import { extractApiData, processApiResponses } from '~/utils/apiUtils';
  
  export default {
    name: 'CategoryPage',
    
    components: {
      AppHeader,
      AppFooter,
      ProductCard,
      LoadingSpinner,
      ErrorMessage,
      ProductFilter,
      Breadcrumbs,
      ProductPageHero
    },
    
    data() {
      return {
        categoryDetails: null,
        products: [],
        loading: true,
        error: null,
        filters: {
          name: '',
          prodCode: '',
          sortBy: 'name-asc'
        }
      };
    },
    
    computed: {
      category() {
        return this.$route.params.category;
      },
      
      breadcrumbs() {
        return [
          { name: 'Products', path: '/products' },
          { 
            name: this.formatCategoryName(this.category),
            path: null
          }
        ];
      },
      
      categoryBackground() {
        if (this.categoryDetails && 
            this.categoryDetails.photo && 
            this.categoryDetails.photo !== 'base64 string') {
          return 'data:image/jpeg;base64,' + this.categoryDetails.photo;
        }
        return '/assets/static/images/home/hero-background.jpg';
      },
      
      filteredProducts() {
        if (!this.products.length) return [];
        
        // Start with all products
        let result = [...this.products];
        
        // Filter by name (case-insensitive)
        if (this.filters.name) {
          const nameSearch = this.filters.name.toLowerCase();
          result = result.filter(product => 
            product.name.toLowerCase().includes(nameSearch)
          );
        }
        
        // Filter by product code (case-insensitive)
        if (this.filters.prodCode) {
          const codeSearch = this.filters.prodCode.toLowerCase();
          result = result.filter(product => 
            product.prodCode.toLowerCase().includes(codeSearch)
          );
        }
        
        // Sort products
        result.sort((a, b) => {
          switch (this.filters.sortBy) {
            case 'name-asc':
              return a.name.localeCompare(b.name);
            case 'name-desc':
              return b.name.localeCompare(a.name);
            default:
              return 0;
          }
        });
        
        return result;
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
      
      resetFilters() {
        this.filters.name = '';
        this.filters.prodCode = '';
        this.filters.sortBy = 'name-asc';
      },
      
      updateFilters(newFilters) {
        this.filters = { ...newFilters };
      },
      
      async fetchCategoryAndProducts() {
        try {
          this.loading = true;
          this.error = null;
          
          // Get category details
          const categoryName = this.category.toUpperCase();
          const categoryResponse = await Product.getCategoryByName(categoryName);
          this.categoryDetails = extractApiData(categoryResponse);
          
          if (!this.categoryDetails) {
            throw new Error(`Category '${categoryName}' not found`);
          }
          
          // Get products for this category
          const productsResponse = await Product.getProductsByCategory(categoryName);
          const categoryProducts = extractApiData(productsResponse);
          
          if (!categoryProducts || !Array.isArray(categoryProducts)) {
            throw new Error('Failed to fetch products');
          }
          
          this.products = categoryProducts;
          
        } catch (err) {
          console.error('Error fetching category data:', err);
          this.error = 'Unable to load products. Please try again later.';
        } finally {
          this.loading = false;
        }
      }
    },
    
    mounted() {
      this.fetchCategoryAndProducts();
    },
    
    watch: {
      // Watch for category param changes to reload data when navigating between categories
      category: {
        handler() {
          this.fetchCategoryAndProducts();
          this.resetFilters();
        }
      }
    }
  };
  </script>