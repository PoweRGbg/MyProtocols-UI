import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'latest-changes',
  templateUrl: './latest-changes.component.html',
  styleUrls: ['./latest-changes.component.scss']
})
export class LastChangesComponent implements OnInit {

  changesMarkdown = '';
  lastReadDate = new Date();
  protected hideChanges = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('assets/CHANGES.md', { responseType: 'text' })
        .subscribe(markdown => {
        this.changesMarkdown = markdown;
      });
  }

  markChangesAsRead(): void {
    this.lastReadDate = new Date();
    this.hideChanges = true;
    
    localStorage.setItem('lastReadDate', this.lastReadDate.toString());
  }

  isNewChanges(): boolean {
      const lastReadDate = localStorage.getItem('lastReadDate');
      console.log('lastReadDate', lastReadDate);
      
    if (lastReadDate) {
      const lastReadDateObj = new Date(lastReadDate);
        const changesDate = new Date(this.changesMarkdown.split('\n')[0].replace('## ', '').trim());
        console.log('changesDate', changesDate);
        
      return changesDate > lastReadDateObj;
    }
    return true;
  }

}