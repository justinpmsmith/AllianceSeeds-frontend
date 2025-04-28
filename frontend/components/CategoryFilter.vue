<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">Filter Categories</h3>
        <button 
          v-if="hasFilters"
          @click="resetFilter" 
          class="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center"
        >
          <Icon name="material-symbols:refresh" class="mr-1" />
          Reset Filter
        </button>
      </div>
      
      <div class="flex items-center">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="material-symbols:search" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search categories..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            @input="emitFilterChange"
          />
          <button 
            v-if="searchQuery"
            @click="clearSearch" 
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <Icon name="material-symbols:close" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CategoryFilter',
    
    data() {
      return {
        searchQuery: ''
      };
    },
    
    computed: {
      hasFilters() {
        return this.searchQuery.trim() !== '';
      }
    },
    
    methods: {
      emitFilterChange() {
        this.$emit('filter', this.searchQuery.trim());
      },
      
      clearSearch() {
        this.searchQuery = '';
        this.emitFilterChange();
      },
      
      resetFilter() {
        this.searchQuery = '';
        this.emitFilterChange();
      }
    }
  };
  </script>