import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-add-photos',
  templateUrl: './add-photos.component.html',
  styleUrls: ['./add-photos.component.scss']
})
export class AddPhotosComponent implements OnInit {
  public form: FormGroup;
  protected formBuilder: FormBuilder;
  public files: File[];
  public uploadedFiles: any[] = [];
  public isUploading: boolean = false;
  public showSucessInfo: boolean = false;
  public catalogId: number;
  public toUpload :number = 0;
  public uploaded :number = 0;

  constructor(public catalogService: CatalogsService, private router: ActivatedRoute ) { 
    this.catalogId = parseInt(this.router.snapshot.paramMap.get("id"));
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      location: new FormControl(''),
      author: new FormControl(''),
      catalogId: new FormControl(this.catalogId)
    });
  }

  public async sendFiles(){
    if(this.files.length == 0){
      return;
    }
    this.isUploading = true;
    let formData:FormData = new FormData();
    if(this.files.length > 0) {
      for(var i =  0; i <  this.files.length; i++)  {
        formData.append("files",  this.files[i], this.files[i].name);
      } 
    }
    
    formData.append("data", JSON.stringify(this.form.value));

    let upload = this.catalogService.addPhotoToCatalog(formData);
    this.uploaded = 0;
    this.toUpload = 0;

    (await upload).subscribe((eve: HttpEvent<Object>) =>{
      if(eve){
        if(eve.type == 0){
          this.isUploading = true;
        } else if(eve.type == 1){
          this.toUpload = eve.total;
          this.uploaded = eve.loaded;
        }else if(eve.type == 4){
          this.isUploading = false;
          this.showSucessInfo = true;
          setTimeout(()=>{this.showSucessInfo = false}, 4000)
        }
      }
    });

    this.form.reset();
    this.files = [];
    this.uploadedFiles = [];
  }

  public fileChange(eve){
    this.files = eve.currentFiles;
  }

}
