<template>
    <NuxtLink :to="productLink" class="block h-full group">
      <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg">
        <!-- Product Image -->
        <div class="relative aspect-square overflow-hidden">
          <img 
            v-if="productImage" 
            :src="productImage" 
            :alt="product.name" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Icon name="material-symbols:eco" class="w-16 h-16 text-green-500 dark:text-green-400" />
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
            {{ product.name }}
          </h3>
          
          <p v-if="productDescription" class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {{ productDescription }}
          </p>
          
          <div class="mt-3">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Code: {{ product.prodCode }}
            </span>
          </div>
        </div>
      </div>
    </NuxtLink>
  </template>
  
  <script>
  export default {
    name: 'ProductCard',
    
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    
    computed: {
      productLink() {
        if (!this.product) return '/products';
        const category = this.product.category.toLowerCase();
        const prodCode = this.product.prodCode.toLowerCase();
        return `/products/${category}/${prodCode}`;
      },
      
      productImage() {
        try {
          if (!this.product.photos) return null;
          
          // Handle the case where photos is a string representation of an array
          if (typeof this.product.photos === 'string') {
            // Remove the single quotes and parse as JSON
            const cleanedString = this.product.photos.replace(/'/g, '"');
            const photoArray = JSON.parse(cleanedString);
            if (photoArray && photoArray.length > 0) {
              // Return the first photo directly without modification
              return photoArray[0];
            }
          }
          return null;
        } catch (err) {
          console.error('Error parsing product photos:', err);
          return null;
        }
      },
      
      productDescription() {
        try {
          if (!this.product.info) return '';
          const info = JSON.parse(this.product.info);
          return info.description || '';
        } catch (err) {
          console.error('Error parsing product info:', err);
          return '';
        }
      }
    }
  };
  </script>