export class ModelloVM
{
  numVcpu;
  diskSpaceMB;
  ramMB;
  maxActiveVM;
  maxTotalVM;
  constructor(numVcpu, diskSpaceMB, ramMB, maxActiveVM, maxTotalVM)
  {
    this.numVcpu = numVcpu;
    this.diskSpaceMB = diskSpaceMB;
    this.ramMB = ramMB;
    this.maxActiveVM = maxActiveVM;
    this.maxTotalVM = maxTotalVM;
  }
}
