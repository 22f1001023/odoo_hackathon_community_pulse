const AdminNavbar = {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#" @click.prevent="goToDashboard">Admin Panel</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar" aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goToDashboard">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goToCategories">Categories</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goToUsers">Users</a>
            </li>
          </ul>
          <button class="btn btn-outline-light ms-lg-3" @click="logout">Logout</button>
        </div>
      </div>
    </nav>
  `,
    methods: {
        goToDashboard() {
            this.$router.push('/admin/dashboard');
        },
        goToCategories() {
            this.$router.push('/admin/categories');
        },
        goToUsers() {
            this.$router.push('/admin/users');
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
