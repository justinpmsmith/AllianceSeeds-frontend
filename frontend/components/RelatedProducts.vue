<template>
  <div class="py-8 border-t border-gray-200 dark:border-gray-700 mt-8">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
    
    <div v-if="loading">
      <LoadingSpinner size="sm" text="Loading related products..." />
    </div>
    
    <div v-else-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>
    
    <div v-else-if="relatedProducts.length === 0 && !loadingProducts" class="text-gray-500 dark:text-gray-400 italic">
      No related products found.
    </div>
    
    <div v-else>
      <!-- Loading Progress for Individual Products -->
      <div v-if="loadingProducts && relatedProducts.length > 0" class="mb-4">
        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500 mr-2"></div>
          <span>Loading {{ Math.min(limit, totalRelatedCount) - relatedProducts.length }} more related products...</span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Loaded Products -->
        <div v-for="product in relatedProducts" :key="product.prodCode">
          <ProductCard :product="product" />
        </div>
        
        <!-- Loading placeholders for products still being fetched -->
        <div 
          v-if="loadingProducts" 
          v-for="n in Math.min(2, Math.min(limit, totalRelatedCount) - relatedProducts.length)" 
          :key="`related-placeholder-${n}`"
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
</template>

<script>
import ProductCard from '~/components/ProductCard.vue';
import LoadingSpinner from '~/components/LoadingSpinner.vue';
import Product from '~/services/server/product';
import { extractApiData } from '~/utils/apiUtils';

export default {
  name: 'RelatedProducts',
  
  components: {
    ProductCard,
    LoadingSpinner
  },
  
  props: {
    category: {
      type: String,
      required: true
    },
    currentProductCode: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      default: 4
    }
  },
  
  data() {
    return {
      relatedProducts: [],
      totalRelatedCount: 0,
      loading: true,
      loadingProducts: false,
      error: null
    };
  },
  
  methods: {
    async fetchRelatedProductsLazily() {
      if (!this.category) return;
      
      try {
        this.loading = true;
        this.loadingProducts = false;
        this.error = null;
        this.relatedProducts = []; // Clear existing products
        
        // Step 1: Get all product codes for the category
        const prodCodesResponse = await Product.getProdCodesByCategory(this.category);
        const allProdCodes = extractApiData(prodCodesResponse);
        
        if (!allProdCodes || !Array.isArray(allProdCodes)) {
          throw new Error('Failed to fetch related product codes');
        }
        
        // Filter out the current product code
        const relatedProdCodes = allProdCodes.filter(code => code !== this.currentProductCode);
        
        if (relatedProdCodes.length === 0) {
          this.totalRelatedCount = 0;
          this.loading = false;
          return;
        }
        
        // Limit the number of products we'll fetch
        const codesToFetch = relatedProdCodes.slice(0, this.limit);
        this.totalRelatedCount = relatedProdCodes.length;
        
        console.log(`Found ${relatedProdCodes.length} related products. Loading ${codesToFetch.length} products...`);
        
        // Initial loading is done, now start lazy loading individual products
        this.loading = false;
        this.loadingProducts = true;
        
        // Step 2: For each product code, fetch the product and add it to the list
        for (let i = 0; i < codesToFetch.length; i++) {
          const prodCode = codesToFetch[i];
          
          try {
            const productResponse = await Product.getProductByProdCode(prodCode);
            const product = extractApiData(productResponse);
            
            if (product) {
              // Add to related products array
              this.relatedProducts.push(product);
              
              console.log(`Loaded related product ${i + 1}/${codesToFetch.length}: ${prodCode}`);
            }
          } catch (productError) {
            console.error(`Error loading related product ${prodCode}:`, productError);
            // Continue with next product even if this one fails
          }
        }
        
        console.log(`Completed loading ${this.relatedProducts.length} related products.`);
        
      } catch (err) {
        console.error('Error fetching related products:', err);
        this.error = 'Unable to load related products';
      } finally {
        this.loading = false;
        this.loadingProducts = false;
      }
    }
  },
  
  mounted() {
    this.fetchRelatedProductsLazily();
  },
  
  watch: {
    // Watch for prop changes to reload data
    category() {
      this.fetchRelatedProductsLazily();
    },
    
    currentProductCode() {
      this.fetchRelatedProductsLazily();
    },
    
    limit() {
      this.fetchRelatedProductsLazily();
    }
  }
};
</script>