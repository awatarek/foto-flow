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

  constructor(private http: HttpClient, private catalogService: CatalogsService) { }

  async ngOnInit(): Promise<void> {
    
    this.allCatalog = await this.catalogService.getCatalogs();
    this.firstPhoto = await this.catalogService.getFirstCatalogsPhoto();
    
    for(let item of this.allCatalog){
      let location = "";
      for(let ite of this.firstPhoto){

        if(ite.catalogs_id == item.id){
          location = ite.fileLocation;
        }
      }

      this.cat.push({id: item.id, name: item.name, fileLocation: location, accepted: item.accepted, visible: item.visible});
    }

    await this.getPhotos();
  }

  public async idToImage(variable: number): Promise<string> {
    for(let item of this.image){
      if(item.id == variable){
        return "blob:"+item.blob;
      }
    }

    return null;
  }

  public async getPhotos(){
    for(let item of this.firstPhoto){
      let data = await this.catalogService.getMiniPhoto(item.id);
      this.image.push({id: item.catalogs_id, blob: data});
    }

    for(let item of this.image){
      let url = URL.createObjectURL(item.blob);
      let image = document.querySelector("img#image-"+item.id);
      image.setAttribute("src", url)
    }
  }
}
