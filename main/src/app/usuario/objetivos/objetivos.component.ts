import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ObjetivosService } from '../services/objetivos.service';
import { Objetivo } from '../interfaces/objetivo';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { globales } from 'common/globales';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.scss']
})
export class ObjetivosComponent implements OnInit {
  objetivo: Objetivo;
  nuevoObjetivo: Objetivo;
  objetivos: Objetivo[] = [];
  form1: FormGroup;
  editando: boolean = false;
  usuario: number = globales.usuarioLogueado.id_usu;
  progressValue: number;
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

  constructor(private modalService: NgbModal, private objetivosService: ObjetivosService) { }

  async ngOnInit() {
    
    await this.objetivosService.GetObjetivosUsuario(globales.usuarioLogueado.id_usu).toPromise().then(x => this.objetivos = x);


    this.form1 = new FormGroup({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      duracion: new FormControl('', [Validators.required, Validators.min(0)]),
      //acepta: new FormControl(false)
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.objetivo) {
      this.progressValue = await this.getProgressBarValue(this.objetivo);
    }
  }

  modalOpenRegister(modalRegister: any, editar: boolean, objetivo?: any) {
    this.modalService.open(modalRegister);

    if (editar) {
      // Si se va a editar un objetivo existente, cargamos los valores en el formulario
      this.nuevoObjetivo = {
        id_obj: objetivo.id_obj,
        nombre: objetivo.nombre,
        descripcion: objetivo.descripcion,
        create_date:objetivo.create_date,
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
        id_usu: globales.usuarioLogueado.id_usu,
      };
      this.editando = false;
    }
  }

  guardar() {
    if (this.editando) {
      this.modificar(this.nuevoObjetivo.id_obj, this.nuevoObjetivo);
    } else {
      this.anadir()
    }
  }

  async anadir() {
    this.form1.reset();
    this.modalService.dismissAll();
    await this.objetivosService.PostObjetivos(this.nuevoObjetivo).toPromise().then(x => console.log(x));
    this.objetivos = [];
    await this.objetivosService.GetObjetivosUsuario(globales.usuarioLogueado.id_usu).toPromise().then(x => this.objetivos = x);

  }

  async modificar(index: number, objetivo: Objetivo) {
    console.log(objetivo);
    await this.objetivosService.UpdateObjetivos(index, objetivo).toPromise().then(x => console.log(x));
    this.objetivos = [];
    await this.objetivosService.GetObjetivosUsuario(globales.usuarioLogueado.id_usu).toPromise().then(x => this.objetivos = x);
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

  getProgressBarValue(objetivo: Objetivo): number {
    const fechaString = objetivo.create_date;
    const fecha = new Date(fechaString);
    //console.log(fecha);
    const diferenciaEnDias = Math.floor((new Date().getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    //console.log(diferenciaEnDias);
    let progreso = (diferenciaEnDias / objetivo.duracion) * 100;
    progreso = Math.min(progreso, 100); // Para que no supere el 100%
    return progreso;
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

/*   modificar(indice: number) {
    this.nuevoObjetivo = this.objetivos[indice];
    this.form1.setValue({
      nombre: this.nuevoObjetivo.nombre,
      descripcion: this.nuevoObjetivo.descripcion,
      duracion: this.nuevoObjetivo.duracion
    });
    this.modalOpenRegister('modalRegister');
  } */



  //ENEKO:

  // myForm = new FormGroup ({
  //   nombre: new FormControl(),
  //   descripcion: new FormControl(),
  //   duracion: new FormControl(),
  //   id_usu: new FormControl()
  // })

  // postObjetivo: Objetivo

  // misObjetivos
  // diarios = 0
  // semanales = 0
  // mensuales = 0

  // modalReference

  // constructor(private objetivosService: ObjetivosService, private modalService: NgbModal, private toastrService: ToastrService) { }

  // ngOnInit(): void {
  //   this.objetivosService.getById(Number(globales.usuarioLogueado.id_usu)).subscribe(resp=> {
  //     this.misObjetivos = resp
  //     resp.forEach(elem => {
  //       if (elem.duracion == 0) {
  //         this.diarios++
  //       } else if (elem.duracion == 1) {
  //         this.semanales++
  //       } else if (elem.duracion == 2) {
  //         this.mensuales++
  //       }
  //     })
  //   })
  // }

  // modalOpenLogin(modalLogin: any) {
  //   this.modalReference = this.modalService.open(modalLogin);
  // }

  // onSubmit() {
  //   this.myForm.get('id_usu').setValue(Number(globales.usuarioLogueado.id_usu))
  //   this.postObjetivo = this.myForm.value
  //   console.log(this.postObjetivo)
  //   this.objetivosService.postObjetivo(this.postObjetivo).subscribe(resp=>{
  //     console.log(resp)
  //     this.toastrService.success('Objetivo creado correctamente', 'Felicidades')
  //   })
  //   this.modalReference.close()
  //   console.log(this.myForm)