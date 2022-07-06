import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ɵbypassSanitizationTrustUrl } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Catalog } from 'src/app/shared/model/catalog.model';
import { Photo } from 'src/app/shared/model/photo.model';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  public catalogId: number = 0;
  public catalogInfo: Catalog;
  public photos: Photo[] = [];
  public image: {id: number, blob: Blob}[] = [];
  public downloadMultiple: boolean = false;
  public fileToDownload: Photo[] = [];

  public downloadInProgress: boolean = false;

  private numberOfPhotos = 25;
  public visiblePhoto: Photo[] = [];
  public page: number = 0;
  public pageArray: number[] = [];
  public numberOfPages: number = 1;

  /*Dialog variables*/
  public display: boolean = false;
  public photoDetail: Photo;
  public isLoading: boolean = true;
  public tags: any[] = [];
  public posibleTags: any[] = [];
  public lastPhoto: Photo;
  public nextPhoto: Photo;
  public imageUrl: SafeUrl;


  constructor(private router: ActivatedRoute, private http: HttpClient, 
    private catalogsService: CatalogsService,
    private sanitizer: DomSanitizer) { }

  async ngOnInit(): Promise<void> {
    this.catalogId = parseInt(this.router.snapshot.paramMap.get("id"));
    this.catalogInfo = await this.catalogsService.getCatalogDetails(this.catalogId);
    this.photos = await this.catalogsService.getPhotosFromCatalog(this.catalogId);
    this.posibleTags = await this.catalogsService.getTags();

    this.numberOfPages = Math.ceil(this.photos.length / this.numberOfPhotos);
    for(let i = 0; i< this.numberOfPages; i++){
      this.pageArray.push((i+1));
    }

    let maxPhoto = this.page*this.numberOfPhotos+this.numberOfPhotos;
    if(maxPhoto > this.photos.length) maxPhoto = this.photos.length;

    for(let i = (this.page*this.numberOfPhotos); i < maxPhoto; i++){
      this.visiblePhoto.push(this.photos[i]);
      
      let data = await this.catalogsService.getMiniPhoto(this.photos[i].id);
      this.image.push({id: this.photos[i].id, blob: data});

      let url = URL.createObjectURL(data);
      let image = document.querySelector("img#image-"+this.photos[i].id);
      image.setAttribute("src", url)
    }
  }

  public chooseMultipleFile(){
    this.fileToDownload = [];
    this.downloadMultiple = !this.downloadMultiple;
  }

  public async downloadMultipleFile(){
    let blob: Blob = null;

    this.downloadInProgress = true;

    if(this.fileToDownload.length > 0){
      let download = await this.catalogsService.downloadMultiplePhoto(this.fileToDownload, this.catalogId);

      download.subscribe(
        (event)=>{
            if(event.type == 4){
              blob=event.body;
              this.download(blob);
            }
        }
      );
    } else {
      let download = await this.catalogsService.downloadMultiplePhoto([], this.catalogId);
      download.subscribe(
        (event)=>{
            if(event.type == 4){
              blob=event.body;
              this.download(blob);
            }
        }
      );
    }
  }

  private download(blob: Blob){
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "foto-flow.zip";
    link.click();
    this.fileToDownload = [];
    this.downloadMultiple = false;

    this.downloadInProgress = false;
  }

  public addToMany(id){
    if(!this.downloadMultiple) return;
    let photo = null;
    for(let item of this.photos){
      if(item.id == id){
        photo = item;
      }
    }

    let existsInArray = false;

    for(let item of this.fileToDownload){
      if(item.id == id){
        existsInArray = true;
      }
    }


    if(this.fileToDownload.length == 0 || !existsInArray){
      this.fileToDownload.push(photo);
    } else {
      let photoArray: Photo[] = [];
      this.fileToDownload.forEach((val)=>{
        if(val.id != id){
          photoArray.push(val);
        }
      })

      this.fileToDownload = photoArray;
    }
  }

  public classIsActive(id: number){
    if(!this.downloadMultiple) return "";
    for(let item of this.fileToDownload){
      if(item.id == id){
        return "item-active"
      }
    }
    return "";
  }

  public async setPage(page: number){
    this.visiblePhoto = [];
    this.page = page - 1;


    let maxPhoto = this.page*this.numberOfPhotos+this.numberOfPhotos;
    if(maxPhoto > this.photos.length) maxPhoto = this.photos.length;

    for(let i = (this.page*this.numberOfPhotos); i < maxPhoto; i++){
      this.visiblePhoto.push(this.photos[i]);
      let data = await this.catalogsService.getMiniPhoto(this.photos[i].id);
      this.image.push({id: this.photos[i].id, blob: data});

      let url = URL.createObjectURL(data);
      let image = document.querySelector("img#image-"+this.photos[i].id);
      image.setAttribute("src", url)
    }
  }

  public isActive(item: number){
    if((item-1) == this.page) return "active";
    return "";
  }

  /*-------------------------------------------------------*/ 

  public async openDialog(photo: Photo){
    this.isLoading = true;
    this.photoDetail = photo;
    this.display = true;
    if(this.photoDetail.tags){
      this.tags = photo.tags.split(",");
    }

    let isFound = false;

    for(let item of this.image){
      if(item.id == photo.id){
        let url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(item.blob));
        this.imageUrl = url;
        isFound = true;
        break;
      }
    }

    if(!isFound){
      let file = await this.catalogsService.getPhoto(this.photoDetail.id);
      let url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.imageUrl = url;
      isFound = true;
    }

    this.setNewPhoto(this.photoDetail)

    this.isLoading = false;
  }

  public async dialogDownload(){
    let file = await this.catalogsService.getPhoto(this.photoDetail.id);
    let url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.photoDetail.name;
    link.click();
  }

  async onNext(): Promise<void> {
    await this.setNewPhoto(this.nextPhoto);
  }

  async onLast(): Promise<void> {
    await this.setNewPhoto(this.lastPhoto);
  }

  async setNewPhoto(newPhoto: Photo){

    this.isLoading = true;
    this.photoDetail.id = newPhoto.id;
    this.photoDetail = await this.catalogsService.getPhotoDetails(this.photoDetail.id);
    this.photoDetail = this.photoDetail[0];

    let isNull = true;

    for(let item of this.image){
      if(item.id == this.photoDetail.id){
        let url = URL.createObjectURL(item.blob);
        let image = document.querySelector("img#image");
        image.setAttribute("src", url)
        isNull = false;
      }
    }

    if(isNull){
      let data = await this.catalogsService.getMiniPhoto(this.photoDetail.id);
      let url = URL.createObjectURL(data);
      let image = document.querySelector("img#image");
      image.setAttribute("src", url)
    }

    let arrId = 0;
    for(let item of this.image){
      if(item.id == this.photoDetail.id){
        break;
      } else {
        arrId++;
      }
    }

    this.lastPhoto = null;
    this.nextPhoto = null;

    if(arrId > 0){
      this.lastPhoto = this.photos[arrId - 1];
    }

    if(arrId < this.photos.length){
      this.nextPhoto = this.photos[arrId + 1];
    }
    this.isLoading = false;
  }

  public translateTag(tag: string, index){
    let tag2 = parseInt(index);
    for(let item of this.posibleTags){
      if(tag2 == item.data) return item.label;
    }
  }

  public stringToTag(tag:string): string[]{
    return tag.split(",");
  }
}