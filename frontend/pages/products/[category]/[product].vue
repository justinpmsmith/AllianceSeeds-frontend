<template>
  <div>
    <AppHeader />

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumbs -->
      <Breadcrumbs :breadcrumbs="breadcrumbs" />

      <LoadingSpinner v-if="loading" text="Loading product details..." />

      <ErrorMessage
        v-else-if="error"
        :message="error"
        actionLink="/products"
        actionText="Return to Products"
        actionIcon="material-symbols:store-outline"
      />

      <div v-else>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div class="relative">
            <!-- Main Image with modal -->
            <div class="mb-6 relative">
              <div
                v-if="productPhotos.length > 0"
                @click="openImageModal(activePhotoIndex)"
                class="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
              >
                <img
                  :src="productPhotos[activePhotoIndex]"
                  :alt="productData.name"
                  class="w-full h-full object-contain"
                />
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"
                >
                  <div
                    class="bg-black bg-opacity-50 p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"
                  >
                    <Icon
                      name="material-symbols:zoom-in"
                      class="text-white w-6 h-6"
                    />
                  </div>
                </div>
              </div>

              <div
                v-else
                class="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <Icon
                  name="material-symbols:eco"
                  class="w-24 h-24 text-gray-400"
                />
              </div>
            </div>

            <!-- Thumbnail gallery -->
            <div v-if="productPhotos.length > 1" class="grid grid-cols-5 gap-2">
              <div
                v-for="(photo, index) in productPhotos"
                :key="index"
                @click="activePhotoIndex = index"
                class="aspect-square overflow-hidden rounded cursor-pointer border-2 relative"
                :class="
                  activePhotoIndex === index
                    ? 'border-green-500'
                    : 'border-transparent'
                "
              >
                <img
                  :src="photo"
                  :alt="`${productData.name} - view ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <!-- Image Modal -->
            <div
              v-if="isImageModalOpen"
              class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
            >
              <div class="relative max-w-5xl w-full">
                <!-- Close button -->
                <button
                  @click="closeImageModal"
                  class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                >
                  <Icon name="material-symbols:close" class="w-6 h-6" />
                </button>

                <!-- Modal image -->
                <div
                  class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden"
                >
                  <img
                    :src="productPhotos[modalPhotoIndex]"
                    :alt="productData.name"
                    class="w-full h-auto max-h-[80vh] object-contain"
                  />
                </div>

                <!-- Navigation buttons -->
                <div
                  class="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4"
                >
                  <button
                    v-if="productPhotos.length > 1"
                    @click="prevModalImage"
                    class="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                  >
                    <Icon
                      name="material-symbols:chevron-left"
                      class="w-6 h-6"
                    />
                  </button>
                  <button
                    v-if="productPhotos.length > 1"
                    @click="nextModalImage"
                    class="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                  >
                    <Icon
                      name="material-symbols:chevron-right"
                      class="w-6 h-6"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Information -->
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {{ productData.name }}
            </h1>

            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-400">Product Code</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ productData.prodCode }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Category</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ formatCategoryName(productData.category) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="prose dark:prose-invert max-w-none mb-6">
              <h2 class="text-xl font-semibold mb-2 text-gray-400">
                Description
              </h2>
              <div
                v-if="productDescription"
                class="text-gray-700 dark:text-gray-300 whitespace-pre-line"
              >
                {{ productDescription }}
              </div>
              <p v-else class="text-gray-500 dark:text-gray-400 italic">
                No description available for this product.
              </p>
            </div>

            <!-- Document Download -->
            <div v-if="hasDocument" class="mb-6">
              <h2 class="text-xl font-semibold mb-2 text-gray-400">
                Product Documentation
              </h2>
              <button
                @click="downloadDocument"
                class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                <Icon name="material-symbols:download" class="mr-2" />
                Download Product Document
              </button>
            </div>

            <!-- Contact for Purchase CTA -->
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mt-8">
              <h3
                class="text-lg font-semibold text-green-800 dark:text-green-400 mb-2"
              >
                Interested in this product?
              </h3>
              <p class="text-green-700 dark:text-green-300 mb-4">
                Contact our sales team for pricing and availability information.
              </p>
              <NuxtLink
                to="/contact"
                class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                <Icon name="material-symbols:mail-outline" class="mr-2" />
                Contact Us
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Related Products Section -->
        <RelatedProducts
          :category="productData.category"
          :current-product-code="productData.prodCode"
          :limit="4"
        />
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "~/components/base/AppHeader.vue";
import AppFooter from "~/components/base/AppFooter.vue";
import LoadingSpinner from "~/components/LoadingSpinner.vue";
import ErrorMessage from "~/components/ErrorMessage.vue";
import RelatedProducts from "~/components/RelatedProducts.vue";
import Breadcrumbs from "~/components/Breadcrumbs.vue";
import Product from "~/services/server/product";
import { extractApiData } from "~/utils/apiUtils";

export default {
  name: "ProductDetailPage",

  components: {
    AppHeader,
    AppFooter,
    LoadingSpinner,
    ErrorMessage,
    RelatedProducts,
    Breadcrumbs,
  },

  data() {
    return {
      productData: {},
      loading: true,
      error: null,
      activePhotoIndex: 0,
      isImageModalOpen: false,
      modalPhotoIndex: 0,
    };
  },

  computed: {
    categoryParam() {
      return this.$route.params.category;
    },

    productParam() {
      return this.$route.params.product;
    },

    breadcrumbs() {
      return [
        { name: "Products", path: "/products" },
        {
          name: this.productData.category
            ? this.formatCategoryName(this.productData.category)
            : this.categoryParam,
          path: `/products/${this.categoryParam}`,
        },
        {
          name: this.productData.name || "",
          path: null,
        },
      ];
    },

    productPhotos() {
      if (!this.productData || !this.productData.photos) return [];

      try {
        // Handle the case where photos is a string representation of an array
        if (typeof this.productData.photos === "string") {
          // Remove the single quotes and parse as JSON
          const cleanedString = this.productData.photos.replace(/'/g, '"');
          const photoArray = JSON.parse(cleanedString);
          if (Array.isArray(photoArray)) {
            // Use the base64 strings directly without prepending 'data:image/jpeg;base64,'
            return photoArray;
          }
        }
        return [];
      } catch (err) {
        console.error("Error parsing product photos:", err);
        return [];
      }
    },

    productDescription() {
      try {
        if (!this.productData || !this.productData.info) return "";
        const info = JSON.parse(this.productData.info);
        return info.description || "";
      } catch (err) {
        console.error("Error parsing product info:", err);
        return "";
      }
    },

    hasDocument() {
      return (
        this.productData &&
        this.productData.document &&
        this.productData.document !== "base64 string" &&
        this.productData.document !== '{"name":"","content":null}'
      );
    },
  },

  methods: {
    formatCategoryName(name) {
      if (!name) return "";
      return name
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    },

    openImageModal(index) {
      if (this.productPhotos.length > 0) {
        this.modalPhotoIndex = index;
        this.isImageModalOpen = true;
        // Prevent scrolling on the body when modal is open
        document.body.style.overflow = "hidden";
      }
    },

    closeImageModal() {
      this.isImageModalOpen = false;
      // Restore scrolling on the body
      document.body.style.overflow = "";
    },

    nextModalImage() {
      if (this.modalPhotoIndex < this.productPhotos.length - 1) {
        this.modalPhotoIndex++;
      } else {
        this.modalPhotoIndex = 0; // Loop back to the first image
      }
    },

    prevModalImage() {
      if (this.modalPhotoIndex > 0) {
        this.modalPhotoIndex--;
      } else {
        this.modalPhotoIndex = this.productPhotos.length - 1; // Loop to the last image
      }
    },

    downloadDocument() {
      try {
        // Check if document exists
        if (!this.productData.document) {
          throw new Error("No document available for this product");
        }

        let documentData;

        // Handle the document data based on its structure
        if (typeof this.productData.document === "string") {
          try {
            // Try to parse it as JSON string
            documentData = JSON.parse(this.productData.document);
          } catch (parseError) {
            // If it's not JSON, log and throw an error
            console.error("Error parsing document data:", parseError);
            throw new Error("Invalid document format");
          }
        } else {
          // It's already an object
          documentData = this.productData.document;
        }

        // Ensure we have the required properties
        if (!documentData.content) {
          throw new Error("Document content is missing");
        }

        // The content is already a complete data URL, so use it directly
        const link = document.createElement("a");
        link.href = documentData.content;
        link.download =
          documentData.name || `${this.productData.prodCode}_document.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Error downloading document:", err);
        alert("Failed to download document. Please try again later.");
      }
    },

    async fetchProductDetails() {
      try {
        this.loading = true;
        this.error = null;

        // Get product details
        const prodCode = this.productParam.toUpperCase();
        const response = await Product.getProductByProdCode(prodCode);
        const product = extractApiData(response);

        console.log("product.docment: ", product.document);

        if (!product) {
          throw new Error(`Product with code '${prodCode}' not found`);
        }

        this.productData = product;
      } catch (err) {
        console.error("Error fetching product data:", err);
        this.error = "Failed to load product details. Please try again later.";
      } finally {
        this.loading = false;
      }
    },

    // Handle escape key press for modal
    handleKeyDown(e) {
      if (e.key === "Escape" && this.isImageModalOpen) {
        this.closeImageModal();
      }
    },
  },

  mounted() {
    this.fetchProductDetails();

    // Add event listener for keyboard navigation
    window.addEventListener("keydown", this.handleKeyDown);
  },

  beforeUnmount() {
    // Remove event listener to prevent memory leaks
    window.removeEventListener("keydown", this.handleKeyDown);

    // Ensure body scroll is restored if component is unmounted while modal is open
    document.body.style.overflow = "";
  },

  watch: {
    // Watch for route changes to reload data when navigating between products
    $route: {
      handler() {
        this.fetchProductDetails();
        this.activePhotoIndex = 0;
        this.isImageModalOpen = false;
      },
    },
  },
};
</script>
