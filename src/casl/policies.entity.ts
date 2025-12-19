

export class UserLogin {
  id: number;
  role: 'customer' | 'doctor' | 'admin';
}

export class UsersPolicies {
  user_id: number;
}

export class DoctorPolicies {
  doctor_id: number;
}

export class PatientPolicies {
  user_id: number;
}

export class AppoitmentPolicies {
  user_id: number;
}

export class SpecializationPolicies {}

export class SchedulePolicies {}

export class MediaInformationPolicies {}

export class DashboardPolicies {}
