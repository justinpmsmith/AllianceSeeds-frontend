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
        
        <!-- Loading Progress for Individual Products -->
        <div v-if="loadingProducts && !loading" class="mb-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-blue-700 dark:text-blue-300">
                Loading products... ({{ products.length }} of {{ totalProductCount }} loaded)
              </span>
              <span class="text-xs text-blue-600 dark:text-blue-400">
                {{ Math.round((products.length / totalProductCount) * 100) }}%
              </span>
            </div>
            <div class="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div 
                class="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(products.length / totalProductCount) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredProducts.length === 0 && !loadingProducts" class="text-center py-12">
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
            <span v-if="loadingProducts">(loading {{ totalProductCount - products.length }} more...)</span>
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="product in filteredProducts" :key="product.prodCode">
              <ProductCard :product="product" />
            </div>
            
            <!-- Loading placeholders for products still being fetched -->
            <div 
              v-if="loadingProducts" 
              v-for="n in Math.min(4, totalProductCount - products.length)" 
              :key="`placeholder-${n}`"
              class="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div class="aspect-square bg-gray-300 dark:bg-gray-600"></div>
              <div class="p-4">
                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
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
import { extractApiData } from '~/utils/apiUtils';

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
      totalProductCount: 0,
      loading: true,
      loadingProducts: false,
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
        return this.categoryDetails.photo;
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
    
    async fetchCategoryDetails() {
      try {
        const categoryName = this.category.toUpperCase();
        const categoryResponse = await Product.getCategoryByName(categoryName);
        this.categoryDetails = extractApiData(categoryResponse);
        
        if (!this.categoryDetails) {
          throw new Error(`Category '${categoryName}' not found`);
        }
      } catch (err) {
        console.error('Error fetching category details:', err);
        throw err;
      }
    },
    
    async loadProductsLazily() {
      try {
        this.loadingProducts = true;
        this.products = []; // Clear existing products
        
        const categoryName = this.category.toUpperCase();
        
        // Step 1: Get all product codes for the category
        const prodCodesResponse = await Product.getProdCodesByCategory(categoryName);
        const prodCodes = extractApiData(prodCodesResponse);
        
        if (!prodCodes || !Array.isArray(prodCodes) || prodCodes.length === 0) {
          console.log('No product codes found for this category.');
          this.totalProductCount = 0;
          return;
        }
        
        this.totalProductCount = prodCodes.length;
        console.log(`Found ${prodCodes.length} products in category. Loading them individually...`);
        
        // Step 2: For each product code, fetch the product and add it to the list
        for (let i = 0; i < prodCodes.length; i++) {
          const prodCode = prodCodes[i];
          
          try {
            const productResponse = await Product.getProductByProdCode(prodCode);
            const product = extractApiData(productResponse);
            
            if (product) {
              // Add to products array (this will update the UI as each product comes in)
              this.products.push(product);
              
              console.log(`Loaded product ${i + 1}/${prodCodes.length}: ${prodCode}`);
            }
          } catch (productError) {
            console.error(`Error loading product ${prodCode}:`, productError);
            // Continue with next product even if this one fails
          }
        }
        
        console.log(`Completed loading ${this.products.length} products.`);
      } catch (error) {
        console.error('Error loading product codes:', error);
        throw error;
      } finally {
        this.loadingProducts = false;
      }
    },
    
    async fetchCategoryAndProducts() {
      try {
        this.loading = true;
        this.error = null;
        
        // Fetch category details first
        await this.fetchCategoryDetails();
        
        // Then start lazy loading products
        await this.loadProductsLazily();
        
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