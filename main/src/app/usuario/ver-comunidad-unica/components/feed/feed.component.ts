import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comunidad } from 'app/usuario/interfaces/comunidadModel';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';
import { globales } from 'common/globales';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  @Input() comunidadActual: Comunidad;
  @Input() isMiembro: boolean;

  miFormCompartir: FormGroup = this.fb.group({
    url: ['', Validators.required]
  });

  usuarioActual: Usuario = globales.usuarioLogueado;

  aniversario: string;

  loadingFlag: boolean = true;

  constructor(private dp: DatePipe, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.aniversario = this.dp.transform(this.comunidadActual.create_date, 'dd-MM-yyyy', 'es-ES');
    this.aniversario = this.aniversario.replace(new RegExp('-', 'g'),'/');

    this.loadingFlag = false;
  }

  holi() {
    console.log('holi');
  }

}
