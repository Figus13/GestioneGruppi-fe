import {Timestamp} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {ElaboratoBE} from "./elaboratoBE.model";
import {ElaboratoForTeacher} from './elaboratoForTeacher';

export class Elaborato {

  id: number;
  name:string;
  firstName:string;
  studentId: string;
  stato: string;
  dataCaricamento: Date;
  possibileRiconsegna: boolean;
  voto: string;
  precedenti: ElaboratoForTeacher[] | MatTableDataSource<ElaboratoForTeacher>;


  constructor(id: number, name: string, firstName: string, studentId: string, stato: string, dataCaricamento: Date, possibileRiconsegna: boolean, voto: string, precedenti: ElaboratoForTeacher[] | MatTableDataSource<ElaboratoForTeacher>) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.studentId = studentId;
    this.stato = stato;
    this.dataCaricamento = dataCaricamento;
    this.possibileRiconsegna = possibileRiconsegna;
    this.voto = voto;
    this.precedenti = precedenti;
  }


}
