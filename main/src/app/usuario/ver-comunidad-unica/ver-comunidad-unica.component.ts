import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'app/authentication/login/login.service';
import { switchMap } from 'rxjs/operators';
import { ComunidadesService } from '../services/comunidades.service';
import { Comunidad } from '../interfaces/comunidadModel';
import { DecodedBase64 } from '../interfaces/decodedBase64Model';

@Component({
  selector: 'app-ver-comunidad-unica',
  templateUrl: './ver-comunidad-unica.component.html',
  styleUrls: ['./ver-comunidad-unica.component.scss']
})
export class VerComunidadUnicaComponent implements OnInit {

  idComunidadActual: number = 0;
  comunidadActual: Comunidad = {
    id_com: 0,
    nombre: '',
    descripcion: '',
    clave: '',
    banner: null,
    picture: null
  };

  constructor(private activatedRoute: ActivatedRoute, private loginService: LoginService, private comunidadesService: ComunidadesService) { }

  async ngOnInit(): Promise<void> {
    var url: string[] = window.location.pathname.split('/');
    this.idComunidadActual = Number(url[url.length - 1]);

    await this.comunidadesService.GetComunidadById(this.idComunidadActual).toPromise().then(comunidad => {
      this.comunidadActual = comunidad;
      console.log(this.comunidadActual);
    })
  }

  file2Base64 = (file: File): Promise<DecodedBase64> => {
    return new Promise<DecodedBase64>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let data = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((data.length % 4) > 0) {
          data += '='.repeat(4 - (data.length % 4));
        }
        const answer: DecodedBase64 = {
          data: data,
          descripcion: file.name,
          fileExtension: file.type
        }
        resolve(answer);
      };
      reader.onerror = error => reject(error);
    });
  }

}
