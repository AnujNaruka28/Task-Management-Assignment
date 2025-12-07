class ApiService {
    constructor() {
        this.baseURL = '/api';
        this.token = null;
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            this.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.headers['Authorization'];
        }
    }

    // Get token from localStorage
    getStoredToken() {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                this.setToken(token);
            }
            return token;
        }
        return null;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const config = {
            ...options,
            headers: {
                ...this.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Auth Methods
    async signup(email, password) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (data.token) {
            this.setToken(data.token);
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', data.token);
            }
        }

        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        console.log(data)
        if (data.token) {

            this.setToken(data.token);
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', data.token);
            }
        }

        return data;
    }

    logout() {
        this.setToken(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
        }
    }

    // Task Methods
    async getTasks() {
        this.getStoredToken();
        return await this.request('/tasks', {
            method: 'GET',
        });
    }

    async getTaskById(id) {
        this.getStoredToken();
        return await this.request(`/tasks/${id}`, {
            method: 'GET',
        });
    }

    async createTask(taskData) {
        this.getStoredToken();
        return await this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    }

    async updateTask(id, taskData) {
        this.getStoredToken();
        return await this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData),
        });
    }

    async deleteTask(id) {
        this.getStoredToken();
        return await this.request(`/tasks/${id}`, {
            method: 'DELETE',
        });
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
