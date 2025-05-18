const Events = {
    components: {
        'user-navbar': UserNavbar
    },
    template: `
    <div>
      <user-navbar></user-navbar>
      <div class="container py-4">
        <h2 class="mb-4">My Dashboard</h2>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

        <ul class="nav nav-tabs mb-4" id="dashboardTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="registered-tab" data-bs-toggle="tab" data-bs-target="#registered" type="button" role="tab" aria-controls="registered" aria-selected="true">Registered Events</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="my-events-tab" data-bs-toggle="tab" data-bs-target="#my-events" type="button" role="tab" aria-controls="my-events" aria-selected="false">My Events</button>
          </li>
        </ul>

        <div class="tab-content" id="dashboardTabsContent">
          <!-- Registered Events Tab -->
          <div class="tab-pane fade show active" id="registered" role="tabpanel" aria-labelledby="registered-tab">
            <div v-if="loadingRegistered" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="registeredEvents.length === 0" class="text-center text-muted">You have not registered for any events.</div>
            <div class="row">
              <div v-for="event in registeredEvents" :key="event.id" class="col-md-6 mb-3">
                <div class="card h-100 shadow-sm">
                  <img v-if="event.photo" :src="'/static/uploads/' + event.photo" class="card-img-top" :alt="event.name" style="object-fit:cover;max-height:180px;">
                  <div class="card-body">
                    <h5 class="card-title">{{ event.name }}</h5>
                    <p class="card-text text-truncate">{{ event.description }}</p>
                    <p class="mb-1"><i class="fas fa-map-marker-alt"></i> {{ event.city }}</p>
                    <p class="mb-1"><i class="fas fa-calendar-alt"></i> {{ formatDate(event.start_date) }}</p>
                    <span class="badge bg-secondary" v-if="event.category">{{ event.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- My Events Tab -->
          <div class="tab-pane fade" id="my-events" role="tabpanel" aria-labelledby="my-events-tab">
            <div class="mb-3 text-end">
              <button class="btn btn-primary" @click="$router.push('/event/create')">Add New Event</button>
            </div>
            <div v-if="loadingMyEvents" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="myEvents.length === 0" class="text-center text-muted">You have not created any events.</div>
            <div class="row">
              <div v-for="event in myEvents" :key="event.id" class="col-md-6 mb-3">
                <div class="card h-100 shadow-sm">
                  <img v-if="event.photo" :src="'/static/uploads/' + event.photo" class="card-img-top" :alt="event.name" style="object-fit:cover;max-height:180px;">
                  <div class="card-body">
                    <h5 class="card-title">{{ event.name }}</h5>
                    <p class="card-text text-truncate">{{ event.description }}</p>
                    <p class="mb-1"><i class="fas fa-map-marker-alt"></i> {{ event.city }}</p>
                    <p class="mb-1"><i class="fas fa-calendar-alt"></i> {{ formatDate(event.start_date) }}</p>
                    <span class="badge bg-secondary" v-if="event.category">{{ event.category }}</span>
                  </div>
                  <div class="card-footer bg-transparent border-0 d-flex justify-content-between">
                    <button class="btn btn-outline-secondary" @click="editEvent(event.id)">Edit</button>
                    <button class="btn btn-outline-danger" @click="confirmDeleteEvent(event.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    data() {
        return {
            registeredEvents: [],
            myEvents: [],
            errorMessage: '',
            successMessage: '',
            loadingRegistered: false,
            loadingMyEvents: false,
            userId: null
        };
    },
    methods: {
        async fetchRegisteredEvents() {
            this.loadingRegistered = true;
            try {
                // Placeholder: You should implement a backend endpoint like /api/user/registrations
                // For now, fetch all events and filter those where the user is registered
                const userEmail = localStorage.getItem('user_email');
                if (!userEmail) {
                    this.registeredEvents = [];
                    return;
                }
                const response = await fetch('/api/events');
                if (!response.ok) throw new Error('Failed to fetch events');
                const events = await response.json();
                // This requires the backend to include registration info or you to fetch registrations
                // For demo, assume user is registered if their email is in event.registrations (not available in current API)
                // So show all events as placeholder
                this.registeredEvents = events; // Replace with filtered list when backend supports it
            } catch (error) {
                this.errorMessage = error.message;
            } finally {
                this.loadingRegistered = false;
            }
        },
        async fetchMyEvents() {
            this.loadingMyEvents = true;
            try {
                const userId = localStorage.getItem('user_id');
                if (!userId) {
                    this.myEvents = [];
                    return;
                }
                const response = await fetch('/api/events');
                if (!response.ok) throw new Error('Failed to fetch events');
                const events = await response.json();
                // Only show events created by this user
                this.myEvents = events.filter(event => event.creator_id == userId);
            } catch (error) {
                this.errorMessage = error.message;
            } finally {
                this.loadingMyEvents = false;
            }
        },
        formatDate(dt) {
            if (!dt) return '';
            const d = new Date(dt);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        editEvent(eventId) {
            this.$router.push(`/event/${eventId}/edit`);
        },
        confirmDeleteEvent(eventId) {
            if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                this.deleteEvent(eventId);
            }
        },
        async deleteEvent(eventId) {
            try {
                this.errorMessage = '';
                this.successMessage = '';
                const response = await fetch(`/api/events/${eventId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to delete event');
                }
                this.successMessage = 'Event deleted successfully';
                this.fetchMyEvents();
            } catch (error) {
                this.errorMessage = error.message;
            }
        }
    },
    mounted() {
        this.fetchRegisteredEvents();
        this.fetchMyEvents();
    }
};


