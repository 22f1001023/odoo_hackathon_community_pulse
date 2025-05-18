const UserProfile = {
    components: {
        'user-navbar': UserNavbar
    },
    template: `
    <div>
        <user-navbar></user-navbar>
        <div class="container mt-4">
            <h2 class="text-center text-danger mb-4">User Profile</h2>
            
            <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success text-center">{{ successMessage }}</div>
            
            <div class="card mx-auto" style="max-width: 500px;">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0">Profile Details</h4>
                </div>
                <div class="card-body">
                    <form @submit.prevent="updateProfile">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email:</label>
                            <input type="email" id="email" v-model="profile.email" class="form-control" disabled>
                            <small class="text-muted">Email cannot be changed</small>
                        </div>
                        
                        <div class="mb-3">
                            <label for="username" class="form-label">Username:</label>
                            <input type="text" id="username" v-model="profile.username" class="form-control" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="phone" class="form-label">Phone:</label>
                            <input type="tel" id="phone" v-model="profile.phone" class="form-control" required>
                        </div>

                        <hr>
                        <h6 class="mb-3">Change Password</h6>
                        <div class="mb-3">
                            <label for="current_password" class="form-label">Current Password:</label>
                            <input type="password" id="current_password" v-model="current_password" class="form-control" placeholder="Enter current password to change password">
                        </div>
                        <div class="mb-3">
                            <label for="new_password" class="form-label">New Password:</label>
                            <input type="password" id="new_password" v-model="new_password" class="form-control" placeholder="Enter new password">
                        </div>
                        <div class="mb-3">
                            <label for="confirm_password" class="form-label">Confirm New Password:</label>
                            <input type="password" id="confirm_password" v-model="confirm_password" class="form-control" placeholder="Confirm new password">
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary">Update Profile</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            profile: {
                email: '',
                username: '',
                phone: ''
            },
            current_password: '',
            new_password: '',
            confirm_password: '',
            errorMessage: '',
            successMessage: ''
        };
    },
    mounted() {
        this.fetchProfile();
    },
    methods: {
        async fetchProfile() {
            try {
                this.errorMessage = '';
                this.successMessage = '';
                const response = await fetch('/api/profile');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch profile');
                }
                const data = await response.json();
                this.profile.email = data.email;
                this.profile.username = data.username;
                this.profile.phone = data.phone;
            } catch (error) {
                this.errorMessage = error.message;
            }
        },
        async updateProfile() {
            try {
                this.errorMessage = '';
                this.successMessage = '';

                // Prepare payload
                const payload = {
                    username: this.profile.username,
                    phone: this.profile.phone
                };

                // Include password change fields if provided
                if (this.new_password || this.confirm_password) {
                    payload.current_password = this.current_password;
                    payload.new_password = this.new_password;
                    payload.confirm_password = this.confirm_password;
                }

                const response = await fetch('/api/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    this.errorMessage = data.error || 'Failed to update profile';
                    return;
                }

                this.successMessage = data.message || 'Profile updated successfully';

                // Clear password fields
                this.current_password = '';
                this.new_password = '';
                this.confirm_password = '';

                // Refresh profile data
                this.fetchProfile();
            } catch (error) {
                this.errorMessage = error.message;
            }
        }
    }
};
