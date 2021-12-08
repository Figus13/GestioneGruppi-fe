import {Timestamp} from "rxjs";

export class ElaboratoBE {

  id: number;
  stato: string;
  dataCaricamento: Date;
  studentId: string;
  possibileRiconsegna: boolean;
  voto: string;

  constructor(id: number, stato: string, dataCaricamento: Date, studentId: string,
              possibileRiconsegna: boolean, voto: string) {
    this.id = id;
    this.stato = stato;
    this.dataCaricamento = dataCaricamento;
    this.studentId = studentId;
    this.possibileRiconsegna = possibileRiconsegna;
    this.voto = voto;
  }
}
