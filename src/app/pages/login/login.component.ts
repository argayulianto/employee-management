import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createRandomEmployee } from 'src/app/consts/fake-data';
import { User } from 'src/app/consts/user';
import { authorized, credential } from 'src/app/lib';
import { ToggleLoading } from 'src/app/shared/loading/toggle-loading';
import { Employee } from 'src/app/shared/model/employee';
import { ToastNotif } from 'src/app/shared/toast-notification/toast-notif';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  todayDate: Date = new Date();
  hide: boolean = true;
  form!: FormGroup;
  fakeEmployee: Employee[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastrNotif: ToastNotif,
    private toggleLoading: ToggleLoading,
    private router: Router
  ) { 
    if(authorized.check('user')) this.router.navigate(['/landing']);
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      },
    );


  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }else {
      this.toggleLoading.showLoading(true);
      let check = this.form.value.username == User.username && this.form.value.password == User.password;
      if( check ) {
        credential.storage.set('user', JSON.stringify(User));
        Array.from({length: 101}).forEach(() => {this.fakeEmployee.push(createRandomEmployee())});
        credential.storage.set('employee', JSON.stringify(this.fakeEmployee));
        const wait = async () => {
          await this.toastrNotif.toastSuccess("Login");
          this.toggleLoading.showLoading(false);
          this.router.navigate(['/landing']);
        }
        wait();
      }else {
        const wait = async () => {
          await this.toastrNotif.toastError("Login");
          this.toggleLoading.showLoading(false);
        }
        wait();
      }
    }
  }


}
