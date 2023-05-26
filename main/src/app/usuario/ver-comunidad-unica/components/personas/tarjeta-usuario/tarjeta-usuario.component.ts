import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'app/usuario/interfaces/usuarioModel';

@Component({
  selector: 'app-tarjeta-usuario',
  templateUrl: './tarjeta-usuario.component.html',
  styleUrls: ['./tarjeta-usuario.component.scss']
})
export class TarjetaUsuarioComponent implements OnInit {

  @Input() usuario: Usuario;
  @Input() tipoUsuario: number;

  tipoUsuarioString: string = '';

  constructor() { }

  ngOnInit(): void {
    switch(this.tipoUsuario) {
      case 1: this.tipoUsuarioString = 'Usuario común'; break;
      case 2: this.tipoUsuarioString = 'Usuario moderador'; break;
      case 3: this.tipoUsuarioString = 'Usuario administrador'; break;
    }
  }

}
