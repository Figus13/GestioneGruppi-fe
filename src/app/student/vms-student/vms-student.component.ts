import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {NewVirtualMachineDialogComponent} from './new-virtual-machine-dialog/new-virtual-machine-dialog.component';
import {ModifyVMDialogComponent} from './modify-vm-dialog/modify-vm-dialog.component';
import {VirtualMachine} from '../../models/virtualMachine.model';
import {ModelloVM} from '../../models/modelloVM.model';
import {ShareVmDialogComponent} from './share-vm-dialog/share-vm-dialog.component';
import {Student} from '../../models/student.model';
import {VmDialogComponent} from '../../vm-dialog/vm-dialog.component';
import {Course} from '../../models/course.model';

@Component({
  selector: 'app-vms-student',
  templateUrl: './vms-student.component.html',
  styleUrls: ['./vms-student.component.css']
})
export class VmsStudentComponent implements OnInit {
  /**
   * Attributi
   */
  vmToModify: VirtualMachine = null;
  actualVm: VirtualMachine = null;
  _virtualMachines: VirtualMachine[];
  /* La Variabile NoTeam serve per identificare se lo studente loggato fa parte di un Team,
 se non fa parte di nessun team apparirà un suggerimento. */
  noTeam: boolean;

  /**
   * Input e output
   */
  @Input()
  course : Course;

  @Input()
  set img(vmImg: any) {
  }

  @Input()
  set risorseDisponibili(modello: ModelloVM) {

    if (modello != null) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      //se la macchina virtuale da modificare non esiste apro la dialog e nell caso il ritorno sia corretto emetto l'evento
      if (this.vmToModify == null) {
        dialogConfig.data = {'risorseDisponibili': modello};
        const dialogRef = this.dialog.open(NewVirtualMachineDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          (vm) => {
            if(vm != undefined) {
              this.newVmEmitter.emit(vm);
            }
          }
        );
      } else {
        //altrimenti uso la macchina virtuale da modificare per fare la stessa cosa
        dialogConfig.data = {'vm': this.vmToModify, 'risorseDisponibili': modello};
        const dialogRef = this.dialog.open(ModifyVMDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          (vm) => {
            if(vm!= null){
              this.modifiedVmEmitter.emit(vm);
            }
          }
        );
      }
    }
  }

  @Input()
  set availableStudents(students: Student[]) {
    if (students != null && this.actualVm != null) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = {'vm': this.actualVm, 'students': students};
      const dialogRef = this.dialog.open(ShareVmDialogComponent, dialogConfig).afterClosed().subscribe(
        x => {
          if (x != null) {
            this.shareVmEmitter.emit({'vmId': this.actualVm.id.toString(), 'ownerIds': x});
          }
        }
      );
    }
  }

  @Input()
  set virtualMachines(vms: VirtualMachine[]){
    if(vms!=null){
      this._virtualMachines=vms;
    }
  };
  @Input()
  ownedVMs: number[];

  @Output('newVM')
  newVmEmitter = new EventEmitter();
  @Output('modifiedVM')
  modifiedVmEmitter = new EventEmitter();
  @Output('selectedVmForImg')
  selectedVM1Emitter = new EventEmitter();
  @Output('selectedVM')
  selectedVmEmitter = new EventEmitter();
  @Output('turnOn')
  turnOnVmEmitter = new EventEmitter();
  @Output('turnOff')
  turnOffVmEmitter = new EventEmitter();
  @Output('delete')
  deleteVmEmitter = new EventEmitter();
  @Output('modify')
  modifyVmEmitter = new EventEmitter();
  @Output('share')
  shareVmEmitter = new EventEmitter();
  @Output('select')
  selectedVM2Emitter = new EventEmitter();

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (changes.img != undefined && changes.img.currentValue != null) {
      this.dialog.open(VmDialogComponent, {
        data: {
          img: changes.img.currentValue
        }
      }).afterClosed().subscribe(x => {
        this.selectedVM1Emitter.emit(null);
      });
    }
  }

  /**
   * Aprire una macchina virtuale se attiva lanciando una emit al container
   * @param vm
   */
  openVM(vm) {
    if(vm.attiva) {
      this.selectedVM1Emitter.emit(vm.id.toString());
    }
  }

  /**
   * Aprire una dialog per una nuova macchina virtuale con l'evento apposito
   */
  openDialogNewVirtualMachine() {
    this.selectedVM2Emitter.emit();
    this.vmToModify = null;
  }

  /**
   * Controlla che l'id della macchina virtuale passato sia in quelle possedute
   * @param id
   */
  ownsVM(id: number) {
    if (this.ownedVMs != undefined) {
      return this.ownedVMs.includes(id);
    }
    return false;
  }

  /**
   * Metodo per spegnere una vm tramite evento passato al container
   * @param vm
   */
  turnOffVm(vm: VirtualMachine) {
    this.turnOffVmEmitter.emit(vm);
  }

  /**
   * Metodo per accendere una vm tramite evento passato al container
   * @param vm
   */
  turnOnVm(vm: VirtualMachine) {
    this.turnOnVmEmitter.emit(vm);
  }

  /**
   * Metodo per cancellare una vm tramite evento passato al container
   * @param vm
   */
  deleteVm(vm: VirtualMachine) {
    this.deleteVmEmitter.emit(vm);
  }

  /**
   * Metodo per modificare una vm tramite evento passato al container
   * @param vm
   */
  modifyVM(vm: VirtualMachine) {
    this.selectedVM2Emitter.emit();
    this.vmToModify = vm;
  }

  /**
   * Metodo per condividere l'ownership di una vm tramite evento passato al container
   * @param vm
   */
  shareOwnership(vm: VirtualMachine) {
    this.actualVm = vm;
    this.selectedVmEmitter.emit(vm);
  }

  /**
   * Metodo per cancellare una vm tramite evento passato al container
   * @param vm
   */
  corsoDisattivato() {
    if(this.course != undefined){
      return !this.course.enabled;
    }
    return true;
  }
}
