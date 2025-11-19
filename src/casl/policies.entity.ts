export enum userRoleType {
  admin,
  customer,
  doctor,
}

export class UserLogin {
  id: number;
  role: userRoleType;
}

export class Users {
  id: number;
}

export class Doctor {
  id: number;
}

export class Patient {
  id: number;
}

export class Appoitment {}

export class Specialization {}

export class Schedule {}

export class MediaInformation {}

export class Dashboard {}
