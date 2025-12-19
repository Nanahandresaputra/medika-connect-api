export interface FilterData {
  limit?: number; //optional
  page?: number; //optional
  search?: string; //optional
  specializationId?: number; // for (schedule)
  doctorId?:number; // for (schedule | patient | appoitment)
  date?:string; // for (schedule)
  startDate?: string; // for filter date range
  endDate?: string; // for filter date range
  patientId?: number; // for (appoitment)
  roleUser?: 'admin' | 'customer' // for (user)
}
