import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-add-catalog',
  templateUrl: './add-catalog.component.html',
  styleUrls: ['./add-catalog.component.scss']
})
export class AddCatalogComponent implements OnInit {
  public form: FormGroup;
  public files: File[];
  public uploadedFiles: any[] = [];
  public isUploading: boolean = false;
  public showSucessInfo: boolean = false;
  public toUpload :number = 0;
  public uploaded :number = 0;

  constructor(public catalogService: CatalogsService ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      location: new FormControl(''),
      tags: new FormControl('')
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

    let upload = this.catalogService.createCatalog(formData);
    this.uploaded = 0;
    this.toUpload = 0;

    (await upload).subscribe((eve) =>{
      console.log(eve)
      if(eve.type == 0){
        this.isUploading = true;
      } else if(eve.type == 1){
        this.toUpload = eve.total;
        this.uploaded = eve.loaded;
      }else if(eve.type == 4){
        this.isUploading = false;
        this.showSucessInfo = true;
      }
    })

    this.form.reset();
  }

  public fileChange(event){
    this.files = event.currentFiles;
  }
}
