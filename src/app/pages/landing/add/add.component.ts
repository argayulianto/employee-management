import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { authorized, credential } from 'src/app/lib';
import { ToggleLoading } from 'src/app/shared/loading/toggle-loading';
import { Employee } from 'src/app/shared/model/employee';
import { ListGroup } from 'src/app/shared/model/list-group';
import { ToastNotif } from 'src/app/shared/toast-notification/toast-notif';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  employee: Employee[] = [];
  form!: FormGroup;
  maxDate: Date = new Date();
  listGroup: ListGroup[] = [];
  filteredGroup: any = this.listGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrNotif: ToastNotif,
    private toggleLoading: ToggleLoading
  ) { 
    if(!authorized.check('user')) this.router.navigate(['/login']);
    this.employee = JSON.parse(credential.storage.get('employee'));
  }

  ngOnInit(): void {
    
    this.form = this.formBuilder.group(
      {
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        birthDate: ['', Validators.required],
        basicSalary: ['', [Validators.required, Validators.pattern(/^[0-9]*\.?[0-9]*$/)]],
        status: ['', Validators.required],
        group: ['', Validators.required],
        description: ['', Validators.required]
      },
    );
    
    this.getListGroup();
    
  }

  getListGroup() {
    let listGrp = this.employee.map(e => e.group);
    listGrp.forEach(a => {
      this.listGroup.push(
        {
          value : a,
          view: a
        }
      )
    })
    this.filteredGroup = this.listGroup;
  }


  birthDateEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.controls.birthDate.setValue(new Date(`${type}: ${event.value}`));
  }

  descriptionEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.controls.description.setValue(new Date(`${type}: ${event.value}`));
  }

  cancelClicked() {
    this.router.navigate(['landing/list']);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }else {
      this.toggleLoading.showLoading(true);
      let control = this.form.controls;
      this.employee.push(
        {
          username: control.username.value,
          firstName: control.firstName.value,
          lastName: control.lastName.value,
          email: control.email.value,
          birthDate: control.birthDate.value,
          basicSalary: control.basicSalary.value,
          status: control.status.value,
          group: control.group.value,
          description: control.description.value
        }
      )
      const wait = async () => {
        await this.toastrNotif.toastSuccess("Add Employee");
        this.toggleLoading.showLoading(false);
        credential.storage.set('employee', JSON.stringify(this.employee));
        this.router.navigate(['/landing/list']);
      }
      wait();
    }
  }

}
