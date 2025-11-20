export enum userRoleType {
  admin = 'admin',
  customer = 'customer',
  doctor = 'doctor',
}

export class UserLogin {
  id: number;
  role: userRoleType;
}

export class Users {
  user_id: number;
}

export class Doctor {
  doctor_id: number;
}

export class Patient {
  user_id: number;
}

export class Appoitment {
  user_id: number;
}

export class Specialization {}

export class Schedule {}

export class MediaInformation {}

export class Dashboard {}
