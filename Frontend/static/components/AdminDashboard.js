const AdminDashboard = {
    template: `
    <div>
      <admin-navbar></admin-navbar>
      <div class="container mt-4">
        <h2 class="mb-4">Admin Dashboard</h2>
        
        <div class="card mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Pending Event Approvals</h5>
          </div>
          <div class="card-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <table v-else class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Event Name</th>
                  <th>Creator</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in pendingEvents" :key="event.id">
                  <td>{{ event.id }}</td>
                  <td>{{ event.name }}</td>
                  <td>{{ event.creator || 'Unknown' }}</td>
                  <td>
                    <button class="btn btn-success btn-sm me-2" @click="approveEvent(event.id)">
                      <i class="fas fa-check me-1"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" @click="confirmReject(event)">
                      <i class="fas fa-times me-1"></i> Reject
                    </button>
                  </td>
                </tr>
                <tr v-if="pendingEvents.length === 0">
                  <td colspan="4" class="text-center py-3">No pending events require approval</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-header bg-info text-white">
                <h5 class="mb-0">Quick Stats</h5>
              </div>
              <div class="card-body">
                <p><strong>Pending Events:</strong> {{ pendingEvents.length }}</p>
                <p><strong>Today's Date:</strong> {{ currentDate }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-header bg-info text-white">
                <h5 class="mb-0">Admin Actions</h5>
              </div>
              <div class="card-body">
                <p>Use the navigation menu to access:</p>
                <ul>
                  <li>User Management</li>
                  <li>Category Management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    components: {
        'admin-navbar': AdminNavbar
    },
    data() {
        return {
            pendingEvents: [],
            errorMessage: '',
            successMessage: '',
            loading: true,
            currentDate: new Date().toLocaleDateString()
        };
    },
    methods: {
        async fetchPendingEvents() {
            this.loading = true;
            this.errorMessage = '';
            try {
                const response = await fetch('/api/admin/events/pending');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch pending events');
                }
                this.pendingEvents = await response.json();
            } catch (error) {
                this.errorMessage = `Error: ${error.message}`;
            } finally {
                this.loading = false;
            }
        },
        async approveEvent(eventId) {
            this.errorMessage = '';
            this.successMessage = '';
            try {
                const response = await fetch(`/api/admin/events/${eventId}/approve`, {
                    method: 'POST'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to approve event');
                }

                this.successMessage = 'Event approved successfully';
                // Remove the approved event from the list
                this.pendingEvents = this.pendingEvents.filter(e => e.id !== eventId);
            } catch (error) {
                this.errorMessage = `Error: ${error.message}`;
            }
        },
        confirmReject(event) {
            if (confirm(`Are you sure you want to reject and delete the event "${event.name}"?`)) {
                this.rejectEvent(event.id);
            }
        },
        async rejectEvent(eventId) {
            this.errorMessage = '';
            this.successMessage = '';
            try {
                const response = await fetch(`/api/admin/events/${eventId}/reject`, {
                    method: 'POST'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to reject event');
                }

                this.successMessage = 'Event rejected and deleted successfully';
                // Remove the rejected event from the list
                this.pendingEvents = this.pendingEvents.filter(e => e.id !== eventId);
            } catch (error) {
                this.errorMessage = `Error: ${error.message}`;
            }
        }
    },
    mounted() {
        this.fetchPendingEvents();
    }
};
