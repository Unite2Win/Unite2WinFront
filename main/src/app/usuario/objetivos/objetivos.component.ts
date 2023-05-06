import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObjetivosService } from '../services/objetivos.service';
import { Objetivo } from 'app/interfaces/ObjetivoModel';
import { FormControl, FormGroup } from '@angular/forms';
import { globales } from 'common/globales';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.scss']
})
export class ObjetivosComponent implements OnInit {

  myForm = new FormGroup ({
    nombre: new FormControl(),
    descripcion: new FormControl(),
    duracion: new FormControl(),
    id_usu: new FormControl()
  })

  postObjetivo: Objetivo

  misObjetivos
  diarios = 0
  semanales = 0
  mensuales = 0

  modalReference

  constructor(private objetivosService: ObjetivosService, private modalService: NgbModal, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.objetivosService.getById(Number(globales.usuarioLogueado.id_usu)).subscribe(resp=> {
      this.misObjetivos = resp
      resp.forEach(elem => {
        if (elem.duracion == 0) {
          this.diarios++
        } else if (elem.duracion == 1) {
          this.semanales++
        } else if (elem.duracion == 2) {
          this.mensuales++
        }
      })
    })
  }

  modalOpenLogin(modalLogin: any) {
    this.modalReference = this.modalService.open(modalLogin);
  }

  onSubmit() {
    this.myForm.get('id_usu').setValue(Number(globales.usuarioLogueado.id_usu))
    this.postObjetivo = this.myForm.value
    console.log(this.postObjetivo)
    this.objetivosService.postObjetivo(this.postObjetivo).subscribe(resp=>{
      console.log(resp)
      this.toastrService.success('Objetivo creado correctamente', 'Felicidades')
    })
    this.modalReference.close()
    console.log(this.myForm)
  }

}
