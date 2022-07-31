import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListEmployee } from 'src/app/consts/list-employee';
import { User } from 'src/app/consts/user';
import { authorized, credential } from 'src/app/lib';
import { ToggleLoading } from 'src/app/shared/loading/toggle-loading';
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
        credential.storage.set('employee', JSON.stringify(ListEmployee));
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
