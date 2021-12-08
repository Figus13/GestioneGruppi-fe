import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Student} from '../../../models/student.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {CreateTeamDialogComponent} from '../create-team-dialog/create-team-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Course} from '../../../models/course.model';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  @ViewChild("matPaginator") paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Attributi
   */
  studentiSelezionatiPerTeam: SelectionModel<Student>;
  dataSource = new MatTableDataSource<Student>();
  displayedColumns: string[] = ['select', 'id', 'name', 'firstName'];
  _members: Student[];
  course : Course
  noAvailableStudents:  boolean = false;

  /**
   * Input e output
   */

  @Input()
  set _course(course: Course){
    if(course != null){
      this.course = course;
    }
  }

  @Input()
  attesaConferma : boolean;

  @Input()
  set members(students: Student[]) {
    if (students != undefined) {
      if(students.length === 0){ // se non ci sono studenti disponibili setto un flag apposito
         this.noAvailableStudents = true;
      }
      this._members = students;
      this.dataSource = new MatTableDataSource<Student>(students);
      this.studentiSelezionatiPerTeam = new SelectionModel<Student>(true, []);
      this.dataSource.paginator = this.paginator;
    } else {
      this._members = [];
      this.dataSource = new MatTableDataSource<Student>();
      this.studentiSelezionatiPerTeam = new SelectionModel<Student>(true, []);
      this.dataSource.paginator = this.paginator;
    }
  }

  @Output("newGroup")
  newGroupEmitter = new EventEmitter();

  /**
   * Metodo per applicare il filtro inserito nel form
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this._filter(filterValue);
  }

  /**
   * Metodo per filtrare gli studenti in base ai valori inseriti, con distinzione dei vari casi in base ai match trovati
   * @param value
   * @private
   */
  private _filter(value: string): Student[] {
    let filterValues: string[];
    const filterValue = value.toLowerCase();
    filterValues = filterValue.split(' ');
    if (filterValues.length > 3) {
      return [];
    }

    if (filterValues.length === 1) {
      // tslint:disable-next-line:max-line-length
      return this._members.filter(option => (option.name).toLowerCase().includes(filterValues[0]) || option.firstName.toLowerCase().includes(filterValues[0]) || option.id.toLowerCase().includes(filterValues[0]));
    }
    if (filterValues.length === 2) {
      return this._members.filter(option => ((option.name).toLowerCase().includes(filterValues[1]) && option.firstName.toLowerCase().includes(filterValues[0]))
        || ((option.firstName).toLowerCase().includes(filterValues[1]) && option.name.toLowerCase().includes(filterValues[0]))
        || ((option.id).toLowerCase().includes(filterValues[1]) && option.name.toLowerCase().includes(filterValues[0]))
        || ((option.id).toLowerCase().includes(filterValues[1]) && option.firstName.toLowerCase().includes(filterValues[0]))
        || ((option.firstName).toLowerCase().includes(filterValues[1]) && option.id.toLowerCase().includes(filterValues[0]))
        || ((option.name).toLowerCase().includes(filterValues[1]) && option.id.toLowerCase().includes(filterValues[0])));
    }
    if (filterValues.length === 3) {
      return this._members.filter(option => ((option.name).toLowerCase().includes(filterValues[1])
        && option.firstName.toLowerCase().includes(filterValues[2])
        && (option.id).toLowerCase().includes(filterValues[0]))
        || ((option.firstName).toLowerCase().includes(filterValues[1]) && option.name.toLowerCase().includes(filterValues[2])
          && (option.id).toLowerCase().includes(filterValues[0]))
        || ((option.id).toLowerCase().includes(filterValues[1])
          && option.name.toLowerCase().includes(filterValues[2])
          && (option.firstName).toLowerCase().includes(filterValues[0]))
        || ((option.id).toLowerCase().includes(filterValues[1]) && option.firstName.toLowerCase().includes(filterValues[2])
          && (option.name).toLowerCase().includes(filterValues[0]))
        || ((option.firstName).toLowerCase().includes(filterValues[1]) && option.id.toLowerCase().includes(filterValues[2]))
        && (option.name).toLowerCase().includes(filterValues[0])
        || ((option.name).toLowerCase().includes(filterValues[1]) && option.id.toLowerCase().includes(filterValues[2])) && (option.firstName).toLowerCase().includes(filterValues[0]));
    }
  }

  /**
   * Apre la dialog relativa alla creazione di un team con gli studenti selezionati
   */
  creaGruppo() {
    if (!this.studentiSelezionatiPerTeam.isEmpty()) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;

      dialogConfig.data = {students: this.studentiSelezionatiPerTeam.selected};
      const dialogRef = this.dialog.open(CreateTeamDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(x => {
          //Controllo che il numero di studenti sia corretto
          if (x == 'notEnough') {
            alert("Non abbastanza studenti selezionati")
          } else if (x == 'moreThanEnough') {
            alert("Seleziona degli studenti per creare il gruppo");
          } else if (x != null) { //nel caso giusto emetto
            this.newGroupEmitter.emit(x)
            this.studentiSelezionatiPerTeam.clear();
          }
        }
      );
    }
  }

  /**
   * Controllo sulla cardinalità degli studenti selezionati per formare il team
   */
  checkCardinality() {
    if( this.studentiSelezionatiPerTeam.selected.length < this.course.min-1 || this.studentiSelezionatiPerTeam.selected.length > this.course.max-1){
      return true;
    }else{
      return false;
    }
  }
}

