import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Team} from '../../models/team.model';
import {VirtualMachine} from '../../models/virtualMachine.model';
import {TeacherService} from '../../services/teacher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ModelloVM} from "../../models/modelloVM.model";

@Component({
  selector: 'app-vms-cont',
  templateUrl: './vms-cont.component.html',
  styleUrls: ['./vms-cont.component.css']
})
export class VmsContComponent implements OnInit {
  /**
   * Attributi
   */
  teams: Team[];
  vms: VirtualMachine[];
  vmImg: any;


  constructor(private teacherService: TeacherService, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(x => {
      this.teacherService.setCourse(x.get('courseName'));
      teacherService.getTeamsForCourse().subscribe(x => this.teams = x, err => this.router.navigate(['/']));
    });
  }


  ngOnInit(): void {
  }

  /**
   * Metodo per ottenere le VM relative a un team passato come parametro, settano una variabile this.vms che scatena un aggiornamento
   * nel presentational
   * @param $event
   */
  getVMs($event) {
    this.teacherService.getVmsForTeam($event.id).subscribe(x => this.vms = x);
  }

  /**
   * Metodo per ottenere l'immagine di una singola VM, l'aggiornamento di vmImg scatena un aggiornamento nel presentational
   * @param map
   */
  getSingleVM(map: any) {
    if (map['vmId'] == null) {
      this.vmImg = null;
    } else {
      this.teacherService.getVm(map['vmId'], map['teamId']).subscribe(x => {
        this.vmImg = 'data:image/png;base64,' + x;
      });
    }

  }

  /**
   * Aggiorna i valori del modello VM
   * @param vmModel
   */
  updateSettings(vmModel: any) {
    this.teacherService.updateModelloVM(vmModel).subscribe(x => console.log('Modifica correttamente effettuata!'),
        error => {
        //Gestione degli errori
          if (error.status === 403) {
            alert('Operazione non permessa!');
          }else if(error.status === 400){
            alert('Errore nella richiesta! Le risorse attualmente impegnate superano i nuovi parametri!');
          }else if(error.status === 404) {
            alert('Corso non trovato!');
          }else{ //Gestione degli errori non valutati direttamente
            alert('Errore!');
          }
        } );
  }
}
