import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-components-panel',
  templateUrl: './components-panel.component.html',
  styleUrls: ['./components-panel.component.scss']
})
export class ComponentsPanelComponent implements OnInit {

  public files: File[];
  public form: FormGroup;
  protected formBuilder: FormBuilder;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      files: new FormControl(''),
    });
  }

  public fileChange(eve){
    this.files = eve.target.files;
  }

  public async submit(){
    let formData:FormData = new FormData();
    if(this.files.length > 0) {
      for(var i =  0; i <  this.files.length; i++)  {  
        formData.append("files",  this.files[i], this.files[i].name);
      } 

    }

    formData.append("data", JSON.stringify(this.form.value.name));

    /*await this.http.post<CatalogAdd[]>("http://localhost:4001/api/v1/catalog", formData, {
      reportProgress: true,
      responseType: 'json',
    }).toPromise();*/
  }

}
