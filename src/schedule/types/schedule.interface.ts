export interface TimeDateInterface {
  id?: number;
  date: string;
  time: string[] | string;
}

interface SpecializationSchedule {
  id: number;
  name: string;
}

export interface ResponseListScheduleByDoctor {
  id: number;
  name: string;
  specialization: SpecializationSchedule;
  schedule: TimeDateInterface[];
}
