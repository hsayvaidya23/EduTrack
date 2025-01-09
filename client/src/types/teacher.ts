import { Class } from './class';

export interface Teacher {
  id: string;
  name: string;
  gender: string;
  dob: Date;
  contactDetails: string;
  salary: number;
  assignedClass: string; // Class ID
}