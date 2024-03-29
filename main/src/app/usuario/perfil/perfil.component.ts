import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { globales } from 'common/globales';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill
} from 'ng-apexcharts';
import { UsuariosService } from '../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { DocumentosService } from '../services/documentos.service';
import { Documento } from '../interfaces/documentoModel';
import { Usuario } from '../interfaces/usuarioModel';
import { DecodedBase64 } from '../interfaces/decodedBase64Model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent = Object.create(null);

  recursoDocumento: Documento = {
    id_doc: -1,
    data: '',
    descripcion: '',
    extensionArchivo: ''
  }

  myForm: FormGroup

  constructor(private fb: FormBuilder, private usuariosService: UsuariosService, private documentosService: DocumentosService, private toastrService: ToastrService) { }

  public radialChartOptions: Partial<any>;

  ngOnInit(): void {
    this.myForm = this.fb.group({
      id_usu: new FormControl(globales.usuarioLogueado.id_usu),
      nick: new FormControl(globales.usuarioLogueado.nick),
      password: new FormControl(globales.usuarioLogueado.password),
      name: new FormControl(globales.usuarioLogueado.name),
      surname: new FormControl(globales.usuarioLogueado.surname),
      email: new FormControl(globales.usuarioLogueado.email),
      picture: new FormControl(),
      level: new FormControl(globales.usuarioLogueado.level),
      active: new FormControl(globales.usuarioLogueado.active),
      last_login: new FormControl(globales.usuarioLogueado.last_login),
      create_date: new FormControl(globales.usuarioLogueado.create_date),
      last_modified: new FormControl(globales.usuarioLogueado.last_modified),
      delete_date: new FormControl(globales.usuarioLogueado.delete_date),
      perfil: new FormControl(globales.usuarioLogueado.perfil),
      objetivos: new FormControl(globales.usuarioLogueado.perfil),
      comunidadesUsuarios: new FormControl(globales.usuarioLogueado.comunidadesUsuarios),
    })

    this.radialChartOptions = {
      series: [globales.usuarioLogueado.level, 100 - globales.usuarioLogueado.level],
      chart: {
        type: 'donut',
        height: 140,
        fontFamily: 'Nunito Sans,sans-serif',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '90px',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '18px',
                color: undefined,
                offsetY: 10
              },
              value: {
                show: false,
                color: '#99abb4',
              },
              total: {
                show: true,
                label: globales.usuarioLogueado.level,
                color: '#99abb4',
              }
            }
          }
        }
      },
      tooltip: {
        fillSeriesColor: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0
      },
      legends: {
        show: false,
      },
      labels: ['Nivel', 'other'],
      colors: ['#2961ff', '#dadada'],
    };
  }

  get globales() {
    return globales.usuarioLogueado;
  }

  async postDocumento(documento: Documento) {
    this.recursoDocumento = await this.documentosService.postDocumento(documento).toPromise()
  }

  async submit() {
    if (this.myForm.controls['password'].value.length < 8) {
      this.toastrService.error('La contraseña debe de tener al menos 8 carácteres')
      return;
    }
    if (this.recursoDocumento.id_doc != -1) {
      await this.postDocumento(this.recursoDocumento)
      var usuarioAModificar: Usuario = {
        id_usu: globales.usuarioLogueado.id_usu,
        nick: this.myForm.controls['nick'].value,
        password: this.myForm.controls['password'].value,
        name: this.myForm.controls['name'].value,
        surname: this.myForm.controls['surname'].value,
        email: this.myForm.controls['email'].value,
        pictureid_doc: this.recursoDocumento.id_doc,
        level: globales.usuarioLogueado.level,
        active: globales.usuarioLogueado.active
      }
      await this.usuariosService.putUsuario(globales.usuarioLogueado.id_usu, usuarioAModificar).subscribe(resp => {
        this.toastrService.success('Tu información ha sido actualizada')
      })
      globales.usuarioLogueado.name = usuarioAModificar.name
      globales.usuarioLogueado.surname = usuarioAModificar.surname
      globales.usuarioLogueado.nick = usuarioAModificar.nick
      globales.usuarioLogueado.password = usuarioAModificar.password
      globales.usuarioLogueado.email = usuarioAModificar.email
      globales.usuarioLogueado.pictureid_doc = usuarioAModificar.pictureid_doc
      globales.usuarioLogueado.picture = this.recursoDocumento
    } else {
      if (globales.usuarioLogueado.picture != null || globales.usuarioLogueado.picture != undefined) {
        var usuarioAModificar: Usuario = {
          id_usu: globales.usuarioLogueado.id_usu,
          nick: this.myForm.controls['nick'].value,
          password: this.myForm.controls['password'].value,
          name: this.myForm.controls['name'].value,
          surname: this.myForm.controls['surname'].value,
          email: this.myForm.controls['email'].value,
          pictureid_doc: globales.usuarioLogueado.picture.id_doc,
          level: globales.usuarioLogueado.level,
          active: globales.usuarioLogueado.active
        }
      } else {
        var usuarioAModificar: Usuario = {
          id_usu: globales.usuarioLogueado.id_usu,
          nick: this.myForm.controls['nick'].value,
          password: this.myForm.controls['password'].value,
          name: this.myForm.controls['name'].value,
          surname: this.myForm.controls['surname'].value,
          email: this.myForm.controls['email'].value,
          level: globales.usuarioLogueado.level,
          active: globales.usuarioLogueado.active
        }
      }
      await this.usuariosService.putUsuario(globales.usuarioLogueado.id_usu, usuarioAModificar).subscribe(resp => {
        this.toastrService.success('Tu información ha sido actualizada')
      })
      var foto = globales.usuarioLogueado.picture
      globales.usuarioLogueado = this.myForm.value
      globales.usuarioLogueado.picture = foto
    }

  }

  reset() {
    this.myForm.setValue(globales.usuarioLogueado)
  }

  password = "password";

  show = false;

  onClick() {
    if (this.password == 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  async onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files[0];
    if (file) {
      await this.file2Base64(file).then(
        (res) => {
          this.recursoDocumento = {
            id_doc: 0,
            data: res.data,
            descripcion: res.descripcion,
            extensionArchivo: res.fileExtension
          }
          globales.usuarioLogueado.picture = this.recursoDocumento
        }
      )
    }
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
