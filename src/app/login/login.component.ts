import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isIframe = false;

  public error: string = "";
  public login: boolean = true;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private router: Router, private authService: MsalService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService) { }

  async ngOnInit(): Promise<void> {

    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })
    
  }

  public async loginToPanel(){
    this.router.navigate(["/panel"])
  }

  public msalLogin() {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
      this.router.navigate(["/panel"]);

  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
function filter(arg0: (status: InteractionStatus) => boolean): any {
  throw new Error('Function not implemented.');
}

function takeUntil(_destroying$: any): any {
  throw new Error('Function not implemented.');
}

