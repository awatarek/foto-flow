import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Photo } from 'src/app/shared/model/photo.model';
import { PosibleTags } from 'src/app/shared/model/posibleTags.model';
import { Tag } from 'src/app/shared/model/tag.model';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-catalog-photo-panel',
  templateUrl: './catalog-photo-panel.component.html',
  styleUrls: ['./catalog-photo-panel.component.scss']
})
export class CatalogPhotoPanelComponent implements OnInit {
  public photos: Photo[] = [];
  public photosWithSort: Photo[] = [];
  public photosWithFiltr: Photo[] = [];
  public choosedPhotos: Photo[] = [];
  public itemDetail: Photo;
  public catalogId = "";
  public first = 0;
  public rows = 10;
  public tags: any;
  public possibleTags;
  
  public displayDialog: boolean = false;
  public detailForm: FormGroup;
  public formTags: PosibleTags;
  public options: any;


  public _selectedColumns: any[];
  public cols = [
    {field: "name", header:"Nazwa"},
    {field: "tags", header:"Tagi"},
    {field: "location", header:"Lokalizacja"},
    {field: "author", header:"Autor"},
    {field: "upload_day", header:"Data wysłania"},
    {field: "accepted", header:"Zaakceptowane"},
    {field: "visible", header:"Widoczne"},
  ]


  @ViewChild('tableElement') tableElement;

  ngAfterViewInit() {
      this.tableElement.onSort.subscribe(data => {
        this.photosWithSort = this.tableElement.value;
        this.paginate({first: 0, rows: this.rows})
      });
  }

  constructor(private cs: CatalogsService, private router: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.catalogId = this.router.snapshot.params.id;
    this.possibleTags =  await this.cs.getTags();
    console.log(this.catalogId);

    if(this.catalogId == "0"){
      this.photos = await this.cs.getAllPhotos();
    } else if(this.catalogId == "tags"){
      this.photos = await this.cs.getPhotoWithNoTags();
    } else {
      this.photos = await this.cs.getPhotosFromCatalog(parseInt(this.catalogId));
    }

    this.photosWithSort = this.photos;
    this.photosWithFiltr = this.photos;
    await this.paginate({first: this.first, rows: this.rows});
    this._selectedColumns = [
      {field: "name", header:"Nazwa"},
      {field: "location", header:"Lokalizacja"},
      {field: "author", header:"Autor"},
      {field: "upload_day", header:"Data wysłania"},
    ]
  }

  public getClass(element: boolean){
    if(element) return "true";
    return "false";
  }

  public async showDialog(photo: Photo) {
    this.itemDetail = photo;
    let tags = await this.cs.getTags();
    this.formTags = {eve: [], bra: [], inv: []};

    for(const [key, item] of Object.entries(tags)){
      if(item.type == 0){
        this.formTags.eve.push({label: item.label, data: item.data});
      } else if(item.type == 1){
        this.formTags.bra.push({label: item.label, data: item.data});
      } else {
        this.formTags.inv.push({label: item.label, data: item.data});
      }
    }

    this.options = [
      {
        "label": "Wydarzenie",
        "data": "wydarzenie",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": this.formTags.eve
      },
      {
        "label": "Gałąź",
        "data": "Galaz",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": this.formTags.bra
      },
      {
        "label": "Okoliczności",
        "data": "Okolicznosci",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": this.formTags.inv
      },
    ]

    this.detailForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      tags: new FormControl(''),
      location: new FormControl(''),
      author: new FormControl(''),
      upload_day: new FormControl(''),
      catalogs_id: new FormControl(''),
      accepted: new FormControl(''),
      visible: new FormControl(''),
    });

    let choosedOptions = [];

    if(this.itemDetail.tags){
      let arrayTags = this.itemDetail.tags.split(",");

      for(let tag3 of arrayTags){
        for(let item of this.options){
          for(let item2 of item.children){
            if(item2.data == tag3){
              choosedOptions.push(item2);
              break;
            }
          }
        }
      }
    }

    this.detailForm.controls['name'].disable();
    this.detailForm.setValue(photo);
    this.detailForm.controls['tags'].setValue(choosedOptions);
    if(this.itemDetail.accepted){
      this.detailForm.controls['accepted'].setValue(true);
    } else {
      this.detailForm.controls['accepted'].setValue(false);
    }

    if(this.itemDetail.visible){
      this.detailForm.controls['visible'].setValue(true);
    } else {
      this.detailForm.controls['visible'].setValue(false);
    }

    this.displayDialog = true;


    let data = await this.cs.getPhoto(photo.id);
    let url = URL.createObjectURL(data);
    let image = document.querySelector("img#image");
    image.setAttribute("src", url)
  }

  public async paginate(event){
    this.first = event.first;
    this.rows = event.rows;

    let photosList: Photo[] = [];

    for(let item of this.photosWithFiltr){
      for(let item2 of this.photosWithSort){
        if(item.id == item2.id){
          photosList.push(item);
          break;
        }
      }
    }

    let maxPhoto = event.first+event.rows;
    if(maxPhoto > photosList.length) maxPhoto = photosList.length;
    

    for(let i = event.first; i < maxPhoto; i++){
      let photo: Photo = photosList[i];
      let data = await this.cs.getMiniPhoto(photo.id);

      let url = URL.createObjectURL(data);
      let image = document.querySelector("img.image-"+photo.id);
      image.setAttribute("src", url)
    }
  }

  public async showPhoto(id: number){
    let data = await this.cs.getPhoto(id);
    let url = URL.createObjectURL(data);
    let image = document.querySelector("img.p-image-preview");
    image.setAttribute("src", url)
  }

  public async acceptPhoto(){
    this.cs.setAcceptedPhoto(this.itemDetail.id, true);
  }

  public async visiblePhoto(){
    this.cs.setVisiblePhoto(this.itemDetail.id, true);    
  }

  public async removePhoto(item: Photo){
    this.cs.removePhoto(item.name, item.catalogs_id, item.id);

  }

  public async removePhotoChoosen(){
    for(let item of this.choosedPhotos){
      this.cs.removePhoto(item.name, item.catalogs_id, item.id);
    }
  }

  public async acceptPhotoChoosen(){
    for(let item of this.choosedPhotos){
      this.cs.setAcceptedPhoto(item.id, true);
    }
  }

  public async visiblePhotoChoosen(){
    for(let item of this.choosedPhotos){
      this.cs.setVisiblePhoto(item.id, true);
    }
  }

  public filterEvent(event){
    this.photosWithFiltr = event.filteredValue;
    this.paginate({first: 0, rows: this.rows})
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
      this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  public test(){
    console.log(this.detailForm.value.tags)
  }

  public async sendChange(){
    let photo: Photo = this.detailForm.value;

    let tag1: string = "";

    let tags = this.detailForm.controls['tags'].value;

    for(let tag of tags){
      if(Number.isInteger(tag.data)){
        tag1+=""+tag.data+",";
      }
    }

    if(tag1.endsWith(",")){
      tag1 = tag1.slice(0, -1);
    }

    photo.tags = tag1;
    this.displayDialog = false;
    for(let photo2 of this.photos){
      if(photo2.id == this.itemDetail.id){
        photo2 = photo;
        break;
      }
    }
    await this.cs.editPhoto(photo);
  }

  public getColumnData(col, photo: Photo){
    if(col.field == "upload_day"){
      let date = new Date(photo[col.field]);
      return date.toISOString().split('T')[0];
    } else if(col.field == "tags"){
      if(photo.tags != null){
        let tag = photo[col.field];
        let tags = tag.split(",");
        console.log(tags)
        let tagString = "";
        for(let tag1 of tags){
          for(let tag2 of this.possibleTags){
            if(tag2.data == tag1){
              tagString+= " "+tag2.label+",";
            }
          }
        }

        if(tagString.endsWith(",")) tagString = tagString.slice(0, -1);
        return tagString;
      } else {
        return "";
      }
    } else if(col.field == "visible" || col.field == "accepted"){
      console.log(col, photo)
      return photo[col.field] ? true : false;
    } else{
      return photo[col.field];
    }
  }

  public getHeader(){
    if(this.catalogId == "0"){
      return "Wszystkie zdjęcia";
    } else if(this.catalogId == "tags"){
      return "Zdjęcia bez tagów";
    } else {
      return "Zdjęcia w galeri";
    }
  }
}

