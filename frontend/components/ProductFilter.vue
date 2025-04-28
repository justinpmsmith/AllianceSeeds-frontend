<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">Filters</h3>
        <button 
          @click="resetFilters" 
          class="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center"
        >
          <Icon name="material-symbols:refresh" class="mr-1" />
          Reset Filters
        </button>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Search by Name -->
        <div>
          <label for="name-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
          <input
            id="name-filter"
            v-model="localFilters.name"
            type="text"
            placeholder="Search by name"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <!-- Product Code Filter -->
        <div>
          <label for="code-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Code</label>
          <input
            id="code-filter"
            v-model="localFilters.prodCode"
            type="text"
            placeholder="Enter product code"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <!-- Sort Order -->
        <div>
          <label for="sort-order" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
          <select
            id="sort-order"
            v-model="localFilters.sortBy"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductFilter',
    
    props: {
      initialFilters: {
        type: Object,
        default: () => ({
          name: '',
          prodCode: '',
          sortBy: 'name-asc'
        })
      }
    },
    
    data() {
      return {
        localFilters: {
          name: this.initialFilters.name || '',
          prodCode: this.initialFilters.prodCode || '',
          sortBy: this.initialFilters.sortBy || 'name-asc'
        }
      };
    },
    
    methods: {
      resetFilters() {
        this.localFilters = {
          name: '',
          prodCode: '',
          sortBy: 'name-asc'
        };
        
        this.$emit('update:filters', { ...this.localFilters });
      }
    },
    
    watch: {
      // Watch for changes to localFilters and emit updates to parent
      localFilters: {
        handler(newFilters) {
          this.$emit('update:filters', { ...newFilters });
        },
        deep: true
      },
      
      // Watch for changes to initialFilters from parent
      initialFilters: {
        handler(newInitialFilters) {
          // Update local filters when parent changes initialFilters
          this.localFilters = {
            name: newInitialFilters.name || '',
            prodCode: newInitialFilters.prodCode || '',
            sortBy: newInitialFilters.sortBy || 'name-asc'
          };
        },
        deep: true
      }
    }
  };
  </script>