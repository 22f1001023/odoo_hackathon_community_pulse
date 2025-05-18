const AdminCategories = {
    components: {
        'admin-navbar': AdminNavbar
    },
    template: `
    <div>
        <!-- Include Admin Navbar -->
        <admin-navbar></admin-navbar>

        <!-- Admin Categories Content -->
        <div class="container mt-4">
            <h2 class="mb-4">Manage Event Categories</h2>

            <!-- Error and Success Messages -->
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

            <!-- Create New Category Section -->
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Add New Category</h5>
                </div>
                <div class="card-body">
                    <form @submit.prevent="createCategory" class="row g-3">
                        <div class="col-md-8">
                            <input type="text" id="name" v-model="newCategory.name" class="form-control" 
                                placeholder="Category name (e.g., Sports, Garage Sale, Workshop)" required>
                        </div>
                        <div class="col-md-4">
                            <button type="submit" class="btn btn-primary w-100">Add Category</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- List All Categories Section -->
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Existing Categories</h5>
                </div>
                <div class="card-body p-0">
                    <div v-if="categories.length === 0" class="p-4 text-center">
                        <p class="text-muted mb-0">No categories found. Add your first category above.</p>
                    </div>
                    <table v-else class="table table-striped table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Render Each Category -->
                            <tr v-for="category in categories" :key="category.id">
                                <td>{{ category.id }}</td>
                                <td>
                                    <input v-if="editingCategory === category.id" 
                                        type="text" 
                                        v-model="editedName" 
                                        class="form-control"
                                        @keyup.enter="updateCategory(category.id)">
                                    <span v-else>{{ category.name }}</span>
                                </td>
                                <td>
                                    <div v-if="editingCategory === category.id">
                                        <button @click="updateCategory(category.id)" class="btn btn-success btn-sm me-2">
                                            Save
                                        </button>
                                        <button @click="cancelEdit()" class="btn btn-secondary btn-sm">
                                            Cancel
                                        </button>
                                    </div>
                                    <div v-else>
                                        <button @click="startEdit(category)" class="btn btn-outline-primary btn-sm me-2">
                                            Edit
                                        </button>
                                        <button @click="deleteCategory(category.id)" class="btn btn-outline-danger btn-sm">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`,

    data() {
        return {
            categories: [], // List of all categories
            newCategory: {
                name: ''
            },
            editingCategory: null, // ID of category being edited
            editedName: '',        // Temporary storage for edited name
            errorMessage: '',
            successMessage: ''
        };
    },

    mounted() {
        this.fetchCategories();
    },

    methods: {
        // Fetch All Categories
        async fetchCategories() {
            try {
                this.errorMessage = '';
                const response = await fetch('/api/categories');
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch categories.');
                }

                this.categories = await response.json();
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        // Create a New Category
        async createCategory() {
            try {
                this.errorMessage = '';
                this.successMessage = '';
                
                if (!this.newCategory.name.trim()) {
                    this.errorMessage = 'Category name is required.';
                    return;
                }

                const response = await fetch('/api/admin/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.newCategory.name.trim()
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create category.');
                }

                const data = await response.json();
                this.successMessage = data.message || 'Category added successfully.';
                this.newCategory.name = '';
                this.fetchCategories(); // Refresh the list of categories
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        // Start Editing a Category
        startEdit(category) {
            this.editingCategory = category.id;
            this.editedName = category.name;
        },

        // Cancel Editing
        cancelEdit() {
            this.editingCategory = null;
            this.editedName = '';
        },

        // Update Category Name
        async updateCategory(categoryId) {
            try {
                this.errorMessage = '';
                this.successMessage = '';
                
                if (!this.editedName.trim()) {
                    this.errorMessage = 'Category name cannot be empty.';
                    return;
                }

                // Note: This endpoint might need to be implemented in your backend
                const response = await fetch(`/api/admin/categories/${categoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.editedName.trim()
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to update category.');
                }

                this.successMessage = 'Category updated successfully.';
                this.editingCategory = null;
                this.fetchCategories(); // Refresh the list
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        // Delete a Category
        async deleteCategory(categoryId) {
            if (!confirm('Are you sure you want to delete this category? This might affect events using this category.')) {
                return;
            }

            try {
                this.errorMessage = '';
                this.successMessage = '';

                // Note: This endpoint might need to be implemented in your backend
                const response = await fetch(`/api/admin/categories/${categoryId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete category.');
                }

                this.successMessage = 'Category deleted successfully.';
                this.fetchCategories(); // Refresh the list
            } catch (error) {
                this.errorMessage = error.message;
            }
        }
    }
};
