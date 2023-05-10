import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObjetivosService } from '../services/objetivos.service';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.scss']
})
export class ObjetivosComponent implements OnInit {

  constructor(private objetivosService: ObjetivosService, private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.objetivosService.getAll().subscribe(resp=> {
      console.log(resp)
    }))
  }

  modalOpenLogin(modalLogin: any) {
    this.modalService.open(modalLogin);
  }

}
