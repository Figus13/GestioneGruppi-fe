import {Course} from "./course.model";
import {ModelloVM} from "./modelloVM.model";

export class Parametri
{
  courseDTO: Course;
  modelloVMDTO: ModelloVM;
  constructor(course: Course, model: ModelloVM)
  {
    this.courseDTO = course;
    this.modelloVMDTO = model;
  }
}
