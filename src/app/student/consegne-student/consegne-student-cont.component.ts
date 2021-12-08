import {Component, OnInit} from '@angular/core';
import {StudentService} from '../../services/student.service';
import {ActivatedRoute} from '@angular/router';
import {ElaboratoForTeacher} from '../../models/elaboratoForTeacher';
import {Consegna} from '../../models/consegna.model';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-consegne-student-cont',
  templateUrl: './consegne-student-cont.component.html',
  styleUrls: ['./consegne-student-cont.component.css']
})
export class ConsegneStudentContComponent implements OnInit {

  /**
   * Attributi utilizzati
   */
  consegne: Consegna[];
  elaborati: ElaboratoForTeacher[];
  consegnaImg: string;
  elaboratoImg: string;

  constructor(private studentService: StudentService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(x => {
      this.studentService.setCourse(x.get('courseName'));
    });
    this.studentService.getConsegneForStudentAndCourse().subscribe(x => this.consegne = x);
  }

  ngOnInit(): void {
  }



  /**
   * Chiama il service per ottenere gli elaborati relativi a una consegna per lo studente loggato,
   * assenga il ritorno a this.elaborati
   * @param consegnaId
   */
  getElaboratiForStudentAndConsegnaId(consegnaId: string) {
    this.studentService.getElaboratiByConsegnaId(consegnaId).subscribe(elaborati => {
        this.elaborati = elaborati;
      }
    );
  }

  /**
   * Chiama il servizio per ottenere una consegna dato il suo Id, l'immagine ritornata la usa per chiamare il
   * metodo relativo agli elaborati per di quella consegna dello studente selezionato
   * @param consegnaId
   */
  getConsegna(consegnaId: string) {
    if (consegnaId == null) {
      this.consegnaImg = null;
    } else {
      this.studentService.getConsegna(consegnaId).subscribe(img => {
        this.consegnaImg = 'data:image/png;base64,' + img;
        this.getElaboratiForStudentAndConsegnaId(consegnaId);
      });
    }
  }

  /**
   * Se lo stato dell'elaborato è "RIVISTO" chiama il servizio per leggere una correzione.
   * Se lo stato è diverso invece chiama il servizio per ottenere l'immagine dell'elaborato relativo.
   * @param map
   */
  getElaborato(map: Map<string, string>) {
    if (map == null) {
      this.elaboratoImg = null;
    }else {
      let stato = map.get('stato');
      if(stato != 'RIVISTO'){
        this.studentService.getElaborato(map).subscribe(img =>
        {
          if(img===''){
            this.elaboratoImg='vuoto';
          }else {
            this.elaboratoImg = 'data:image/png;base64,' + img;
          }
        });
      }else{
        this.studentService.leggiCorrezione(map).subscribe(img => {
          if (img === '') {
            this.elaboratoImg = 'vuoto';
          }else{
            this.elaboratoImg = 'data:image/png;base64,' + img;
          }
          this.getElaboratiForStudentAndConsegnaId(map.get('consegnaId'));
        });
      }

    }
  }

  /**
   * Chiama il servizio per fare l'upload di un nuovo elaborato, al ritorno chiama il metodo che richiede tutti gli
   * elaborati per aggiornarli e visualizzare anche il nuovo creato.
   * @param map
   */
  uploadElaborato(map: Map<string, string>) {
    const options = { params : new HttpParams().set('Content-Type', 'multipart/form-data')}
    const formData = new FormData();
    formData.append('elaborato', map.get('img'));
    this.studentService.uploadElaborato( map.get('consegnaId'),formData, options).subscribe( x =>
    {
      this.getElaboratiForStudentAndConsegnaId(map.get('consegnaId'));
    }, error => {
      //Gestione degli errori tramite alert, messaggi generici perché scatenabili per più motivi
      if(error.status === 404){
        alert('Elemento non trovato!');
      }else if(error.status === 400){
        alert('Errore nella richiesta!');
      }else if(error.status === 403){
        alert('Operazione non permessa!');
      }else{ //Errore generico per tutti i casi diversi dai sopra citati
        alert('Errore!');
      }
    })

  }
}
