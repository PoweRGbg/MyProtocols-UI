import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
    private versionUrl = 'VERSION'; // Adjust the path if necessary

    constructor(private http: HttpClient) {}

        getVersion(): Observable<string> {
            return this.http.get<string>(this.versionUrl).pipe(
                map((response) => response)
        );
    }
}