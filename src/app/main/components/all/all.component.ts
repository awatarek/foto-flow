import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Photo } from 'src/app/shared/model/photo.model';
import { Catalog } from 'src/app/shared/model/catalog.model';
import { CatPho } from 'src/app/shared/model/catpho.model';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {
  public cat: CatPho[] = []

  public allCatalog: Catalog[] = [];
  public firstPhoto: Photo[] = [];
  public image: {id: number, blob: Blob}[] = [];

  private numberOfPhotos = 20;
  public visibleCatalogs: CatPho[] = [];
  public page: number = 0;
  public pageArray: number[] = [];
  public numberOfPages: number = 1;


  constructor(private http: HttpClient, private catalogService: CatalogsService) { }

  async ngOnInit(): Promise<void> {
    this.allCatalog = await this.catalogService.getCatalogs();
    this.firstPhoto = await this.catalogService.getFirstCatalogsPhoto();

    for(let item of this.allCatalog){
      let location = "";
      let photoId = 0;
      for(let ite of this.firstPhoto){

        if(ite.catalogs_id == item.id){
          location = ite.name;
          photoId = ite.id;
        }
      }
      if(photoId != 0)
      this.cat.push({id: item.id, name: item.name, fileLocation: location, fileId: photoId, accepted: item.accepted, visible: item.visible});
    }

    this.numberOfPages = Math.ceil(this.cat.length / this.numberOfPhotos);

    await this.getPhotos(1);
  }

  public async idToImage(variable: number): Promise<string> {
    for(let item of this.image){
      if(item.id == variable){
        return "blob:"+item.blob;
      }
    }

    return null;
  }

  public async getPhotos(page: number){
    this.page = (page - 1);


    this.visibleCatalogs = [];
    this.pageArray= [];

    for(let i = 0; i< this.numberOfPages; i++){
      this.pageArray.push((i+1));
    }

    let maxPhoto = this.page*this.numberOfPhotos+this.numberOfPhotos;
    if(maxPhoto > this.cat.length) maxPhoto = this.cat.length;

    for(let i = (this.page*this.numberOfPhotos); i < maxPhoto; i++){

      this.visibleCatalogs.push(this.cat[i]);
      let data = await this.catalogService.getMiniPhoto(this.cat[i].fileId);
      this.image.push({id: this.cat[i].id, blob: data});

      let url = URL.createObjectURL(data);
      let image = document.querySelector("img#image-"+this.cat[i].id);
      image.setAttribute("src", url)
    }
  }

  public isActive(item: number){
    if((item-1) == this.page) return "active";
    return "";
  }
}
