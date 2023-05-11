import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ObjetivosService } from '../services/objetivos.service';
import { Objetivo } from '../interfaces/objetivo';
import { number } from 'ngx-custom-validators/src/app/number/validator';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.scss']
})
export class ObjetivosComponent implements OnInit {
objetivo: Objetivo;
nuevoObjetivo:Objetivo;
objetivos: Objetivo[]=[]; 
form1: FormGroup;
editando: boolean = false;
/*   objetivos = [
    {
      nombre: 'Dejar de fumar',
      descripcion: 'Lorem ipsum y tralari y tralaraafafaf',
      duracion: 123,
      acepta: false
    },
    {
      nombre: 'Dejar de comer azucar',
      descripcion: 'Marzo de 2024 y mas cosas y asi ey e tmanfhngbfg ',
      duracion: 123,
      acepta: false
    }
  ]; */

  constructor(private modalService: NgbModal, private objetivosService: ObjetivosService ) { }

  async ngOnInit() {

    await this.objetivosService.getObjetivos();
    //console.log(this.objetivosService.objetivosBd);
    this.objetivos = this.objetivosService.objetivosBd;

    this.form1 = new FormGroup({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      duracion: new FormControl('', [Validators.required, Validators.min(0)]),
      //acepta: new FormControl(false)
    });
  }

  modalOpenRegister(modalRegister: any, editar: boolean, objetivo?: any) {
    this.modalService.open(modalRegister);
  
    if (editar) {
      // Si se va a editar un objetivo existente, cargamos los valores en el formulario
      this.nuevoObjetivo = {
        id_obj: objetivo.id_obj,
        nombre: objetivo.nombre,
        descripcion: objetivo.descripcion,
        duracion: objetivo.duracion,
        id_usu: objetivo.id_usu
      };
      this.editando = true;
    } else {
      // Si se va a añadir un nuevo objetivo, inicializamos los valores a cero o vacío
      this.nuevoObjetivo = {
        id_obj: 0,
        nombre: '',
        descripcion: '',
        duracion: 0,
        id_usu: 1
      };
      this.editando = false;
    }
  }

  
  guardar(){
    if(this.editando){
      this.modificar(this.nuevoObjetivo.id_obj, this.nuevoObjetivo);
    }else{
      this.anadir()
    }
  }

  async anadir() {
    this.form1.reset();
    this.modalService.dismissAll();   
    // console.log("submit disparado");
    await this.objetivosService.PostObjetivos(this.nuevoObjetivo).toPromise().then(x => console.log(x));
    this.objetivos = [];
    await this.objetivosService.GetObjetivosBBDD().toPromise().then(x => this.objetivos = x);

  }
  
  async modificar(index: number, objetivo: Objetivo) {
    //console.log("disparado modificar")
    await this.objetivosService.UpdateObjetivos(index, objetivo).toPromise().then(x => console.log(x));
    var objetivos_copia = this.objetivos;
    this.objetivos = [];
    await this.objetivosService.GetObjetivosBBDD().toPromise().then(x => this.objetivos = x);
    this.modalService.dismissAll();
  }

  async eliminar(index: number) {
    await this.objetivosService.DeleteObjetivos(index).toPromise().then(x => console.log(x));
    var objetivos_copia = this.objetivos;
    this.objetivos = [];
    this.objetivos = objetivos_copia.filter(x => x.id_obj != index);
    this.modalService.dismissAll();

  }

  modalOpenVC(modalCenter: any) {
    this.modalService.open(modalCenter, {
      centered: true,
    });
  }


  
  
/*   modificar(indice: number) {
    this.nuevoObjetivo = this.objetivos[indice];
    this.form1.setValue({
      nombre: this.nuevoObjetivo.nombre,
      descripcion: this.nuevoObjetivo.descripcion,
      duracion: this.nuevoObjetivo.duracion
    });
    this.modalOpenRegister('modalRegister');
  } */

}
