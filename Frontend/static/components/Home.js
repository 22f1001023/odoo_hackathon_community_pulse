const Home = {
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-primary">Community Pulse</h2>
          <p class="text-muted mb-0">Discover and participate in local events near you!</p>
        </div>
        <div>
          <div class="btn-group" role="group" aria-label="Login and Register">
            <button class="btn btn-outline-primary" @click="$router.push('/login')">Login</button>
            <button class="btn btn-primary" @click="$router.push('/register')">Register</button>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12 col-md-6 mx-auto">
          <input v-model="search" type="text" class="form-control" placeholder="Search events by name or city...">
        </div>
      </div>
      <div class="row">
        <div v-if="filteredEvents.length === 0" class="col-12 text-center text-muted">
          <p>No events found.</p>
        </div>
        <div v-for="event in filteredEvents" :key="event.id" class="col-sm-6 col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img v-if="event.photo" :src="'/static/uploads/' + event.photo" class="card-img-top" :alt="event.name" style="object-fit:cover;max-height:180px;">
            <div class="card-body">
              <h5 class="card-title">{{ event.name }}</h5>
              <p class="card-text text-truncate">{{ event.description }}</p>
              <p class="mb-1"><i class="fas fa-map-marker-alt"></i> {{ event.city }}</p>
              <p class="mb-1"><i class="fas fa-calendar-alt"></i> {{ formatDate(event.start_date) }}</p>
              <span class="badge bg-secondary" v-if="event.category">{{ event.category }}</span>
            </div>
            <div class="card-footer bg-transparent border-0">
              <button class="btn btn-primary w-100" @click="redirectToLogin">View & Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      events: [],
      search: ''
    };
  },
  computed: {
    filteredEvents() {
      if (!this.search) return this.events;
      const s = this.search.toLowerCase();
      return this.events.filter(ev =>
        (ev.name && ev.name.toLowerCase().includes(s)) ||
        (ev.city && ev.city.toLowerCase().includes(s))
      );
    }
  },
  methods: {
    fetchEvents() {
      fetch('/api/events')
        .then(res => res.json())
        .then(data => {
          this.events = data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        })
        .catch(() => {
          this.events = [];
        });
    },
    formatDate(dt) {
      if (!dt) return '';
      const d = new Date(dt);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    redirectToLogin() {
      this.$router.push('/login');
    }
  },
  mounted() {
    this.fetchEvents();
  }
};
