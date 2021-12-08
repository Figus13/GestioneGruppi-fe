import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import {Team} from '../../models/team.model';
import {VirtualMachine} from '../../models/virtualMachine.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SettingsDialogComponent} from './settings-dialog/settings-dialog.component';
import {VmDialogComponent} from '../../vm-dialog/vm-dialog.component';
import {Observable, ObservableInput} from 'rxjs';


@Component({
  selector: 'app-vms',
  templateUrl: './vms.component.html',
  styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit, OnChanges {

  /**
   * Attributi, step indica l'indice dei gruppi, inizializzato a negativo
   */
  step = -1;

  /**
   * Input e Output
   */
  @Input()
  gruppi: Team[];

  @Input()
  macchineVirtuali: VirtualMachine[];

  @Input()
  set img(vmImg: any) {
  }

  // tslint:disable-next-line:no-output-rename
  @Output('vmUpload')
  macchineVirtualiEmitter = new EventEmitter();

  @Output('vmScelta')
  vmSceltaEmitter = new EventEmitter();

  @Output('updateSettings')
  updateSettingsEmitter = new EventEmitter();

  /**
   * Setta l'indice del gruppo e scatena un evento che serve per chiedere tutte le vm di un certo team
   * @param gruppo
   */
  setStep(gruppo: Team) {
    this.step = this.gruppi.indexOf(gruppo);
    this.macchineVirtualiEmitter.emit(gruppo);
  }

  ngOnInit(): void {
  }

  constructor(public dialog: MatDialog) {
  }

  /**
   * Al variare del valore di qualche immagine si attiva, aprendo la dialog per visualizzarla
   * @param changes
   */
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (changes.img != undefined && changes.img.currentValue != null) {
      this.dialog.open(VmDialogComponent, {
        data: {
          img: changes.img.currentValue
        }
      }).afterClosed().subscribe(x => {
        this.vmSceltaEmitter.emit({vmId:null, teamId:null});
      });
    }
  }

  /**
   * Apre la dialog per la modifica dei settaggi delle macchine virtuali, il ritorno lo passo a un evento che
   * comunica con il container
   */
  openSettings() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(SettingsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
        vmModel => {
          if(vmModel != null){
            this.updateSettingsEmitter.emit(vmModel);
          }
        }
    );
  }

  /**
   * Metodo per ottenere l'immagine della VM richiesta, comunica tramite evento al container che aggiornerà il set dell'immagine
   * @param vmId
   */
  openVM(vmId) {
    this.vmSceltaEmitter.emit({vmId:vmId.id.toString(), teamId:this.gruppi[this.step].id.toString()});
  }
}
