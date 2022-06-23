import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/shared/model/photo.model';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-photo-verification-panel',
  templateUrl: './photo-verification-panel.component.html',
  styleUrls: ['./photo-verification-panel.component.scss']
})
export class PhotoVerificationPanelComponent implements OnInit {
  public photos: Photo[] = [];
  public choosedPhotos: Photo[] = [];
  public itemDetail: Photo;
  display: boolean = false;

  public first = 0;
  public rows = 10;

  constructor(private cs: CatalogsService) { }

  async ngOnInit(): Promise<void> {
    this.photos = await this.cs.getNotActivePhoto();
    await this.paginate({first: this.first, rows: this.rows});
  }

  public async showDialog(photo: Photo) {
    this.display = true;
    this.itemDetail = photo;

    let data = await this.cs.getPhoto(photo.id);
    let url = URL.createObjectURL(data);
    let image = document.querySelector("img#image");
    image.setAttribute("src", url)
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

  public async getPhoto(id: number){
    return await this.cs.getMiniPhoto(id);
  }

  public async paginate(event){
    this.first = event.first;
    this.rows = event.rows;

    let maxPhoto = event.first+event.rows;
    if(maxPhoto > this.photos.length) maxPhoto = this.photos.length;
    

    for(let i = event.first; i < maxPhoto; i++){
      let photo: Photo = this.photos[i];
      let data = await this.cs.getMiniPhoto(photo.id);

      let url = URL.createObjectURL(data);
      let image = document.querySelector("img.image-"+photo.id);
      image.setAttribute("src", url)
    }
  }


}
