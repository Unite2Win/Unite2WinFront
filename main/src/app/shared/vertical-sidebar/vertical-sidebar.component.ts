import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { RouteInfo } from './vertical-sidebar.metadata';
import { VerticalSidebarService } from './vertical-sidebar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { globales } from '../../../common/globales';
import { LoginService } from 'app/authentication/login/login.service';
import { ROUTES } from './vertical-menu-items';
declare var $: any;

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html'
})
export class VerticalSidebarComponent implements OnInit {

  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[] = [];
  path = '';

  get usuarioLogueado() {
    return globales.usuarioLogueado;
  }

  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleNotify() {
    this.notify.emit(!this.showClass);
  }

  constructor(private menuServise: VerticalSidebarService, private router: Router, private loginService: LoginService) {
    this.menuServise.items.subscribe(menuItems => {
      this.sidebarnavItems = menuItems;

      // Active menu 
      this.sidebarnavItems.filter(m => m.submenu.filter(
        (s) => {
          if (s.path === this.router.url) {
            this.path = m.title;
          }
        }
      ));
      this.addExpandClass(this.path);
    });
  }
  ngOnInit(): void {
    switch (globales.usuarioLogueado.nick) {
      case 'dani': {
        globales.soyAdminGlobal = true;
        break;
      }
      case 'eneko': {
        globales.soyAdminGlobal = true;
        break;
      }
      case 'aimar': {
        globales.soyAdminGlobal = true;
        break;
      }
      case 'iker': {
        globales.soyAdminGlobal = true;
        break;
      }
      case 'admin': {
        globales.soyAdminGlobal = true;
        break;
      }
      default: {
        globales.soyAdminGlobal = false;
        break;
      }
    }

    if (globales.soyAdminGlobal) {
      ROUTES.push({
        path: "administracion",
        title: "Administración",
        icon: "settings",
        class: "has-arrow zero-level mn-admin",
        label: "",
        labelClass: "side-badge badge bg-info",
        extralink: false,
        submenu: [
          {
            path: "/administracion/comunidades",
            title: "Comunidades",
            icon: "users",
            class: "level-one",
            label: "",
            labelClass: "",
            extralink: false,
            submenu: [],
          }
        ],
      });
    }
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  logout() {
    this.loginService.logout();
  }
}
