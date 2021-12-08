import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Student} from '../../models/student.model';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Course} from '../../models/course.model';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit , AfterViewInit{

  /**
   * Attributi
   */
  _notEnrolledStudents: Student[];
  dataSource = new MatTableDataSource<Student>();
  displayedColumns: string[] = ['select', 'id', 'name', 'firstName', 'teamName'];
  studentiSelezionatiPerPagina: SelectionModel<Student>;
  totaleStudentiSelezionati: SelectionModel<Student>;
  myControl = new FormControl();
  newStudent: Student;
  filteredOptions: Observable<Student[]>;
  selezionaTuttiGliStudenti: boolean;
  tuttiSelezionati: boolean;
  start: number;
  end: number;
  _enrolledStudents : Student[];
  formGroup: FormGroup;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('studentInput') studentInput: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('fileCSV') fileCSV : ElementRef;



  /**
   * Input e output
   */
  @Input()
  set notEnrolledStudents(students: Student[]){
    if(students != null) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this._notEnrolledStudents = students.slice();
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value.toString()))
        );
    }else{
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this._notEnrolledStudents = [];
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }
  }

  @Input() set enrolledStudents(students: Student[]){
    if( students != null){
      this._enrolledStudents = students.slice();
      this.dataSource = new MatTableDataSource<Student>(students);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }else{
      this._enrolledStudents = [];
      this.dataSource = new MatTableDataSource<Student>(students);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    this.selezionaTuttiGliStudenti = false;
    this.tuttiSelezionati = false;
    this.studentiSelezionatiPerPagina = new SelectionModel<Student>(true, []);
    this.totaleStudentiSelezionati = new SelectionModel<Student>(true, []);

  }
  @Input()
  course: Course;

  // tslint:disable-next-line:no-output-rename
  @Output('add')
  addStudentEmitter = new EventEmitter();
  // tslint:disable-next-line:no-output-rename
  @Output('remove')
  removeStudentsEmitter = new EventEmitter();

  @Output('upload')
  enrollStudentCSV = new EventEmitter();


  constructor(public fb: FormBuilder, private router: Router) {
  }

  /*
     Le variabili start e end vengono settati appena la vista viene creata,
     saranno necessari per identificare gli oggeti presentati nella tabella che fanno parte del vettore this.datasource.data
   */

  ngAfterViewInit(): void {
    this.start = this.paginator.pageIndex * this.paginator.pageSize;
    this.end = this.start + this.paginator.pageSize;
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({csv: ['', Validators.required]});
  }

  /**
   * Indica gli indici degli oggetti presentati nella tabella
   * alla pagine corrente all'interno del vettore this.datasource.data
   */
  aggiornaIndici(){
    //start è dato dal numero della pagina per il numero di elementi all'interno della pagina
    this.start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
    if (!this.dataSource.paginator.hasNextPage()) {
      this.end = this.dataSource.paginator.length;
    }else{
      this.end = this.start + this.dataSource.paginator.pageSize;
    }
  }

  /**
   * Funzione chiamata ogni qual volta c'è un evento che riguarda la pagina,
   * modifica del pageSize o cambio di pagina di visualizzazione della tabella
   */
  modifyCheckbox() {
    this.aggiornaIndici();
    // Da rimuovere se vogliamo che la selezione rimanga anche cambiando pagina
    if (this.tuttiSelezionati){
      this.totaleStudentiSelezionati.clear();
      this.studentiSelezionatiPerPagina.clear();
      this.tuttiSelezionati = false;
    }

    this.studentiSelezionatiPerPagina.selected.forEach(x => this.totaleStudentiSelezionati.select(x));
    this.studentiSelezionatiPerPagina.clear();

    this.dataSource.data.slice(this.start, this.end).forEach(x => {
      if (this.totaleStudentiSelezionati.selected.includes(x)){
        this.studentiSelezionatiPerPagina.select(x);
      }
    });
    this.selezionaTuttiGliStudenti = false;
   }

  /**
   * Controlla se il numero di elementi selezionati combacia con il numero di righe totali
   */
  isAllSelected() {
    if (this.tuttiSelezionati){
      return true;
    }else {
      let numSelected = this.studentiSelezionatiPerPagina.selected.length; // numero di oggetti selezionati nella tabella
      let page = this.dataSource.paginator.pageSize; // numero di oggetti per pagina nella tabella
      /*
       Se la tabella non ha una pagina successiva il numero di oggetti per pagina viene calcolato come
       Numero Totale di oggetti nell'array - (l'indice della pagina per il numero di oggetti per pagina)
       */
      if (!this.dataSource.paginator.hasNextPage()) {
        page = this.dataSource.paginator.length - (this.dataSource.paginator.pageIndex * page)
      }

      return numSelected === page;
    }
  }


  /**
   * Seleziona tutte le righe se non sono tutte selezionate, altrimenti cancella la selezione
   * */
  masterToggle() {
    this.selezionaTuttiGliStudenti = true;
    this.isAllSelected() ?
      this.selectClear():(
      this.dataSource.data.slice(this.start,this.end).forEach(row => {this.studentiSelezionatiPerPagina.select(row); this.totaleStudentiSelezionati.select(row)})
      )
  }

  /**
   * Seleziona tutte le righe
   */
  selectAll(){
    this.dataSource.data.forEach(row => this.totaleStudentiSelezionati.select(row));
    this.dataSource.data.slice(this.start,this.end).forEach(row => {this.studentiSelezionatiPerPagina.select(row);})
    this.tuttiSelezionati = true;
  }

  /**
   * Cancella la selezione dalle righe selezionate
   */
  selectClear(){
    this.selezionaTuttiGliStudenti = false;
    this.studentiSelezionatiPerPagina.selected.forEach(x => this.totaleStudentiSelezionati.deselect(x));
    this.studentiSelezionatiPerPagina.clear();
  }

  /**
   * Assegna lo studente selezionato a newStudent che sarà usato per iscrivere lo studente al corso
   * @param s
   */
  getOptionStudent(s: Student) {
    this.newStudent = s;
  }

  /**
   * Iscrive studente al corso
   */
  addStudent() {
    if (this.newStudent != undefined && Student.equals(this.newStudent, this.myControl.value)) {
      if (!this.dataSource.data.some(student => student.id === this.newStudent.id)) {
        this.addStudentEmitter.emit(this.newStudent);
        this.dataSource = new MatTableDataSource<Student>(this.dataSource.data);
        this.studentInput.nativeElement.value = '';
      }
    }
  }

  /**
   * Metodo per eliminare gli studenti selezionati scatenando un evento al container,
   * pulisce poi la variabile che conteneva i selezionati
   */
  deleteSelected() {
    this.removeStudentsEmitter.emit(this.totaleStudentiSelezionati.selected);
    this.studentiSelezionatiPerPagina.clear();
    this.totaleStudentiSelezionati.clear();
  }

  /**
   * Mostra i dati di uno studente o nulla se non ce ne sono
   * @param student
   */
  displayFn(student: Student): string {
    return student && student.name ? student.name + ' ' + student.firstName + ' ' + student.id : '';
  }

  /**
   * Effettua il filtro degli studenti in base alla stringa inserita e ai valori ritornati nel filtro
   * @param value
   * @private
   */
  private _filter(value: string): Student[] {
    let filterValues: string[];
    const filterValue = value.toLowerCase();
    filterValues = filterValue.split(' ');
    if ( filterValues.length > 3 ) { return []; }

    if (filterValues.length === 1) {
      // tslint:disable-next-line:max-line-length
      return this._notEnrolledStudents.filter(option => (option.name).toLowerCase().includes(filterValues[0]) || option.firstName.toLowerCase().includes(filterValues[0]) || option.id.toLowerCase().includes(filterValues[0]));
    }
    if ( filterValues.length === 2 ) {
      return this._notEnrolledStudents.filter(option =>  ((option.name).toLowerCase().includes(filterValues[1]) && option.firstName.toLowerCase().includes(filterValues[0]))
        ||  ((option.firstName).toLowerCase().includes(filterValues[1]) && option.name.toLowerCase().includes(filterValues[0]))
        ||  ((option.id).toLowerCase().includes(filterValues[1]) && option.name.toLowerCase().includes(filterValues[0]))
        ||  ((option.id).toLowerCase().includes(filterValues[1]) && option.firstName.toLowerCase().includes(filterValues[0]))
        ||  ((option.firstName).toLowerCase().includes(filterValues[1]) && option.id.toLowerCase().includes(filterValues[0]))
        ||  ((option.name).toLowerCase().includes(filterValues[1]) && option.id.toLowerCase().includes(filterValues[0])));
    }
    if ( filterValues.length === 3 ) {
      return this._notEnrolledStudents.filter(option => ((option.name).toLowerCase().includes(filterValues[1])
        && option.firstName.toLowerCase().includes(filterValues[2])
        && (option.id).toLowerCase().includes(filterValues[0]))
        ||  ((option.firstName).toLowerCase().includes(filterValues[1]) && option.name.toLowerCase().includes(filterValues[2])
          && (option.id).toLowerCase().includes(filterValues[0]))
        ||  ((option.id).toLowerCase().includes(filterValues[1])
          && option.name.toLowerCase().includes(filterValues[2])
          && (option.firstName).toLowerCase().includes(filterValues[0]))
        ||  ((option.id).toLowerCase().includes(filterValues[1]) && option.firstName.toLowerCase().includes(filterValues[2])
          && (option.name).toLowerCase().includes(filterValues[0]))
        ||  ((option.firstName).toLowerCase().includes(filterValues[1]) && option.id.toLowerCase().includes(filterValues[2]))
        && (option.name).toLowerCase().includes(filterValues[0])
        ||  ((option.name).toLowerCase().includes(filterValues[1]) && option.id.toLowerCase().includes(filterValues[2]))  && (option.firstName).toLowerCase().includes(filterValues[0]));
    }
  }

  /**
   * Inserisce nel formGroup il file caricato
   * @param fileInput
   */
  processaFile(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      const file = fileInput.target.files[0];
      this.formGroup.get('csv').setValue(file);
    }
  }

  /**
   * Deseleziona tutte le righe
   */
  deSelectAll() {
    this.studentiSelezionatiPerPagina.clear();
    this.totaleStudentiSelezionati.clear();
    this.selezionaTuttiGliStudenti = false;
    this.tuttiSelezionati = false;
  }

  /**
   * Controlla se gli studenti sono tutti selezionati
   */
  checkStatus(row) {

    if(this.studentiSelezionatiPerPagina.isSelected(row)){
      this.totaleStudentiSelezionati.select(row);
    }else{
      this.totaleStudentiSelezionati.deselect(row)
    }

    if(this.paginator.length != this.totaleStudentiSelezionati.selected.length) {
      this.selezionaTuttiGliStudenti = false;
      this.tuttiSelezionati = false;
    }



  }

  /**
   * Scatena un evento passando il file CSV salvato precedentemente
   */
  upload() {
    const uploadedFile = new FormData();
    const file = this.formGroup.get('csv').value;
    uploadedFile.append( 'file', file);
    this.enrollStudentCSV.emit( uploadedFile);
    this.fileCSV.nativeElement.value = null;
  }

  studentiSelezionati() {
    return this.studentiSelezionatiPerPagina.isEmpty();
  }

}
