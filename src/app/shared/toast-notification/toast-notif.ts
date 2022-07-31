import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})

export class ToastNotif {

    isDesktop: boolean = false;
    positionToast: string = '';

    constructor(
        private breakpointObserver: BreakpointObserver, 
        private toastr: ToastrService
    ) {
        this.breakpointObserver.observe([
            "(max-width: 992px)"
          ]).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.isDesktop = false;
            } else {
                this.isDesktop = true;
            }
          });
        
        this.isDesktop == false ? this.positionToast = 'toast-top-center' : this.positionToast = 'toast-top-right';
    }

    toastSuccess(message: string) {

        return new Promise<void>((resolve, reject) => {

            this.toastr.success(
                `${message} Success`,
                'Success',
                {
                timeOut: 1500,
                positionClass: `${this.positionToast}`,
                enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if(shouldResolve) {
                    resolve();
                }else {
                    reject("Error : something went wrong!");
                }
            }, 1500);
        })
    }

    toastError(message: string) {

        return new Promise<void>((resolve, reject) => {

            this.toastr.error(
                `Process ${message} failed`,
                'Whoops!..',
                {
                timeOut: 1500,
                positionClass: `${this.positionToast}`,
                enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if(shouldResolve) {
                    resolve();
                }else {
                    reject("Error : something went wrong!");
                }
            }, 1500);
        })
    }
}
