import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
  public displayedColumns: string[] = ['name', 'visible', 'accepted'];
  public dataSource = new MatTableDataSource<Catalog>(this.catalogs);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private cs: CatalogsService) { }

  async ngOnInit(): Promise<void> {
    this.catalogs = await this.cs.getCatalogs();
    this.dataSource = new MatTableDataSource<Catalog>(this.catalogs);
  }

}
