import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ListEmployee } from 'src/app/consts/list-employee';
import { authorized, credential } from 'src/app/lib';
import { ToggleLoading } from 'src/app/shared/loading/toggle-loading';
import { Employee } from 'src/app/shared/model/employee';
import { ToastNotif } from 'src/app/shared/toast-notification/toast-notif';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit {

  overflow: boolean = false;
  math = Math;
  listEmployee: Employee[] = [];

  // table
  displayedColumns: string[] = [
    'username', 
    'firstName', 
    'lastName', 
    'email', 
    'birthDate', 
    'basicSalary', 
    'status', 
    'group', 
    'description', 
    'action'];
  dataSource!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private toastrNotif: ToastNotif,
    private toggleLoading: ToggleLoading
  ) { 
    this.detectScreenSize();
    this.getListEmployee();
  }

  getListEmployee() {
    this.listEmployee = JSON.parse(credential.storage.get('employee'));
    this.dataSource = new MatTableDataSource(this.listEmployee);
  }

  ngOnInit(): void {

  }

  detectScreenSize() {
    this.breakpointObserver.observe([
        "(max-width: 1220px)"
      ]).subscribe((result: BreakpointState) => {
        if (result.matches) {
            this.overflow = false;
        } else {
            this.overflow = true;
        }
      });
  }

  addClicked() {
    this.router.navigate(['landing/add']);
  }

  detailClicked(data: any) {
    this.router.navigate([`/landing/detail/${data.username}`]);
  }

  editClicked(data: any) {
    Swal.fire({
      width: 300,
      text: `Want to edit ${data.firstName} ?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#fcf45d',
      cancelButtonColor: '#696969',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Edit',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed == true) {
        this.router.navigate([`/landing/edit/${data.username}`]);
      }
    })
  }

  deleteClicked(data: any) {
    Swal.fire({
      title: 'Sure ?',
      width: 300,
      text: `${data.firstName} will remove from the list`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff686b',
      cancelButtonColor: '#696969',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed == true) {
        this.toggleLoading.showLoading(true);
        this.listEmployee.splice(this.listEmployee.findIndex(e => e.username === data.username), 1);
        credential.storage.set('employee', JSON.stringify(this.listEmployee));
        const wait = async () => {
          await this.toastrNotif.toastSuccess("Delete");
          this.getListEmployee();
          this.ngAfterViewInit();
          this.toggleLoading.showLoading(false);
        }
        wait();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
