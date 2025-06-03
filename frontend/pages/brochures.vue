<template>
    <div>
      <AppHeader />
  
      <!-- Brochures Hero Section -->
      <ProductPageHero 
        title="Product Brochures" 
      />
      <!-- subtitle="Download our comprehensive guides and product information." -->
  
      <!-- Breadcrumbs -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </div>
  
      <!-- Brochures Section -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="(brochure, index) in brochures" 
            :key="index"
            class="group"
          >
            <div 
              ref="brochureCards"
              :data-index="index"
              class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg cursor-pointer"
              @click="openBrochure(brochure.path)"
            >
              <!-- Brochure Preview -->
              <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <!-- Loading State -->
                <div 
                  v-if="loadingStates[index]" 
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Loading preview...</p>
                  </div>
                </div>
                
                <!-- Error State -->
                <div 
                  v-else-if="errorStates[index]" 
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <div class="text-center">
                    <Icon name="material-symbols:description" class="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-500 dark:text-gray-400">Preview unavailable</p>
                  </div>
                </div>
                
                <!-- PDF Preview -->
                <img 
                  v-else-if="loadedPreviews[index]"
                  :src="loadedPreviews[index]" 
                  :alt="`${brochure.name} preview`"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <!-- Default State -->
                <div 
                  v-else 
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <Icon name="material-symbols:description" class="w-16 h-16 text-gray-400" />
                </div>
                
                <!-- Download Indicator -->
                <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="material-symbols:download" class="w-4 h-4" />
                </div>
              </div>
              
              <!-- Brochure Info -->
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {{ brochure.name }}
                </h3>
                <!-- <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PDF Brochure
                </p> -->
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Brochures Message -->
        <div v-if="brochures.length === 0" class="text-center py-12">
          <Icon name="material-symbols:folder-open" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-xl text-gray-600 dark:text-gray-400">No brochures available at the moment.</p>
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
    name: 'BrochuresPage',
    
    components: {
      AppHeader,
      AppFooter,
      Breadcrumbs,
      ProductPageHero
    },
    
    data() {
      return {
        brochures: [
          { path: "/brochures/BRASSCIA-BROCHURE-2014.pdf", name: "Brassica" },
          { path: "/brochures/CARROT-BROCHURE-2014small.pdf", name: "Carrot" },
          { path: "/brochures/PEPPER-BROCHURE-2014small.pdf", name: "Pepper" },
          { path: "/brochures/TOMATO-BROCHURE-2014small.pdf", name: "Tomatoes" }
        ],
        loadedPreviews: {}, // Store generated preview URLs
        loadingStates: {},   // Track loading state for each brochure
        errorStates: {},     // Track error state for each brochure
        observer: null,      // Intersection Observer instance
        loadingQueue: [],    // Queue for PDFs waiting to load
        currentlyLoading: 0, // Number of PDFs currently loading
        maxConcurrentLoads: 2 // Maximum number of PDFs to load simultaneously
      };
    },
    
    computed: {
      breadcrumbs() {
        return [
          { name: 'Brochures', path: null }
        ];
      }
    },
    
    methods: {
      openBrochure(path) {
        // Open PDF in new tab - path should work directly from public folder
        window.open(path, '_blank');
      },
      
      async loadPDFPreview(index) {
        if (this.loadedPreviews[index] || this.loadingStates[index] || this.errorStates[index]) {
          return; // Already loaded, loading, or failed
        }
        
        // Check if we can start loading (respect concurrency limit)
        if (this.currentlyLoading >= this.maxConcurrentLoads) {
          // Add to queue
          if (!this.loadingQueue.includes(index)) {
            this.loadingQueue.push(index);
          }
          return;
        }
        
        // Vue 3 way: direct assignment to reactive object
        this.loadingStates[index] = true;
        this.currentlyLoading++;
        
        try {
          // Import PDF.js from installed package
          const pdfjsLib = await import('pdfjs-dist');
          
          // Use a CDN worker URL that's more likely to be compatible
          // We'll try a few different versions if needed
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
          
          const brochure = this.brochures[index];
          
          // Load PDF using the path directly
          const loadingTask = pdfjsLib.getDocument(brochure.path);
          const pdf = await loadingTask.promise;
          
          // Get first page
          const page = await pdf.getPage(1);
          
          // Set up canvas for rendering
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          // Calculate scale to fit preview size (300px wide)
          const viewport = page.getViewport({ scale: 1 });
          const scale = 300 / viewport.width;
          const scaledViewport = page.getViewport({ scale });
          
          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          
          // Render page to canvas
          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
          };
          
          await page.render(renderContext).promise;
          
          // Convert canvas to blob URL
          canvas.toBlob((blob) => {
            const previewUrl = URL.createObjectURL(blob);
            // Vue 3 way: direct assignment to reactive object
            this.loadedPreviews[index] = previewUrl;
            this.loadingStates[index] = false;
            
            // Clean up
            this.currentlyLoading--;
            this.processQueue();
          }, 'image/jpeg', 0.8);
          
        } catch (error) {
          console.error(`Error loading PDF preview for ${this.brochures[index].name}:`, error);
          // Vue 3 way: direct assignment to reactive object
          this.errorStates[index] = true;
          this.loadingStates[index] = false;
          this.currentlyLoading--;
          this.processQueue();
        }
      },
      
      processQueue() {
        // Process next item in queue if available
        if (this.loadingQueue.length > 0 && this.currentlyLoading < this.maxConcurrentLoads) {
          const nextIndex = this.loadingQueue.shift();
          this.loadPDFPreview(nextIndex);
        }
      },
      
      setupIntersectionObserver() {
        // Create intersection observer for lazy loading
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.dataset.index);
              this.loadPDFPreview(index);
              // Stop observing this element once it's loaded
              this.observer.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '50px' // Start loading 50px before element comes into view
        });
        
        // Observe all brochure cards
        this.$nextTick(() => {
          if (this.$refs.brochureCards) {
            this.$refs.brochureCards.forEach((card) => {
              this.observer.observe(card);
            });
          }
        });
      },
      
      cleanupBlobUrls() {
        // Clean up blob URLs to prevent memory leaks
        Object.values(this.loadedPreviews).forEach((url) => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    },
    
    mounted() {
      this.setupIntersectionObserver();
    },
    
    beforeUnmount() {
      // Clean up observer and blob URLs
      if (this.observer) {
        this.observer.disconnect();
      }
      this.cleanupBlobUrls();
    }
  };
  </script>