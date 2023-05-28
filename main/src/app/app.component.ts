import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private config: PrimeNGConfig, private translate: TranslateService, public router: Router) { this.router.navigate(["/usuario/inicio"]); }

  ngOnInit() {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.translate.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}
