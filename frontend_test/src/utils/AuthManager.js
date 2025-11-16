/**
 * AuthManager - Handles authentication operations for the application
 * Provides methods for login, logout, token management, and user session handling
 */

export default class AuthManager {
    /**
     * Login user with username and password
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<Object>} - Login response data
     */
    static async login(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return data;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Register a new user
     * @param {string} username - User's username
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<Object>} - Registration response data
     */
    static async register(username, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    /**
     * Get current user information from the server
     * @returns {Promise<Object>} - User information
     */
    static async getCurrentUser() {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('user', JSON.stringify(userData));
                return userData;
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Get current user error:', error);
            this.logout(); // Clear invalid token
            throw error;
        }
    }

    /**
     * Verify if the current token is valid
     * @returns {Promise<boolean>} - True if token is valid
     */
    static async verifyToken() {
        try {
            const token = this.getToken();
            if (!token) return false;

            const response = await fetch('/api/auth/verify-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }

    /**
     * Change user password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} - Response data
     */
    static async changePassword(currentPassword, newPassword) {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Password change failed');
            }
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        }
    }

    /**
     * Get stored authentication token
     * @returns {string|null} - JWT token or null if not found
     */
    static getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Get stored user data
     * @returns {Object|null} - User object or null if not found
     */
    static getUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Check if user is currently logged in
     * @returns {boolean} - True if user is logged in
     */
    static isLoggedIn() {
        return !!this.getToken();
    }

    /**
     * Logout user and clear stored data
     */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: Call logout endpoint to invalidate token on server
        // fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    }

    /**
     * Get authorization headers for API requests
     * @returns {Object} - Headers object with Authorization
     */
    static getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    /**
     * Make authenticated API request
     * @param {string} url - API endpoint URL
     * @param {Object} options - Fetch options
     * @returns {Promise<Response>} - Fetch response
     */
    static async authenticatedFetch(url, options = {}) {
        const headers = {
            ...options.headers,
            ...this.getAuthHeaders()
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        // If token is invalid, logout and redirect
        if (response.status === 401) {
            this.logout();
            window.location.href = '/';
        }

        return response;
    }
}