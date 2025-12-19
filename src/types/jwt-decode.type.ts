

export interface JwtDecodeInterface {
    name: string;
    id: number;
    email: string;
    role: 'admin' | 'customer' | 'doctor';
    iat: any;
}