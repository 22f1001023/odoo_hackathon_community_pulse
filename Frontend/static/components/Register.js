const Register = {
    template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="text-center mb-4 text-primary">Community Pulse</h2>
              <h4 class="text-center mb-4">User Registration</h4>
              
              <div v-if="successMessage" class="alert alert-success text-center">{{ successMessage }}</div>
              <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
              
              <form @submit.prevent="register">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" v-model="username" placeholder="Enter your username" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter your email" required>
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone</label>
                  <input type="text" class="form-control" id="phone" v-model="phone" placeholder="Enter your phone" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" v-model="password" placeholder="Enter your password" required>
                </div>
                <div class="mb-3">
                  <label for="confirm_password" class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" id="confirm_password" v-model="confirm_password" placeholder="Confirm your password" required>
                </div>
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    {{ isLoading ? 'Registering...' : 'Register' }}
                  </button>
                </div>
              </form>
              
              <div class="mt-3 text-center">
                <p>Already have an account? <router-link to="/login">Login</router-link></p>
                <router-link to="/" class="btn btn-sm btn-outline-secondary mt-2">Back to Home</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    data() {
        return {
            username: '',
            email: '',
            phone: '',
            password: '',
            confirm_password: '',
            errorMessage: '',
            successMessage: '',
            isLoading: false
        };
    },
    methods: {
        async register() {
            this.errorMessage = '';
            this.successMessage = '';
            this.isLoading = true;
            try {
                // Basic validation
                if (!this.username || !this.email || !this.phone || !this.password || !this.confirm_password) {
                    this.errorMessage = 'All fields are required.';
                    this.isLoading = false;
                    return;
                }
                if (this.password !== this.confirm_password) {
                    this.errorMessage = 'Passwords do not match.';
                    this.isLoading = false;
                    return;
                }
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        email: this.email,
                        phone: this.phone,
                        password: this.password,
                        confirm_password: this.confirm_password
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    this.errorMessage = data.error || 'Registration failed.';
                    this.isLoading = false;
                    return;
                }
                this.successMessage = data.message || 'Registration successful! You can now log in.';
                // Clear form fields
                this.username = '';
                this.email = '';
                this.phone = '';
                this.password = '';
                this.confirm_password = '';
            } catch (error) {
                this.errorMessage = 'Network or server error. Please try again.';
            } finally {
                this.isLoading = false;
            }
        }
    }
};
