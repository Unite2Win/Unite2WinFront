import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ObjetivosService } from '../services/objetivos.service';
import { Objetivo } from '../interfaces/objetivo';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.scss']
})
export class ObjetivosComponent implements OnInit {
objetivo: Objetivo;
nuevoObjetivo:Objetivo;

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

  objetivos: Objetivo[]=[]; 

  form1: FormGroup;



  constructor(private modalService: NgbModal, private objetivosService: ObjetivosService ) { }

  async ngOnInit() {

    await this.objetivosService.getObjetivos();
    console.log(this.objetivosService.objetivosBd);
    this.objetivos = this.objetivosService.objetivosBd;

    this.form1 = new FormGroup({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      duracion: new FormControl('', [Validators.required, Validators.min(0)]),
      acepta: new FormControl(false)
    });
  }

  async anadir() {
    this.form1.reset();
    this.modalService.dismissAll();   
    console.log("submit disparado");
    await this.objetivosService.PostObjetivos(this.nuevoObjetivo).toPromise().then(x => console.log(x));
    this.objetivos = [];
    await this.objetivosService.GetObjetivosBBDD().toPromise().then(x => this.objetivos = x);

  }

  modalOpenRegister(modalRegister: any) {
    this.modalService.open(modalRegister);
    this.nuevoObjetivo = {
      id_obj : 0,
      nombre :'',
      descripcion:'',
      duracion:0,
      id_usu:1
    };
  }

  guardar():void {
    this.objetivosService.UpdateObjetivos(this.objetivo.id_obj, this.objetivo)
      .subscribe(resultado => {
        console.log('El objetivo se actualizó correctamente:', resultado);
      }, error => {
        console.error('No se pudo actualizar el objetivo:', error);
      });
  }

  async eliminar(index: number) {
    await this.objetivosService.DeleteObjetivos(index).toPromise().then(x => console.log(x));
    var objetivos_copia = this.objetivos;
    this.objetivos = [];
    this.objetivos = objetivos_copia.filter(x => x.id_obj != index);

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
