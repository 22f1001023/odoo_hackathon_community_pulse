const Login = {
    template: `
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-body p-4">
                        <h2 class="text-center mb-4 text-primary">Community Pulse</h2>
                        <h4 class="text-center mb-4">Login</h4>
                        
                        <div v-if="errorMessage" class="alert alert-danger" role="alert">
                            {{ errorMessage }}
                        </div>
                        
                        <form @submit.prevent="login">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter your email" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" v-model="password" placeholder="Enter your password" required>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                                    {{ isLoading ? 'Logging in...' : 'Login' }}
                                </button>
                            </div>
                        </form>
                        
                        <div class="mt-3 text-center">
                            <p>Don't have an account? <router-link to="/register">Register</router-link></p>
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
            email: '',
            password: '',
            errorMessage: '',
            isLoading: false
        };
    },
    methods: {
        async login() {
            try {
                // Reset error message
                this.errorMessage = '';
                this.isLoading = true;
                
                // Form validation
                if (!this.email || !this.password) {
                    this.errorMessage = 'Please enter both email and password.';
                    this.isLoading = false;
                    return;
                }
                
                // Send request to backend API
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password
                    })
                });
                
                const data = await response.json();
                
                // Handle different status codes
                if (response.status === 400) {
                    this.errorMessage = data.error || 'Missing email or password';
                    return;
                } else if (response.status === 401) {
                    this.errorMessage = data.error || 'Invalid credentials';
                    return;
                } else if (response.status === 403) {
                    this.errorMessage = data.error || 'Account is banned or inactive';
                    return;
                } else if (!response.ok) {
                    this.errorMessage = data.error || 'An unexpected error occurred';
                    return;
                }
                
                // Login successful - redirect based on role
                console.log('Login successful:', data);
                
                // Store user info if needed
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('user_role', data.role || 'user');
                
                // Redirect to appropriate dashboard
                this.$router.push(data.redirect_url || '/dashboard');
                
            } catch (error) {
                console.error('Login error:', error);
                this.errorMessage = 'Network or server error. Please try again.';
            } finally {
                this.isLoading = false;
            }
        }
    }
};
