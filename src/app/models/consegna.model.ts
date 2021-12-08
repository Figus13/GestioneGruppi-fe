export class Consegna {

  id: number;
  nomeConsegna: string;
  rilascio: Date;
  scadenza: Date;

  constructor(id: number, nomeConsegna:string, rilascio: Date, scadenza: Date) {
    this.id = id;
    this.nomeConsegna = nomeConsegna;
    this.rilascio = rilascio;
    this.scadenza = scadenza;
  }
}
