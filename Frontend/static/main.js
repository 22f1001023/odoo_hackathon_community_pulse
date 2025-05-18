const routes = [
    {path: '/', component: Home},
    {path: '/login',component: Login},
    {path: '/register',component: Register},
    {path: '/admin/dashboard',component: AdminDashboard},
    {path: '/admin/users',component: AdminUsers},
    {path: '/admin/categories',component: AdminCategories},
    {path: '/dashboard',component: UserDashboard},
    {path: '/event', component: Events},
    {path: '/profile', component: UserProfile},
];    

const router = new VueRouter({
    routes,
    mode: 'history'
});

new Vue({
    el: '#app',
    router,
    template: `
    <div class="app"> 
    <nav-bar></nav-bar>
    <router-view></router-view>
    <foot></foot>
    </div>`,
    components: {
        // 'nav-bar': Navbar,
        'foot': Footer
    },
});