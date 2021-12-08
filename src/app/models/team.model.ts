export class Team {

  id: number;
  name: string;
  status: number;
  proponenteId: string;

  constructor(id: number, name: string, status: number, proponenteId: string) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.proponenteId = proponenteId;
  }


}
