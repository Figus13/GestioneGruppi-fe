import {Component, OnInit} from '@angular/core';
import {Consegna} from '../../models/consegna.model';
import {Elaborato} from '../../models/elaborato.model';
import {TeacherService} from '../../services/teacher.service';
import {ElaboratoForTeacher} from '../../models/elaboratoForTeacher';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-consegne-cont',
  templateUrl: './consegne-cont.component.html',
  styleUrls: ['./consegne-cont.component.css']
})
export class ConsegneContComponent implements OnInit {
  consegne: Consegna[];
  elaborati: Elaborato[];
  elaboratoImg: any;
  elaborato: any;
  consegnaImg: string;
  lastOne: boolean;


  constructor(private teacherService: TeacherService, private  route : ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe( x => {
      this.teacherService.setCourse(x.get('courseName'));
      this.teacherService.getConsegneForCourse().subscribe( consegne => this.consegne = consegne, err => this.router.navigate(['/']));
    });
  }
  ngOnInit(): void {

  }

  getElaboratiForCourseAndConsegnaId(consegnaId: String) {
    let elaboratiFinali: Elaborato[] = new Array<Elaborato>();

    this.teacherService.getElaboratiForCourseAndConsegnaId(consegnaId.toString()).subscribe(
      elaboratiForTeacher => {
        let map = new Map<string, ElaboratoForTeacher[]>();
        elaboratiForTeacher.forEach(elaboratoForTeacher => {
          let tmp = map.get(elaboratoForTeacher.studentId);
          if (tmp != null) {
            tmp.push(elaboratoForTeacher);
          } else {
            let newArray = new Array<ElaboratoForTeacher>();
            newArray.push(elaboratoForTeacher);
            map.set(elaboratoForTeacher.studentId, newArray);
          }
        });
        for (let studentId of map.keys()) {
          let tmpArray = map.get(studentId);
          tmpArray.sort((a, b) => a['dataCaricamento'] > b['dataCaricamento'] ? -1 : a['dataCaricamento'] === b['dataCaricamento'] ? 0 : +1);
          let elabPadre = new Elaborato(tmpArray[0].id,tmpArray[0].name,tmpArray[0].firstName,tmpArray[0].studentId, tmpArray[0].stato,tmpArray[0].dataCaricamento,tmpArray[0].possibileRiconsegna,tmpArray[0].voto, new Array<ElaboratoForTeacher>());
          tmpArray.forEach(element => {
            let elabForTeacherArray = elabPadre.precedenti as ElaboratoForTeacher[];
            elabForTeacherArray.push(element);
          });
          elaboratiFinali.push(elabPadre);
        }
        this.elaborati = elaboratiFinali;
      });
  }



  addConsegna(map: Map<string, any>) {
    this.teacherService.addConsegna(map.get('options'), map.get('formData')).subscribe(ev =>
      this.teacherService.getConsegneForCourse().subscribe( consegne => this.consegne = consegne),
      error => {
        if(error.status === 400){
          alert('Errore nella richiesta!');
        }else if(error.status === 404){
          alert('Corso/Docente non trovato!');
        }
      });
  }

  /**
   * Metodo per ottenere un elaborato
   * @param $event
   */
  getElaboratoImg($event) {
    if($event == null){
       this.elaboratoImg = null;
    }else{
      this.teacherService.getElaborato($event.consegnaId, $event.elaborato).subscribe(x => {
        if(x===''){
          this.elaboratoImg='vuoto';
        }else{
        this.elaboratoImg = 'data:image/png;base64,' + x;
        }
      });
    }
  }

  /**
   * Metodo per fare l'upload della revisione
   * @param $event
   */
  uploadRevisione($event: any) {
    this.teacherService.uploadRevisione($event.consegnaId, $event.elaboratoId, $event.options, $event.formData)
      .subscribe( x=> { this.getElaboratiForCourseAndConsegnaId($event.consegnaId)},
    (err) => {
        //Gestione degli errori
        if(err.status === 400){
          alert('Errore nella richiesta!');
        }else if(err.status === 403){
          alert('Operazione non permessa!');
        }else if(err.status === 404){
          alert('Elemento non trovato!');
        }else if(err.status === 500){
          alert('Eccezione interna al server!');
        }else{ //Gestione casi generici
          alert('Errore!');
        }
    });

  }

  /**
   * Metodo per ottenere l'immagine di una consegna
   * @param consegnaId
   */
  getConsegna(consegnaId: string) {
    if (consegnaId == null) {
      this.consegnaImg = null;
    } else {
      this.teacherService.getConsegna(consegnaId).subscribe(img => {
        this.consegnaImg = 'data:image/png;base64,' + img;
      });
    }
  }
}
