<template>
    <div class="py-8 border-t border-gray-200 dark:border-gray-700 mt-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
      
      <div v-if="loading">
        <LoadingSpinner size="sm" text="Loading related products..." />
      </div>
      
      <div v-else-if="error" class="text-red-500 mb-4">
        {{ error }}
      </div>
      
      <div v-else-if="relatedProducts.length === 0" class="text-gray-500 dark:text-gray-400 italic">
        No related products found.
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="product in relatedProducts" :key="product.prodCode">
          <ProductCard :product="product" />
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
        loading: true,
        error: null
      };
    },
    
    methods: {
      async fetchRelatedProducts() {
        if (!this.category) return;
        
        try {
          this.loading = true;
          this.error = null;
          
          // Get all products in the same category
          const response = await Product.getProductsByCategory(this.category);
          const categoryProducts = extractApiData(response);
          
          if (!categoryProducts || !Array.isArray(categoryProducts)) {
            throw new Error('Failed to fetch related products');
          }
          
          // Filter out the current product and limit the number of results
          this.relatedProducts = categoryProducts
            .filter(product => product.prodCode !== this.currentProductCode)
            .slice(0, this.limit);
          
        } catch (err) {
          console.error('Error fetching related products:', err);
          this.error = 'Unable to load related products';
        } finally {
          this.loading = false;
        }
      }
    },
    
    mounted() {
      this.fetchRelatedProducts();
    },
    
    watch: {
      // Watch for prop changes to reload data
      category() {
        this.fetchRelatedProducts();
      },
      
      currentProductCode() {
        this.fetchRelatedProducts();
      }
    }
  };
  </script>