const UserDashboard = {
  components: {
    'user-navbar': UserNavbar
  },
  template: `
    <div>
      <user-navbar></user-navbar>
      <div class="container py-4">
        <h2 class="mb-4">Create New Event</h2>
        
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        
        <form @submit.prevent="submitEvent" enctype="multipart/form-data">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Event Details</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <!-- Event Name -->
                <div class="col-md-6">
                  <label for="name" class="form-label">Event Name*</label>
                  <input type="text" class="form-control" id="name" v-model="event.name" required>
                </div>
                
                <!-- Category -->
                <div class="col-md-6">
                  <label for="category" class="form-label">Category*</label>
                  <select class="form-select" id="category" v-model="event.category_id" required>
                    <option value="" disabled selected>Select a category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                
                <!-- Description -->
                <div class="col-12">
                  <label for="description" class="form-label">Description*</label>
                  <textarea class="form-control" id="description" v-model="event.description" rows="4" required></textarea>
                </div>

                <!-- Event Dates -->
                <div class="col-md-6">
                  <label for="start_date" class="form-label">Event Start Date/Time*</label>
                  <input type="datetime-local" class="form-control" id="start_date" v-model="event.start_date" required>
                </div>
                <div class="col-md-6">
                  <label for="end_date" class="form-label">Event End Date/Time*</label>
                  <input type="datetime-local" class="form-control" id="end_date" v-model="event.end_date" required>
                </div>

                <!-- Registration Dates -->
                <div class="col-md-6">
                  <label for="registration_start" class="form-label">Registration Start Date/Time*</label>
                  <input type="datetime-local" class="form-control" id="registration_start" v-model="event.registration_start" required>
                </div>
                <div class="col-md-6">
                  <label for="registration_end" class="form-label">Registration End Date/Time*</label>
                  <input type="datetime-local" class="form-control" id="registration_end" v-model="event.registration_end" required>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Location</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <!-- Address -->
                <div class="col-12">
                  <label for="address" class="form-label">Address*</label>
                  <input type="text" class="form-control" id="address" v-model="event.address" required>
                </div>
                
                <!-- City -->
                <div class="col-md-6">
                  <label for="city" class="form-label">City*</label>
                  <input type="text" class="form-control" id="city" v-model="event.city" required>
                </div>
                
                <!-- PIN Code -->
                <div class="col-md-6">
                  <label for="pincode" class="form-label">PIN Code*</label>
                  <input type="text" class="form-control" id="pincode" v-model="event.pincode" required>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Event Photo</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label for="photo" class="form-label">Upload Event Photo</label>
                <input class="form-control" type="file" id="photo" ref="photoInput" accept="image/*">
                <div class="form-text">Optional. Max size: 16MB. Recommended dimensions: 1200×800px.</div>
              </div>
              <div v-if="previewUrl" class="mt-3">
                <p>Preview:</p>
                <img :src="previewUrl" class="img-thumbnail" style="max-height: 200px;">
              </div>
            </div>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="button" class="btn btn-secondary me-md-2" @click="$router.push('/dashboard')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Submitting...' : 'Submit Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      event: {
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        registration_start: '',
        registration_end: '',
        address: '',
        city: '',
        pincode: '',
        category_id: ''
      },
      categories: [],
      errorMessage: '',
      successMessage: '',
      isSubmitting: false,
      previewUrl: null
    };
  },
  mounted() {
    this.fetchCategories();
    
    // Add event listener for file preview
    const photoInput = this.$refs.photoInput;
    if (photoInput) {
      photoInput.addEventListener('change', this.handleFilePreview);
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        this.categories = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    
    handleFilePreview(event) {
      const file = event.target.files[0];
      if (!file) {
        this.previewUrl = null;
        return;
      }
      
      // Create preview URL for the selected image
      this.previewUrl = URL.createObjectURL(file);
    },
    
    async submitEvent() {
      this.errorMessage = '';
      this.successMessage = '';
      this.isSubmitting = true;
      
      try {
        // Basic validation
        if (!this.validateForm()) {
          this.isSubmitting = false;
          return;
        }
        
        // Create FormData object for multipart/form-data submission
        const formData = new FormData();
        formData.append('name', this.event.name);
        formData.append('description', this.event.description);
        formData.append('start_date', this.event.start_date);
        formData.append('end_date', this.event.end_date);
        formData.append('registration_start', this.event.registration_start);
        formData.append('registration_end', this.event.registration_end);
        formData.append('address', this.event.address);
        formData.append('city', this.event.city);
        formData.append('pincode', this.event.pincode);
        formData.append('category_id', this.event.category_id);
        
        // Add photo if selected
        const photoInput = this.$refs.photoInput;
        if (photoInput && photoInput.files.length > 0) {
          formData.append('photo', photoInput.files[0]);
        }
        
        // Submit the form
        const response = await fetch('/api/events', {
          method: 'POST',
          body: formData
        });
        
        // Handle the response
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create event');
        }
        
        const data = await response.json();
        this.successMessage = data.message || 'Event submitted successfully and awaiting approval.';
        
        // Reset form after successful submission
        this.resetForm();
        
        // Optionally redirect to dashboard after a delay
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 3000);
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isSubmitting = false;
      }
    },
    
    validateForm() {
      // Check required date fields format
      const requiredDateFields = ['start_date', 'end_date', 'registration_start', 'registration_end'];
      for (const field of requiredDateFields) {
        if (!this.event[field]) {
          this.errorMessage = `Please fill in the ${field.replace('_', ' ')} field.`;
          return false;
        }
      }
      
      // Ensure registration dates are before event dates
      const regStart = new Date(this.event.registration_start);
      const regEnd = new Date(this.event.registration_end);
      const eventStart = new Date(this.event.start_date);
      
      if (regEnd > eventStart) {
        this.errorMessage = 'Registration end date must be before event start date.';
        return false;
      }
      
      // All validations passed
      return true;
    },
    
    resetForm() {
      this.event = {
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        registration_start: '',
        registration_end: '',
        address: '',
        city: '',
        pincode: '',
        category_id: ''
      };
      
      // Clear file input
      if (this.$refs.photoInput) {
        this.$refs.photoInput.value = '';
      }
      this.previewUrl = null;
    }
  }
};
