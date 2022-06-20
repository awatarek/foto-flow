import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public isCatalog: boolean = false;
  public isAdd: boolean = false;
  public catalogId: string = "";

  constructor(private router: Router) {
    router.events.subscribe((val) =>{
      if(val instanceof NavigationEnd){
        if(!val.url.indexOf("/catalog/")){
          this.isCatalog = true;
          this.isAdd = false;
          let url = val.url.split("/");
          this.catalogId = url[url.length - 1];
        } else if(!val.url.indexOf("/add-")){
          this.isAdd = true;
          this.isCatalog = false;
        }else {
          this.isCatalog = false;
          this.isAdd = false;
        }
      }
    })
   }

  ngOnInit(): void {
  }
}
