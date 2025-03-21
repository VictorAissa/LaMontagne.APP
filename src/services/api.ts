import { Journey } from '@/types/Journey';
import { Meteo } from '@/types/Meteo';

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
            
            // Check if the response has content before parsing
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json') && response.status !== 204) {
                const text = await response.text();
                // Only parse if there's actually content to parse
                const data = text.length > 0 ? JSON.parse(text) : null;
                return { data };
            }
            
            // For empty responses (like many DELETE operations) just return success with null data
            return { data: null as T };
        } catch (error) {
            return {
                data: null as T,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
        }
    }

    //** JOURNEY */
    async getUserJourneys(userId: string): Promise<ApiResponse<Journey[]>> {
        return this.fetchWithAuth<Journey[]>(`/api/journey/user/${userId}`);
    }

    async getJourneyById(journeyId: string): Promise<ApiResponse<Journey>> {
        return this.fetchWithAuth<Journey>(`/api/journey/${journeyId}`);
    }

    async createJourney(journey: Partial<Journey>, files?: File[]): Promise<ApiResponse<Journey>> {
        if (!files || files.length === 0) {
            return this.fetchWithAuth<Journey>('/api/journey', {
                method: 'POST',
                body: JSON.stringify(journey),
            });
        }
        
        const formData = new FormData();
        formData.append('journeyData', new Blob([JSON.stringify(journey)], {
            type: 'application/json'
        }));
        
        files.forEach(file => {
            formData.append('files', file);
        });
        
        return this.fetchWithAuth<Journey>('/api/journey', {
            method: 'POST',
            body: formData,
        });
    }

    async updateJourney(journey: Partial<Journey>, files?: File[]): Promise<ApiResponse<Journey>> {
        if (!files || files.length === 0) {
            return this.fetchWithAuth<Journey>(`/api/journey`, {
                method: 'PUT',
                body: JSON.stringify(journey),
            });
        }
        
        const formData = new FormData();
        //const journeyWithId = { ...journey, id: journeyId };
        
        formData.append('journeyData', new Blob([JSON.stringify(journey)], {
            type: 'application/json'
        }));
        
        files.forEach(file => {
            formData.append('files', file);
        });
        
        return this.fetchWithAuth<Journey>(`/api/journey`, {
            method: 'PUT',
            body: formData,
        });
    }

    async deleteJourney(journeyId: string): Promise<ApiResponse<void>> {
        return this.fetchWithAuth<void>(`/api/journey/${journeyId}`, {
            method: 'DELETE',
        });
    }

    //** UPLOAD FILE */
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

    /*** METEO */
    async getJourneyMeteo(journeyId: string): Promise<ApiResponse<Meteo>> {
        return this.fetchWithAuth<Meteo>(`/api/meteo/journey/${journeyId}`);
    }

    async getMeteoByCoordinates(latitude: number, longitude: number, date: string): Promise<ApiResponse<Meteo>> {
        return this.fetchWithAuth<Meteo>('/api/meteo', {
            method: 'POST',
            body: JSON.stringify({
                latitude,
                longitude,
                date, // yyyy-MM-dd
            }),
        });
    }

    async refreshJourneyMeteo(journeyId: string): Promise<ApiResponse<Meteo>> {
        return this.fetchWithAuth<Meteo>(`/api/meteo/journey/${journeyId}/refresh`, {
            method: 'PUT',
        });
    }
}

export const api = new ApiService();