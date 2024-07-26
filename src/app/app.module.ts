import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { registerLocaleData } from '@angular/common';

import localeBg from '@angular/common/locales/bg';
import { JwtModule } from '@auth0/angular-jwt';
import { MAT_DATE_LOCALE } from '@angular/material/core';

// specify the key where the token is stored in the local storage
export const LOCALSTORAGE_TOKEN_KEY = 'myprotocols-token';

// specify tokenGetter for the angular jwt package
export function tokenGetter() {
    return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        // Import our Routes for this module
        AppRoutingModule,
        // Angular Material Imports
        MatSnackBarModule,
        // Jwt Helper Module Import
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ['localhost:3000', 'localhost:8080', 'protocols.nightscout.bg'],
            }
        })
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'bg' },
        { provide: MAT_DATE_LOCALE, useValue: 'bg-BG' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }