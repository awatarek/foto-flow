import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Catalog } from 'src/app/shared/model/catalog.model';
import { CatalogsService } from 'src/app/shared/service/catalogs.service';

@Component({
  selector: 'app-catalog-panel',
  templateUrl: './catalog-panel.component.html',
  styleUrls: ['./catalog-panel.component.scss']
})
export class CatalogPanelComponent implements OnInit {
  public catalogs: Catalog[] = [];
  public displayedColumns: string[] = ['name', 'visible', 'accepted', 'actions'];

  constructor(private cs: CatalogsService) { }

  async ngOnInit(): Promise<void> {
    this.catalogs = await this.cs.getAllCatalogs();
  }

  public async changeVisibilityStatus(catalogId: number){
    let isTrue: boolean;
    for(let item of this.catalogs){
      if(item.id == catalogId){
        isTrue = item.visible;
        item.visible = !item.visible;
        break;
      }
    }
    await this.cs.setVisibleCatalog(catalogId, (isTrue ? false : true));
  }

  public async changeAcceptenceStatus(catalogId: number){
    let isTrue: boolean;
    for(let item of this.catalogs){
      if(item.id == catalogId){
        isTrue = item.accepted;
        item.accepted = !item.accepted;
      }
    }
    await this.cs.setAcceptedCatalog(catalogId, (isTrue ? false : true));
  }

  public getClass(element: boolean){
    if(element) return "true";
    return "false";
  }

}
