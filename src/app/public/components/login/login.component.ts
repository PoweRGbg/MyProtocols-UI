import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { VersionService } from '../../services/version.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required]),
    });
    protected version: string | undefined;

    constructor(
        private authService: AuthService,
        private versionService: VersionService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.versionService.getVersion().subscribe(version => {
            this.version = version;
        });
    }

    login() {
        if (!this.loginForm.valid) {
            return;
        }
        this.authService.login(this.loginForm.value).pipe(
            // route to protected/dashboard, if login was successfull
            tap(() => {
                this.router.navigate(['../../protected/dashboard'])
            })
        ).subscribe();
    }

}
