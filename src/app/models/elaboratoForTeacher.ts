export class ElaboratoForTeacher {

  id: number;
  stato: string;
  dataCaricamento: Date;
  studentId: string;
  name:string;
  firstName:string;
  possibileRiconsegna: boolean;
  voto: string;



  constructor(id: number, name: string, firstName: string, studentId: string, stato: string, dataCaricamento: Date, possibileRiconsegna: boolean, voto: string) {
    this.id = id;
    this.stato = stato;
    this.name = name;
    this.firstName = firstName;
    this.dataCaricamento = dataCaricamento;
    this.studentId = studentId;
    this.possibileRiconsegna = possibileRiconsegna;
    this.voto = voto;
  }


}
