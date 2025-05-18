const Footer = {
  template: `
    <footer class="footer text-white pt-4" style="background-color:rgb(60, 194, 231);">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4">
            <h5 class="fw-bold mb-3">Community Pulse</h5>
            <p style="font-size: 1rem;">
              Community Pulse connects neighbors and organizers with local events, classes, and volunteer opportunities. Discover, participate, and strengthen your community!
            </p>
          </div>
          <div class="col-md-4 mb-4">
            <h6 class="fw-semibold mb-3">Contact & Links</h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                <a href="mailto:22f3001023@ds.study.iitm.ac.in" class="text-white text-decoration-none">
                  <i class="far fa-envelope"></i> 22f3001023@ds.study.iitm.ac.in
                </a>
              </li>
              <li class="mb-2">
                <a href="https://github.com/22f1001023/" class="text-white text-decoration-none" target="_blank">
                  <i class="fab fa-github"></i> GitHub
                </a>
              </li>
              <li class="mb-2">
                <a href="https://www.linkedin.com/in/sanjay-b-data-analyst" class="text-white text-decoration-none" target="_blank">
                  <i class="fab fa-linkedin"></i> LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div class="col-md-4 mb-4">
            <h6 class="fw-semibold mb-3">Quick Links</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><router-link to="/" class="text-white text-decoration-none">Home</router-link></li>
              <li class="mb-2"><router-link to="/login" class="text-white text-decoration-none">Login</router-link></li>
              <li class="mb-2"><router-link to="/register" class="text-white text-decoration-none">Register</router-link></li>
            </ul>
          </div>
        </div>
        <div class="text-center py-2" style="background-color:rgb(43, 48, 192);">
          <small>
            Developed by Sanjay B &middot; &copy; 2025 Community Pulse. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  `
};
