import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { authorized, credential } from 'src/app/lib';
import { Employee } from 'src/app/shared/model/employee';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  employeeList: Employee[] = [];
  employee: Employee | undefined;
  username!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { 
    if(!authorized.check('user')) this.router.navigate(['/login']);
    this.employeeList = JSON.parse(credential.storage.get('employee'));
    this.username = this.route.snapshot.params['usr'];
  }

  ngOnInit(): void {
    this.employee = this.employeeList.find(e => e.username === this.username);
  }

  goBack() {
    this.router.navigate(['/landing/list']);
  }

}
