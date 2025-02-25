import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { PosibleTags } from '../shared/model/posibleTags.model';
import { CatalogsService } from '../shared/service/catalogs.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public isCatalog: boolean = false;
  public isAdd: boolean = false;
  public catalogId: string = "";
  public displaySideMenu: boolean = false;
  public displaySearchMenu: boolean = false;
  public isMobile: boolean = false;
  public form: FormGroup;
  protected formBuilder: FormBuilder;
  public searchItems: any;
  public posibleTask: PosibleTags;
  public tagSelected: any;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth < 900;
  }


  constructor(private router: Router, private http: HttpClient, private catalogService: CatalogsService) {
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

  async ngOnInit(): Promise<void> {
    this.isMobile = window.innerWidth < 900;
    this.form = new FormGroup({
      name: new FormControl(''),
      location: new FormControl(''),
      tags: new FormControl(''),
      author: new FormControl('')
    });
    this.posibleTask = {eve: [], inv: [], bra: []}

    let tags = await this.catalogService.getTags();

    if(tags != null){
      for(const [key, item] of Object.entries(tags)){
        if(item.type == 0){
          this.posibleTask.eve.push({label: item.label, data: item.data});
        } else if(item.type == 1){
          this.posibleTask.bra.push({label: item.label, data: item.data});
        } else {
          this.posibleTask.inv.push({label: item.label, data: item.data});
        }
      }
    }



    this.searchItems = [
      {
        "label": "Wydarzenie",
        "data": "wydarzenie",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": this.posibleTask.eve
      },
      {
        "label": "Gałąź",
        "data": "Galaz",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": this.posibleTask.bra
      },
      {
        "label": "Okoliczności",
        "data": "Okolicznosci",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": this.posibleTask.inv
      },
    ]
  }

  public searchPhotos(){
    let val = this.form.value;
    let tags = "";
    for(let item of val.tags){
      if(!isNaN(item.data)) tags+=item.data+",";
    }
    tags = tags.slice(0, -1);
    let data = {name: val.name, location: val.location, author: val.author, tags: tags};
    this.router.navigate(['/search', data]);
  }
}

