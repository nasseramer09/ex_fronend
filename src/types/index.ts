export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    phone_number?: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    start_adress: string;
    destination_adress: string;
    status: string;
    car_ids: number[];
    assigned_users: number[];
}
