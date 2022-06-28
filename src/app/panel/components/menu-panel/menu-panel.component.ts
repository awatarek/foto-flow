import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.scss']
})
export class MenuPanelComponent implements OnInit {
  public displaySideMenu: boolean = false;
  public isMobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth < 900;
  }


  constructor() { }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 900;
  }

}
