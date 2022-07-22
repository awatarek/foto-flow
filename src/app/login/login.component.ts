import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isIframe = false;

  constructor(private route: Router) { }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
  }

  public async loginToPanel(){
    this.route.navigate(["/panel"])
  }

}
