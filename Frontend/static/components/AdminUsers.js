const AdminUsers = {
    components: {
        'admin-navbar': AdminNavbar
    },
    template: `
    <div>
      <admin-navbar></admin-navbar>
      <div class="container mt-4">
        <h2 class="mb-4">All Users</h2>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        <table class="table table-bordered table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Verified Organizer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <span v-if="user.is_banned" class="badge bg-danger">Banned</span>
                <span v-else class="badge bg-success">Active</span>
              </td>
              <td>
                <span v-if="user.verified_organizer" class="badge bg-primary">Yes</span>
                <span v-else class="badge bg-secondary">No</span>
              </td>
              <td>
                <button v-if="!user.is_banned"
                  class="btn btn-sm btn-danger"
                  @click="banUser(user.id)">
                  Ban
                </button>
                <button v-else
                  class="btn btn-sm btn-success"
                  @click="unbanUser(user.id)">
                  Unban
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="7" class="text-center">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    data() {
        return {
            users: [],
            errorMessage: '',
            successMessage: ''
        };
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            this.errorMessage = '';
            this.successMessage = '';
            try {
                const response = await fetch('/api/admin/users');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch users.');
                }
                this.users = await response.json();
            } catch (error) {
                this.errorMessage = error.message;
            }
        },
        async banUser(userId) {
            if (!confirm('Are you sure you want to ban this user?')) return;
            this.errorMessage = '';
            this.successMessage = '';
            try {
                const response = await fetch(`/api/admin/users/${userId}/ban`, {
                    method: 'POST'
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to ban user.');
                }
                this.successMessage = 'User banned successfully.';
                this.fetchUsers();
            } catch (error) {
                this.errorMessage = error.message;
            }
        },
        async unbanUser(userId) {
            if (!confirm('Are you sure you want to unban this user?')) return;
            this.errorMessage = '';
            this.successMessage = '';
            try {
                const response = await fetch(`/api/admin/users/${userId}/unban`, {
                    method: 'POST'
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to unban user.');
                }
                this.successMessage = 'User unbanned successfully.';
                this.fetchUsers();
            } catch (error) {
                this.errorMessage = error.message;
            }
        }
    }
};
