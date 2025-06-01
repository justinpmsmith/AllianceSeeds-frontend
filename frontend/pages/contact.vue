<template>
  <div>
    <AppHeader />

    <!-- Contact Hero Section -->
    <ProductPageHero 
      title="Contact Us" 
      subtitle="Get in touch with our team for any questions about our products or services."
    />

    <!-- Breadcrumbs -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <Breadcrumbs :breadcrumbs="breadcrumbs" />
    </div>

    <!-- Contact Section -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Name Field -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your first name"
                />
              </div>

              <!-- Surname Field -->
              <div>
                <label for="surname" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Surname <span class="text-red-500">*</span>
                </label>
                <input
                  id="surname"
                  v-model="formData.surname"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your surname"
                />
              </div>

              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email address"
                />
              </div>

              <!-- Cell Number Field -->
              <div>
                <label for="cell" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cell Number
                </label>
                <input
                  id="cell"
                  v-model="formData.cell"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your cell number"
                />
              </div>

              <!-- Message Field -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  rows="5"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white resize-vertical"
                  placeholder="Enter your message or question..."
                ></textarea>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon v-if="isSubmitting" name="material-symbols:hourglass-empty" class="animate-spin mr-2" />
                  <Icon v-else name="material-symbols:send" class="mr-2" />
                  {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </form>

            <!-- Success Message -->
            <div v-if="showSuccessMessage" class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <div class="flex items-center">
                <Icon name="material-symbols:check-circle" class="mr-2" />
                <span>Your message has been sent successfully! We'll get back to you soon.</span>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="showErrorMessage" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <div class="flex items-center">
                <Icon name="material-symbols:error" class="mr-2" />
                <span>{{ errorMessage }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-8">
          <!-- Company Information Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <Icon name="material-symbols:location-on" class="h-6 w-6 text-green-600 dark:text-green-400 mr-3 mt-1" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Address</p>
                  <p class="text-gray-600 dark:text-gray-300">
                    {{ companyInfo.contact.address.street }}<br>
                    {{ companyInfo.contact.address.city }}, {{ companyInfo.contact.address.country }}
                  </p>
                </div>
              </div>

              <div class="flex items-center">
                <Icon name="material-symbols:phone" class="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Phone</p>
                  <p class="text-gray-600 dark:text-gray-300">{{ companyInfo.contact.phone }}</p>
                </div>
              </div>

              <div class="flex items-center">
                <Icon name="material-symbols:mail" class="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Email</p>
                  <p class="text-gray-600 dark:text-gray-300">{{ companyInfo.contact.email }}</p>
                </div>
              </div>

              <div class="flex items-center">
                <Icon name="material-symbols:schedule" class="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Business Hours</p>
                  <p class="text-gray-600 dark:text-gray-300">
                    {{ businessHours.weekdays.days }}: {{ businessHours.weekdays.hours }}<br>
                    {{ businessHours.saturday.days }}: {{ businessHours.saturday.hours }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Why Contact Us Card -->
          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-400 mb-4">Why Contact Us?</h3>
            <ul class="space-y-3 text-green-700 dark:text-green-300">
              <li class="flex items-start">
                <Icon name="material-symbols:check-circle" class="h-5 w-5 mr-2 mt-0.5" />
                <span>Expert advice on seed selection for your specific needs</span>
              </li>
              <li class="flex items-start">
                <Icon name="material-symbols:check-circle" class="h-5 w-5 mr-2 mt-0.5" />
                <span>Pricing and availability information</span>
              </li>
              <li class="flex items-start">
                <Icon name="material-symbols:check-circle" class="h-5 w-5 mr-2 mt-0.5" />
                <span>Technical support and growing recommendations</span>
              </li>
              <li class="flex items-start">
                <Icon name="material-symbols:check-circle" class="h-5 w-5 mr-2 mt-0.5" />
                <span>Bulk order inquiries and special pricing</span>
              </li>
            </ul>
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
import Breadcrumbs from '~/components/Breadcrumbs.vue';
import ProductPageHero from '~/components/ProductPageHero.vue';
import Customer from '~/services/server/customer';
import config from "~/config";

export default {
  name: 'ContactPage',
  
  components: {
    AppHeader,
    AppFooter,
    Breadcrumbs,
    ProductPageHero
  },
  
  data() {
    return {
      formData: {
        name: '',
        surname: '',
        email: '',
        cell: '',
        message: ''
      },
      isSubmitting: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: ''
    };
  },
  
  computed: {
    breadcrumbs() {
      return [
        { name: 'Contact', path: null }
      ];
    },
    
    companyInfo() {
      return config.company;
    },
    
    businessHours() {
      return config.company.businessHours;
    }
  },
  
  methods: {
    validateForm() {
      // Reset error state
      this.showErrorMessage = false;
      this.errorMessage = '';

      // Check required fields
      if (!this.formData.name.trim()) {
        this.showError('Please enter your name.');
        return false;
      }

      if (!this.formData.surname.trim()) {
        this.showError('Please enter your surname.');
        return false;
      }

      if (!this.formData.email.trim()) {
        this.showError('Please enter your email address.');
        return false;
      }

      if (!this.formData.message.trim()) {
        this.showError('Please enter a message.');
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        this.showError('Please enter a valid email address.');
        return false;
      }

      // Check that at least email or cell is provided (though both are acceptable)
      if (!this.formData.email.trim() && !this.formData.cell.trim()) {
        this.showError('Please provide either an email address or cell number.');
        return false;
      }

      return true;
    },

    showError(message) {
      this.errorMessage = message;
      this.showErrorMessage = true;
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        this.showErrorMessage = false;
      }, 5000);
    },

    showSuccess() {
      this.showSuccessMessage = true;
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);
    },

    clearForm() {
      this.formData = {
        name: '',
        surname: '',
        email: '',
        cell: '',
        message: ''
      };
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.isSubmitting = true;
        this.showSuccessMessage = false;
        this.showErrorMessage = false;

        // Prepare JSON data object
        const requestData = {
          name: this.formData.name,
          surname: this.formData.surname,
          email: this.formData.email,
          cell: this.formData.cell,
          message: this.formData.message
        };

        // Submit the contact message
        const response = await Customer.submitContactMessage(requestData);

        // Check if the submission was successful
        if (response && response.meta && response.meta.success) {
          // Success
          this.showSuccess();
          this.clearForm();
        } else {
          // Handle API error
          const errorMsg = response?.meta?.message || 'Failed to send message';
          throw new Error(errorMsg);
        }

      } catch (error) {
        console.error('Error submitting contact form:', error);
        this.showError('There was an issue submitting your message. Please try again or contact us directly.');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>