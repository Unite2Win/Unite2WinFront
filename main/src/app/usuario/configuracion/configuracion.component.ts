import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globales } from 'common/globales';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FullComponent } from '../../layouts/full/full.component';
declare var $: any;

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  public config: PerfectScrollbarConfigInterface = {};
  active=1;

  tabStatus = 'justified';

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  get options() {
    return globales.options;
  }

  constructor(public router: Router, public fullComponent: FullComponent) { }

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard/classic']);
    }
    this.defaultSidebar = globales.options.sidebartype;
    this.handleSidebar();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: string) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case 'full':
      case 'iconbar':
        if (this.innerWidth < 1170) {
          globales.options.sidebartype = 'mini-sidebar';
        } else {
          globales.options.sidebartype = this.defaultSidebar;
        }
        break;

      case 'overlay':
        if (this.innerWidth < 767) {
          globales.options.sidebartype = 'mini-sidebar';
        } else {
          globales.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  toggleSidebarType() {
    switch (globales.options.sidebartype) {
      case 'full':
      case 'iconbar':
        globales.options.sidebartype = 'mini-sidebar';
        break;

      case 'overlay':
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case 'mini-sidebar':
        if (this.defaultSidebar === 'mini-sidebar') {
          globales.options.sidebartype = 'full';
        } else {
          globales.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  handleClick(event: boolean) {
    this.showMobileMenu = event;
  }

}
