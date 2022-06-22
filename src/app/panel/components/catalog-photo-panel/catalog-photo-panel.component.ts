import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Photo } from 'src/app/shared/model/photo.model';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-catalog-photo-panel',
  templateUrl: './catalog-photo-panel.component.html',
  styleUrls: ['./catalog-photo-panel.component.scss']
})
export class CatalogPhotoPanelComponent implements OnInit {
  public photos: Photo[] = [];
  public displayedColumns: string[] = ['photo', 'name', 'tags', 'location', 'author', 'edit'];
  public dataSource = new MatTableDataSource<Photo>(this.photos);
  public catalogId = 0;

  constructor(private cs: CatalogsService, private router: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.catalogId = this.router.snapshot.params.id;

    this.photos = await this.cs.getPhotosFromCatalog(this.catalogId);
    this.dataSource = new MatTableDataSource<Photo>(this.photos);
  }

  public getClass(element: boolean){
    if(element) return "true";
    return "false";
  }

}
