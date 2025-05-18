const UserNavbar = {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#" @click.prevent="goToDashboard">Community Pulse</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#userNavbar" aria-controls="userNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="userNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goToDashboard">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goToEvents">Events</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goToProfile">Profile</a>
            </li>
          </ul>
          <button class="btn btn-outline-light ms-lg-3" @click="logout">Logout</button>
        </div>
      </div>
    </nav>
  `,
    methods: {
        goToDashboard() {
            this.$router.push('/dashboard');
        },
        goToEvents() {
            this.$router.push('/events');
        },
        goToProfile() {
            this.$router.push('/profile');
        },
        async logout() {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
            } catch (e) {
                // Ignore errors, just redirect
            }
            this.$router.push('/login');
        }
    }
};
