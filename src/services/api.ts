// API configuration
// For local development: http://localhost:3000/api
// For production on Vercel: just use /api (relative path)
const API_URL = '/api'

// DJs API
export async function fetchDJs() {
    try {
        const response = await fetch(`${API_URL}/djs`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching DJs:', error);
        throw error;
    }
}

export async function fetchDJById(id: string) {
    try {
        const response = await fetch(`${API_URL}/djs?id=${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching DJ ${id}:`, error);
        throw error;
    }
}

// Events API
export async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

export async function fetchEventById(id: string) {
    try {
        const response = await fetch(`${API_URL}/events?id=${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching event ${id}:`, error);
        throw error;
    }
}

// Auth API
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    whatsappNumber: string;
    zipcode: string;
    cpf: string;
    dateOfBirth: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    whatsappNumber: string;
    zipcode: string;
    cpf: string;
    dateOfBirth: string;
    admin: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function register(userData: RegisterData): Promise<User> {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function getCurrentUser(token: string): Promise<User> {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get user profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export async function updateUserProfile(token: string, userData: Partial<User>): Promise<User> {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
} 