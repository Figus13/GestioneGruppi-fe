import {ElaboratoForTeacher} from './elaboratoForTeacher';
import {MatTableDataSource} from '@angular/material/table';
import {StudentWithStatus} from './studentWithStatus.model';

export class Proposta {

  id: number;
  name: string;
  proponenteId: string;
  token: string;
  studenti: StudentWithStatus[] | MatTableDataSource<StudentWithStatus>;

  constructor(id: number, name: string, proponenteId: string, token: string, studenti: StudentWithStatus[] | MatTableDataSource<StudentWithStatus>) {
    this.id = id;
    this.name = name;
    this.proponenteId = proponenteId;
    this.token = token;
    this.studenti = studenti;
  }


}
