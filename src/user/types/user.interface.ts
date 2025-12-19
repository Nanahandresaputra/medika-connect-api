export interface UserInterface {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'customer';
  status: number;
}
