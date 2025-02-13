// src/services/api.ts
import { Journey } from '@/types/Journey';

interface ApiResponse<T> {
    data: T;
    error?: string;
}

export class ApiService {
    private baseUrl: string;
    
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL;
    }

    private async fetchWithAuth<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const token = localStorage.getItem('token');
            let headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            };

            // Add Content-Type only if we're not sending FormData
            if (!(options.body instanceof FormData)) {
                headers = {
                    'Content-Type': 'application/json',
                    ...headers,
                };
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return {
                data: null as T,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
        }
    }

    // Journeys
    async getUserJourneys(userId: string): Promise<ApiResponse<Journey[]>> {
        return this.fetchWithAuth<Journey[]>(`/api/journey/user/${userId}`);
    }

    async getJourneyById(journeyId: string): Promise<ApiResponse<Journey>> {
        return this.fetchWithAuth<Journey>(`/api/journey/${journeyId}`);
    }

    async createJourney(journey: Partial<Journey>): Promise<ApiResponse<Journey>> {
        return this.fetchWithAuth<Journey>('/api/journey', {
            method: 'POST',
            body: JSON.stringify(journey),
        });
    }

    async updateJourney(journeyId: string, journey: Partial<Journey>): Promise<ApiResponse<Journey>> {
        return this.fetchWithAuth<Journey>(`/api/journey/${journeyId}`, {
            method: 'PUT',
            body: JSON.stringify(journey),
        });
    }

    async deleteJourney(journeyId: string): Promise<ApiResponse<void>> {
        return this.fetchWithAuth<void>(`/api/journey/${journeyId}`, {
            method: 'DELETE',
        });
    }

    // Upload methods
    async uploadImage(journeyId: string, file: File): Promise<ApiResponse<string>> {
        const formData = new FormData();
        formData.append('file', file);

        // For file uploads, we omit Content-Type to let the browser set it automatically with the boundary
        const headers = {} as HeadersInit;
        return this.fetchWithAuth<string>(`/api/journey/${journeyId}/upload/image`, {
            method: 'POST',
            headers,
            body: formData,
        });
    }

    async uploadGpx(journeyId: string, file: File): Promise<ApiResponse<string>> {
        const formData = new FormData();
        formData.append('file', file);

        // For file uploads, we omit Content-Type to let the browser set it automatically with the boundary
        const headers = {} as HeadersInit;
        return this.fetchWithAuth<string>(`/api/journey/${journeyId}/upload/gpx`, {
            method: 'POST',
            headers,
            body: formData,
        });
    }
}

export const api = new ApiService();