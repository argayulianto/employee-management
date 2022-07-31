import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupList } from 'src/app/consts/group-list';
import { authorized, credential } from 'src/app/lib';
import { ToggleLoading } from 'src/app/shared/loading/toggle-loading';
import { Employee } from 'src/app/shared/model/employee';
import { ListGroup } from 'src/app/shared/model/list-group';
import { ToastNotif } from 'src/app/shared/toast-notification/toast-notif';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form!: FormGroup;
  maxDate: Date = new Date();
  listGroup: ListGroup[] = [];
  filteredGroup: any = this.listGroup;

  employeeList: Employee[] = [];
  employee: Employee | undefined;
  username!: string;
  getIndex: any;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private toastrNotif: ToastNotif,
    private toggleLoading: ToggleLoading
  ) { 
    if(!authorized.check('user')) this.router.navigate(['/login']);
    this.employeeList = JSON.parse(credential.storage.get('employee'));
    this.username = this.route.snapshot.params['usr'];
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

    this.listGroup = GroupList;
    this.filteredGroup = this.listGroup;

    let control: any = this.form.controls;
    this.getIndex = this.employeeList.findIndex((e => e.username === this.username));
    this.employee = this.employeeList[this.getIndex];
    
    control.username.setValue(this.employee.username);
    control.firstName.setValue(this.employee.firstName);
    control.lastName.setValue(this.employee.lastName);
    control.email.setValue(this.employee.email);
    control.birthDate.setValue(this.employee.birthDate);
    control.basicSalary.setValue(this.employee.basicSalary);
    control.status.setValue(this.employee.status);
    control.group.setValue(this.employee.group);
    control.description.setValue(this.employee.description);
    
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
      this.employeeList[this.getIndex].username = control.username.value;
      this.employeeList[this.getIndex].firstName = control.firstName.value;
      this.employeeList[this.getIndex].lastName = control.lastName.value;
      this.employeeList[this.getIndex].email = control.email.value;
      this.employeeList[this.getIndex].birthDate = control.birthDate.value;
      this.employeeList[this.getIndex].basicSalary = control.basicSalary.value;
      this.employeeList[this.getIndex].status = control.status.value;
      this.employeeList[this.getIndex].group = control.group.value;
      this.employeeList[this.getIndex].description = control.description.value;
      const wait = async () => {
        await this.toastrNotif.toastSuccess("Edit Employee");
        this.toggleLoading.showLoading(false);
        credential.storage.set('employee', JSON.stringify(this.employeeList));
        this.router.navigate(['/landing/list']);
      }
      wait();
    }
  }

}
