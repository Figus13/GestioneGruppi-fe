import {Component, OnInit} from '@angular/core';
import {VirtualMachine} from '../../models/virtualMachine.model';
import {StudentService} from '../../services/student.service';
import {Team} from '../../models/team.model';
import {ActivatedRoute} from '@angular/router';
import {TeacherService} from '../../services/teacher.service';
import {ModelloVM} from '../../models/modelloVM.model';
import {Student} from '../../models/student.model';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DeleteVmDialogComponent} from "./delete-vm-dialog/delete-vm-dialog.component";
import {Course} from '../../models/course.model';

@Component({
  selector: 'app-vms-student-cont',
  templateUrl: './vms-student-cont.component.html',
  styleUrls: ['./vms-student-cont.component.css']
})
export class VmsStudentContComponent implements OnInit{

  /**
   * Attributi
   */
  private team: Team;
  noTeam: boolean = false;
  virtualMachines: VirtualMachine[];
  ownedVMs: number[];
  risorseDisponibili: ModelloVM;
  vmImg: any;
  course : Course;
  availableStudentsForVM : Student[];


  constructor(private route: ActivatedRoute, private studentService: StudentService, private teacherService: TeacherService, public dialog : MatDialog) {

    this.route.paramMap.subscribe(x => {
      this.studentService.setCourse(x.get('courseName'));
    });

    this.studentService.getTeamForStudentAndCourse().subscribe(x => {
      if (x != null && x.status != 0) {
        this.team = x;
        this.studentService.getSelectedCourse( ).subscribe(course => this.course = course);
        this.studentService.getVMs(this.team.id.toString()).subscribe(vms => {
          this.virtualMachines = vms;
        }
        );
        this.studentService.getOwnedVMs(this.team.id.toString()).subscribe(x => this.ownedVMs = x);
      } else {
        this.noTeam = true;
      }
    });
  }

  ngOnInit(): void {
  }

  /**
   * Calcola risorse disponibili tramite i dati del modelloVM e l'elenco delle VM già presenti
   * @param vms
   * @param modelloVM
   */
  calcolaRisorseDisponibili(vms : VirtualMachine[], modelloVM : ModelloVM){
    let numVCPUtot = 0;
    let ramTot = 0;
    let diskTot = 0
    let attiveTot = 0;

    vms.forEach( vm => {
      numVCPUtot += vm.numVcpu;
      ramTot += vm.ramMB;
      diskTot += vm.diskSpaceMB;
      if(vm.attiva){
        attiveTot++;
      }
    })

    this.risorseDisponibili = new ModelloVM(
      modelloVM.numVcpu - numVCPUtot,
      modelloVM.diskSpaceMB - diskTot,
      modelloVM.ramMB - ramTot,
      modelloVM.maxActiveVM - attiveTot,
      modelloVM.maxTotalVM - vms.length
    )
  }

  /**
   * Metodo per creare una nuova VM
   * @param vm
   */
  createNewVM(vm: VirtualMachine) {
    this.studentService.createVM(vm, this.team.id.toString()).subscribe(x => {
      this.studentService.getVMs(this.team.id.toString()).subscribe(x => this.virtualMachines = x);
      this.studentService.getOwnedVMs(this.team.id.toString()).subscribe(x => this.ownedVMs = x);
    },
      err => alert('Non è stato possibile creare la vm, riprovare rispettando i limiti di risorse indicati'));
  }

  /**
   * Metodo per modificare dati relativi a una vm
   * @param vm
   */
  modifyVm(vm: VirtualMachine) {
    this.studentService.modifyVm(vm, this.team).subscribe( x => {
      this.studentService.getVMs(this.team.id.toString()).subscribe(x => this.virtualMachines = x);
      this.studentService.getOwnedVMs(this.team.id.toString()).subscribe(x => this.ownedVMs = x);
      //Messaggio per annunciare che è andato tutto bene
      alert("Modifica andata a buon fine");
    }, error => {
      //Gestione degli errori
        if(error.status === 400){
          alert('Errore nella richiesta!');
        }else if(error.status === 403){
          alert('VM attiva o non di tua proprietà!');
        }else if(error.status === 404){
          alert('Elemento non trovato!');
        }else{ //Generico per i casi non gestiti direttamente
          alert('Errore!')
        }
      })
  }

  /**
   * Metodo per spegnere una macchina virtuale e aggiornare la vista delle vm
   * @param vm
   */
  turnOffVm(vm: VirtualMachine) {
    this.studentService.turnOffVm(vm, this.team).subscribe(x => {
      this.studentService.getVMs(this.team.id.toString()).subscribe(x => this.virtualMachines = x);
      this.studentService.getOwnedVMs(this.team.id.toString()).subscribe(x => this.ownedVMs = x);
    }, error => {
      vm.attiva= true;
      if(error.status === 400){
        alert('Errore nella richiesta!');
      }else if(error.status === 403){
        alert('VM attiva o non di tua proprietà!');
      }else if(error.status === 404){
        alert('Elemento non trovato!');
      }else{ //Generico per i casi non gestiti direttamente
        alert('Errore!')
      }
    });
  }

  /**
   * Metodo per accendere una macchina virtuale e aggiornare la vista delle vm
   * @param vm
   */
  turnOnVm(vm: VirtualMachine) {
    this.studentService.turnOnVm(vm, this.team).subscribe(x => {
      this.studentService.getVMs(this.team.id.toString()).subscribe(x => { this.virtualMachines = x; } );
      this.studentService.getOwnedVMs(this.team.id.toString()).subscribe(x => {this.ownedVMs = x; } );
    },error => {
      vm.attiva=false;
      if(error.status === 400){
        alert('Errore nella richiesta!');
      }else if(error.status === 403){
        alert('Non è possibile eseguire l\'operazione richiesta');
      }else if(error.status === 404){
        alert('Elemento non trovato!');
      }else{ //Generico per i casi non gestiti direttamente
        alert('Errore!')
      }
    });
  }

  /**
   * Metodo per cancellare una VM, apre una dialog in cui si chiede conferma della scelta,
   * se l'utente conferma viene chiamato il servizio per cancellare.
   * @param vm
   */
  deleteVm(vm: VirtualMachine) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      vm: vm,
    };

    this.dialog.open(DeleteVmDialogComponent, dialogConfig).afterClosed()
      .subscribe(x => {
        if(x==true){
          this.studentService.deleteVm(vm, this.team).subscribe(x => {
              this.studentService.getVMs(this.team.id.toString()).subscribe(x => this.virtualMachines = x);
              this.studentService.getOwnedVMs(this.team.id.toString()).subscribe(x => this.ownedVMs = x);
            }, error => {
            //Gestione degli errori
              if(error.status === 403){
                alert('Operazione non permessa!');
              }else if(error.status === 404){
                alert('Elemento non trovato!');
              }else if(error.status === 400){
                alert('Errore nella richiesta!');
              }else{ //Gestione degli errori non valutati direttamente
                alert('Errore!');
              }
            }
          );
        }
      });
  }

  /**
   * Metodo per ottenere gli studenti disponibili a farsi condividere l'ownership della VM
   * @param vm
   */
  getAvailableStudents(vm: VirtualMachine) {
    this.studentService.getAvailableStudentsForVM(vm.id.toString(), this.team.id.toString()).subscribe(
      x => this.availableStudentsForVM = x
    );

  }

  /**
   * Metodo per condividere l'ownership da un utente con gli altri
   * @param map: contiene 'vmId' (stringa identificativa della vm) e 'ownerIds' (vettore con futuri owner)
   */
  shareOwnership( map : any) {
    this.studentService.shareOwnership(map['vmId'], this.team.id.toString(), map['ownerIds']).subscribe(
      x => {},
      error => {
        if(error.status === 400){
          alert('Errore nella richiesta!');
        }else if(error.status === 404){
          alert('Elemento non trovato!');
        }
      }
    );

  }

  /**
   * Metodo per ottenere le risorse disponbili, prima chiede le VM relative a un certo team, poi il modello del corso e poi
   * chiama la funzione calcolaRisorseDisponibili
   */
  getRisorse() {
    this.studentService.getVMs(this.team.id.toString()).subscribe(vms => {
        this.virtualMachines = vms;
        this.studentService.getModelloVM().subscribe(modello =>
          this.calcolaRisorseDisponibili(vms, modello));
      }
    );
  }

  /**
   * Metodo per ottenere l'immagine di una macchina virtuale, all'assegnazione scatena in input il livello presentational
   * @param vmId
   */
  getSingleVM(vmId: string) {
    if (vmId == null) {
      this.vmImg = null;
    } else {
      this.studentService.getVm(vmId, this.team.id.toString()).subscribe(x => {
        this.vmImg = 'data:image/png;base64,' + x;
      });
    }
  }
}
