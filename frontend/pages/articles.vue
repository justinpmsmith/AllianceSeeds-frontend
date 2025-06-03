<template>
    <div>
      <AppHeader />
  
      <!-- Articles Hero Section -->
      <ProductPageHero 
        title="Articles & Research" 
        subtitle="Read our latest agricultural insights and research findings."
      />
  
      <!-- Breadcrumbs -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </div>
  
      <!-- Articles Section -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="(article, index) in articles" 
            :key="index"
            class="group"
          >
            <div 
              ref="articleCards"
              :data-index="index"
              class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg cursor-pointer"
              @click="openArticle(article.path)"
            >
              <!-- Article Preview -->
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
                    <Icon name="material-symbols:article" class="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-500 dark:text-gray-400">Preview unavailable</p>
                  </div>
                </div>
                
                <!-- PDF Preview -->
                <img 
                  v-else-if="loadedPreviews[index]"
                  :src="loadedPreviews[index]" 
                  :alt="`${article.name} preview`"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <!-- Default State -->
                <div 
                  v-else 
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <Icon name="material-symbols:article" class="w-16 h-16 text-gray-400" />
                </div>
                
                <!-- Download Indicator -->
                <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="material-symbols:download" class="w-4 h-4" />
                </div>
              </div>
              
              <!-- Article Info -->
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {{ article.name }}
                </h3>
                <!-- <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PDF Article
                </p> -->
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Articles Message -->
        <div v-if="articles.length === 0" class="text-center py-12">
          <Icon name="material-symbols:folder-open" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-xl text-gray-600 dark:text-gray-400">No articles available at the moment.</p>
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
    name: 'ArticlesPage',
    
    components: {
      AppHeader,
      AppFooter,
      Breadcrumbs,
      ProductPageHero
    },
    
    data() {
      return {
        articles: [
          { path: "/articles/ZIMBABWE_FARMERS_DAY_2013.pdf", name: "Zimbabwe Farmers Day 2013" },
          { path: "/articles/TOMATO_SUMMARY.pdf", name: "Tomato Summary" },
          { path: "/articles/Carrot_Summary.pdf", name: "Carrot Summary" }
        ],
        loadedPreviews: {}, // Store generated preview URLs
        loadingStates: {},   // Track loading state for each article
        errorStates: {},     // Track error state for each article
        observer: null,      // Intersection Observer instance
        loadingQueue: [],    // Queue for PDFs waiting to load
        currentlyLoading: 0, // Number of PDFs currently loading
        maxConcurrentLoads: 2 // Maximum number of PDFs to load simultaneously
      };
    },
    
    computed: {
      breadcrumbs() {
        return [
          { name: 'Articles', path: null }
        ];
      }
    },
    
    methods: {
      openArticle(path) {
        // Open PDF in new tab
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
          
          // Use a stable CDN worker URL that matches the downgraded version
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          
          const article = this.articles[index];
          
          // Load PDF using the path directly
          const loadingTask = pdfjsLib.getDocument(article.path);
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
          console.error(`Error loading PDF preview for ${this.articles[index].name}:`, error);
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
        
        // Observe all article cards
        this.$nextTick(() => {
          if (this.$refs.articleCards) {
            this.$refs.articleCards.forEach((card) => {
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