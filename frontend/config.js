export default {
  // ===================
  // API Configuration
  // ===================
  apiUrl: "http://localhost:9091/api/v1",
  // apiUrl: "https://stage.backend.code-smith.co.za/api/v1",

  // ===================
  // Company Information
  // ===================
  company: {
    name: "Alliance Seeds",
    tagline: "Seeding The Future Together",
    
    // Contact Details
    contact: {
      address: {
        street: "12377 Seed Farm Road",
        city: "Farmtown",
        country: "South Africa"
      },
      phone: "+27 12 345 6789",
      email: "info@allianceseeds.co.za"
    },

    // Business Hours
    businessHours: {
      weekdays: {
        days: "Monday - Friday",
        hours: "8:00 AM - 5:00 PM"
      },
      saturday: {
        days: "Saturday", 
        hours: "8:00 AM - 12:00 PM"
      },
      sunday: {
        days: "Sunday",
        hours: "Closed"
      },
    },

    // Navigation Links
    navigation: [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: 'Brochures', path: '/brochures' },
      { name: 'Articles', path: '/articles' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' }
    ]
  }
};