export class VirtualMachine{

      id: number;
      numVcpu: number;
      diskSpaceMB: number;
      ramMB: number;
      attiva: boolean;
      creator: string;

      constructor(id: number, numVCPU: number, diskSpaceMB: number,  ramMB: number, attiva: boolean, creator: string) {
        this.id = id;
        this.numVcpu = numVCPU;
        this.diskSpaceMB = diskSpaceMB;
        this.ramMB = ramMB;
        this.attiva = attiva;
        this.creator = creator;
      }


}
