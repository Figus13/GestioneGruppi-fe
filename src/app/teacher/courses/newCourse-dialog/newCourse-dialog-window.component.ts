import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TeacherService} from '../../../services/teacher.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Course} from '../../../models/course.model';
import {ModelloVM} from '../../../models/modelloVM.model';
import {Parametri} from '../../../models/parametri.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-newcourse-dialog-window',
  templateUrl: 'newCourse-dialog-window.html',
  styleUrls: ['newCourse-dialog-window.css']
})
export class NewCourseDialogWindowComponent implements OnInit {
  enabled: boolean;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // tslint:disable-next-line:max-line-length variable-name
  constructor(private teacherService: TeacherService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<NewCourseDialogWindowComponent>, private router: Router) {
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      nameControl: ['', [Validators.required]],
      acronymControl: ['', [Validators.required]],
      minControl: ['', [Validators.required, Validators.min(0), Validators.pattern]],
      maxControl: ['', [Validators.required, Validators.min(0)]],
      enabledControl: [false]
    });
    this.secondFormGroup = this._formBuilder.group({
      vcpuControl: ['', [Validators.required, Validators.min(0)]],
      diskControl: ['', [Validators.required, Validators.min(0)]],
      ramControl: ['', [Validators.required, Validators.min(0)]],
      vmActiveControl: ['', [Validators.required, Validators.min(0)]],
      vmTotalControl: ['', [Validators.required, Validators.min(0)]]

    });
  }


  getErrorName() {
    if (this.firstFormGroup.controls.nameControl.hasError('required')) {
      return 'Inserire un valore';
    }
  }

  getErrorAcronym() {
    if (this.firstFormGroup.controls.acronymControl.hasError('required')) {
      return 'Inserire un valore';
    }
  }

  getErrorMin() {
    if (this.firstFormGroup.controls.minControl.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.firstFormGroup.controls.minControl.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  getErrorMax() {
    if (this.firstFormGroup.controls.maxControl.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.firstFormGroup.controls.maxControl.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  addNewCourse() {
    if (!this.firstFormGroup.controls.nameControl.hasError('required')
      && !this.firstFormGroup.controls.acronymControl.hasError('required')
      && !this.firstFormGroup.controls.minControl.hasError('required')
      && !this.firstFormGroup.controls.minControl.hasError('min')
      && !this.firstFormGroup.controls.maxControl.hasError('required') && !this.firstFormGroup.controls.maxControl.hasError('min')
      && !this.secondFormGroup.controls.vcpuControl.hasError('required') && !this.secondFormGroup.controls.vcpuControl.hasError('min')
      && !this.secondFormGroup.controls.diskControl.hasError('required') && !this.secondFormGroup.controls.diskControl.hasError('min')
      && !this.secondFormGroup.controls.ramControl.hasError('required') && !this.secondFormGroup.controls.ramControl.hasError('min')
      && !this.secondFormGroup.controls.vmActiveControl.hasError('required') && !this.secondFormGroup.controls.vmActiveControl.hasError('min')
      && !this.secondFormGroup.controls.vmTotalControl.hasError('required') && !this.secondFormGroup.controls.vmTotalControl.hasError('min')
    ) {
      const course = new Course(this.firstFormGroup.controls.nameControl.value,
        this.firstFormGroup.controls.acronymControl.value,
        this.firstFormGroup.controls.minControl.value,
        this.firstFormGroup.controls.maxControl.value,
        this.firstFormGroup.controls.enabledControl.value);
      const model = new ModelloVM(this.secondFormGroup.controls.vcpuControl.value,
        this.secondFormGroup.controls.diskControl.value,
        this.secondFormGroup.controls.ramControl.value,
        this.secondFormGroup.controls.vmActiveControl.value,
        this.secondFormGroup.controls.vmTotalControl.value);
      const parametriDTO = new Parametri(course, model);

      this.dialogRef.close(parametriDTO);
    }
  }

  getErrorVCPU() {
    if (this.secondFormGroup.controls.vcpuControl.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.secondFormGroup.controls.vcpuControl.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  getErrorDisk() {
    if (this.secondFormGroup.controls.diskControl.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.secondFormGroup.controls.diskControl.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  getErrorRam() {
    if (this.secondFormGroup.controls.ramControl.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.secondFormGroup.controls.ramControl.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  getErrorVMTotal() {
    if (this.secondFormGroup.controls.vmTotalControl.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.secondFormGroup.controls.vmTotalControl.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  getErrorVMActive() {
    if (this.secondFormGroup.controls.vmActiveControl.hasError('required')) {
      return 'Inserire un valore';
    } else if (this.secondFormGroup.controls.vmActiveControl.hasError('min')) {
      return 'Inserire valore positivo';
    }
  }

  close() {
    this.dialogRef.close(null);
    this.router.navigate(['/teacher/selectCourse']);
  }

  checkForm() {

    if (this.firstFormGroup.controls.nameControl.valid &&
      this.firstFormGroup.controls.acronymControl.valid &&
      this.firstFormGroup.controls.minControl.valid &&
      this.firstFormGroup.controls.maxControl.valid &&
      this.secondFormGroup.controls.vcpuControl.valid &&
      this.secondFormGroup.controls.diskControl.valid &&
      this.secondFormGroup.controls.ramControl.valid &&
      this.secondFormGroup.controls.vmActiveControl.valid &&
      this.secondFormGroup.controls.vmTotalControl.valid) {
      return false;
    } else {
      return true;
    }

  }
}
