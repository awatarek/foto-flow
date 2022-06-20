import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-add-catalog',
  templateUrl: './add-catalog.component.html',
  styleUrls: ['./add-catalog.component.scss']
})
export class AddCatalogComponent implements OnInit {
  public form: FormGroup;
  protected formBuilder: FormBuilder;
  public files: File[];

  constructor(public catalogService: CatalogsService ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      location: new FormControl(''),
      author: new FormControl('')
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

    this.catalogService.createCatalog(formData);

  }

  public fileChange(eve){
    this.files = eve.target.files;
  }

}
