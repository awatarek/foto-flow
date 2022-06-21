import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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

  private numberOfPhotos = 50;
  public visiblePhoto: Photo[] = [];
  public page: number = 0;
  public pageArray: number[] = [];
  public numberOfPages: number = 1;

  constructor(private router: ActivatedRoute, private http: HttpClient, public dialog: MatDialog, private catalogsService: CatalogsService) { }

  async ngOnInit(): Promise<void> {
    this.catalogId = parseInt(this.router.snapshot.paramMap.get("id"));
    this.catalogInfo = await this.catalogsService.getCatalogDetails(this.catalogId);
    this.photos = await this.catalogsService.getPhotosFromCatalog(this.catalogId);
    

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

  public openDialog(id): void{
    if(this.downloadMultiple) return;
      const dialogRef = this.dialog.open(ImageDialog, {
        width: '720px',
        data: {id: id, photos: this.photos, images: this.image},
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });

  }

  public chooseMultipleFile(){
    this.fileToDownload = [];
    this.downloadMultiple = !this.downloadMultiple;
  }

  public async downloadMultipleFile(){
    if(this.fileToDownload.length > 0){
      let file = await this.catalogsService.downloadMultiplePhoto(this.fileToDownload, this.catalogId);
      let url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = "foto-flow.zip";
      link.click();

  
      this.fileToDownload = [];
      this.downloadMultiple = false;
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

  public async downloadAll(){
    let file = await this.catalogsService.downloadMultiplePhoto([], this.catalogId);
    let url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = "foto-flow.zip";
    link.click();
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
  

}

@Component({
  selector: 'image-dialog',
  templateUrl: 'image-dialog.html',
  styleUrls: ['./catalog.component.scss']
})
export class ImageDialog implements OnInit {
  public photo: Photo = null;
  public isLoading: boolean = true;
  public tags: string[] = [];

  public lastPhoto: Photo;
  public nextPhoto: Photo;

  constructor(
    public dialogRef: MatDialogRef<ImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private catalogsService: CatalogsService
  ) {
  }

  async ngOnInit(): Promise<void> {
    console.log(this.data.images)

    this.isLoading = true;
    let item = await this.catalogsService.getMiniPhoto(this.data.id);
    let url = URL.createObjectURL(item);
    let image = document.querySelector("img#image");
    image.setAttribute("src", url)

    this.photo = await this.catalogsService.getPhotoDetails(this.data.id);

    let arrId = 0;
    for(let item of this.data.photos){
      if(item.id == this.data.id){
        break;
      } else {
        arrId++;
      }
    }

    this.photo.tags = "test, test2, test3, test4";

    if(this.photo.tags){
      this.tags = this.photo.tags.split(",")
    }


    if(arrId > 0){
      this.lastPhoto = this.data.photos[arrId - 1];
    }

    if(arrId < this.data.photos.length){
      this.nextPhoto = this.data.photos[arrId + 1];
    }

    this.isLoading = false;
  }

  public async download(){
    let file = await this.catalogsService.getPhoto(this.data.id);
    let url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.photo[0].name;
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
    this.data.id = newPhoto.id;
    let item = await this.catalogsService.getMiniPhoto(this.data.id);
    let url = URL.createObjectURL(item);
    let image = document.querySelector("img#image");
    image.setAttribute("src", url)
    this.photo = await this.catalogsService.getPhotoDetails(this.data.id);

    let arrId = 0;
    for(let item of this.data.photos){
      if(item.id == this.data.id){
        break;
      } else {
        arrId++;
      }
    }

    this.lastPhoto = null;
    this.nextPhoto = null;

    if(arrId > 0){
      this.lastPhoto = this.data.photos[arrId - 1];
    }

    if(arrId < this.data.photos.length){
      this.nextPhoto = this.data.photos[arrId + 1];
    }
    this.isLoading = false;
  }
}
