import { Component, OnInit, TemplateRef } from '@angular/core';
import { credential } from 'src/app/lib';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  userProfil: any;
  modalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private router: Router
  ) { 
    if(!credential.storage.get('user')) {
      this.router.navigate(['/login']);
    }else {
      this.userProfil = JSON.parse(credential.storage.get('user'));
    }

  }

  ngOnInit(): void {
  }

  onClickProfil(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onClickLogout() {
    credential.storage.delete();
    this.router.navigate(['/login']);
  }

}
