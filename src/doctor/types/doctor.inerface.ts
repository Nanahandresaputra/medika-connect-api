

export interface DoctorInterface {
  id: number;
  username: string;
  name: string;
  code_doctor: string;
  phone_number: string;
  address: string;
  email: string;
  specialization: SpecializationInterface;
  status: number;
  ext_img_id: string;
  img_profile: string;
}
