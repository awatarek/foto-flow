import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  public catalogId: number;

  constructor(public catalogService: CatalogsService, private router: ActivatedRoute ) { 
    this.catalogId = parseInt(this.router.snapshot.paramMap.get("id"));
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      location: new FormControl(''),
      author: new FormControl(''),
      catalogId: new FormControl(this.catalogId)
    });
  }

  public async sendFiles(){
    console.log(this.form.value)

    let formData:FormData = new FormData();
    if(this.files.length > 0) {
      for(var i =  0; i <  this.files.length; i++)  {
        formData.append("files",  this.files[i], this.files[i].name);
      } 
    }
    
    formData.append("data", JSON.stringify(this.form.value));
    this.catalogService.addPhotoToCatalog(formData);

  }

  public fileChange(eve){
    this.files = eve.target.files;
  }

}
