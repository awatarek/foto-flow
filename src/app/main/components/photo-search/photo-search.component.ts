import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from 'src/app/shared/model/photo.model';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-photo-search',
  templateUrl: './photo-search.component.html',
  styleUrls: ['./photo-search.component.scss']
})
export class PhotoSearchComponent implements OnInit {
  public searchItem: {name: string, location: string, author: string, tags: string};
  public photos: Photo[] = [];

  public downloadMultiple: boolean = false;
  public fileToDownload: Photo[] = [];
  public downloadInProgress: boolean = false;

  public posibleTags: any[] = [];
  public numberOfPages: number = 1;
  private numberOfPhotos = 25;
  public visiblePhoto: Photo[] = [];
  public page: number = 0;
  public pageArray: number[] = [];
  public image: {id: number, blob: Blob}[] = [];

  public display: boolean = false;
  public photoDetail: Photo;
  public isLoading: boolean = true;
  public tags: any[] = [];
  public lastPhoto: Photo;
  public nextPhoto: Photo;
  public imageUrl: SafeUrl;

  constructor(private route: ActivatedRoute, private cs: CatalogsService, private sanitizer: DomSanitizer) { }

  async ngOnInit(): Promise<void> {
    let data = this.route.snapshot.paramMap;
    this.searchItem = {name: data.get("name"), location: data.get("location"),
     author: data.get("author"), tags: data.get("tags")};
    
    this.photos = await this.cs.getSearchPhoto(this.searchItem);
    this.posibleTags = await this.cs.getTags();

    this.numberOfPages = Math.ceil(this.photos.length / this.numberOfPhotos);
    for(let i = 0; i< this.numberOfPages; i++){
      this.pageArray.push((i+1));
    }

    let maxPhoto = this.page*this.numberOfPhotos+this.numberOfPhotos;
    if(maxPhoto > this.photos.length) maxPhoto = this.photos.length;

    for(let i = (this.page*this.numberOfPhotos); i < maxPhoto; i++){
      this.visiblePhoto.push(this.photos[i]);
      
      let data = await this.cs.getMiniPhoto(this.photos[i].id);
      this.image.push({id: this.photos[i].id, blob: data});

      let url = URL.createObjectURL(data);
      let image = document.querySelector("img#image-"+this.photos[i].id);
      image.setAttribute("src", url)
    }
  }

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
      let file = await this.cs.getPhoto(this.photoDetail.id);
      let url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.imageUrl = url;
      isFound = true;
    }

    this.setNewPhoto(this.photoDetail)

    this.isLoading = false;
  }

  public async dialogDownload(){
    let file = await this.cs.getPhoto(this.photoDetail.id);
    let url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.photoDetail.name;
    link.click();
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

  async onNext(): Promise<void> {
    await this.setNewPhoto(this.nextPhoto);
  }

  public isActive(item: number){
    if((item-1) == this.page) return "active";
    return ""
  }

  async onLast(): Promise<void> {
    await this.setNewPhoto(this.lastPhoto);
  }
  

  async setNewPhoto(newPhoto: Photo){

    this.isLoading = true;
    this.photoDetail.id = newPhoto.id;
    this.photoDetail = await this.cs.getPhotoDetails(this.photoDetail.id);
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
      let data = await this.cs.getMiniPhoto(this.photoDetail.id);
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

  public translateTag(tag: string){
    let tag2 = parseInt(tag);
    for(let item of this.posibleTags){
      if(tag2 == item.data) return item.label;
    }
  }

  public async setPage(page: number){
    this.visiblePhoto = [];
    this.page = page - 1;


    let maxPhoto = this.page*this.numberOfPhotos+this.numberOfPhotos;
    if(maxPhoto > this.photos.length) maxPhoto = this.photos.length;

    for(let i = (this.page*this.numberOfPhotos); i < maxPhoto; i++){
      this.visiblePhoto.push(this.photos[i]);
      let data = await this.cs.getMiniPhoto(this.photos[i].id);
      this.image.push({id: this.photos[i].id, blob: data});

      let url = URL.createObjectURL(data);
      let image = document.querySelector("img#image-"+this.photos[i].id);
      image.setAttribute("src", url)
    }
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
}
