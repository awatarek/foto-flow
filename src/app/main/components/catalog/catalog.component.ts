import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
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

  constructor(private router: ActivatedRoute, private http: HttpClient, public dialog: MatDialog, private catalogsService: CatalogsService) { }

  async ngOnInit(): Promise<void> {
    this.catalogId = parseInt(this.router.snapshot.paramMap.get("id"));
    this.catalogInfo = await this.catalogsService.getCatalogDetails(this.catalogId);
    this.photos = await this.catalogsService.getPhotosFromCatalog(this.catalogId);
    for(let item of this.photos){
      let data = await this.catalogsService.getMiniPhoto(item.id);
      this.image.push({id: item.id, blob: data});
    }

    

    for(let item of this.image){
      let url = URL.createObjectURL(item.blob);
      let image = document.querySelector("img#image-"+item.id);
      image.setAttribute("src", url)
    }
  }

  public openDialog(id): void{
    if(this.downloadMultiple) return;
      const dialogRef = this.dialog.open(ImageDialog, {
        width: '720px',
        data: {id: id, photos: this.photos},
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