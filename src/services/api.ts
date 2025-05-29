const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions extends RequestInit {
    body?: any;
}

export async function apiRequest<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    options?: RequestOptions
): Promise<T> {
    const token = localStorage.getItem('access_token');
    
    console.log('Current token:', token ? 'Token exists' : 'No token found');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options?.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : options?.headers as Record<string, string> || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header set:', headers['Authorization'] ? 'Yes' : 'No');
    }

    const config: RequestInit = {
        method,
        headers,
        credentials: 'include',
        mode: 'cors',
        ...options
    };

    if (options?.body) {
        if (typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        } else {
            config.body = options.body;
        }
    }

    try {
        const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${API_BASE_URL}${formattedEndpoint}`;
        
        console.log('Making request to:', url);
        console.log('Request method:', method);
        console.log('Request headers:', {
            ...headers,
            Authorization: headers.Authorization ? 'Bearer [TOKEN]' : 'No token'
        });
        
        if (method !== 'GET') {
            try {
                const preflightResponse = await fetch(url, {
                    method: 'OPTIONS', 
                    headers: {
                        'Access-Control-Request-Method': method,
                        'Access-Control-Request-Headers': 'Content-Type,Authorization',
                        'Origin': window.location.origin
                    },
                    credentials: 'include',
                    mode: 'cors'
                });

                if (!preflightResponse.ok) {
                    console.warn('Preflight request failed:', preflightResponse.status);
                }
            } catch (preflightError) {
                console.warn('Preflight request error:', preflightError);
            }
        }

        const response = await fetch(url, config);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.status === 401) {
            const responseText = await response.text();
            console.warn("Authentication failed or token invalid.");
            console.warn("Response body:", responseText);
            console.warn("Current token state:", token ? 'Token exists' : 'No token');
            
            localStorage.removeItem('access_token');
            window.location.href = '/login';
            throw new Error('Authentication failed or token invalid');
        }

        if (response.status === 422) {
            const errorData = await response.json();
            console.error('Validation error:', errorData);
            throw new Error(errorData.msg || 'Validation error');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            console.error('Error response:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return {} as T;
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}