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

  myForm: FormGroup

  constructor(private fb: FormBuilder, private usuariosService: UsuariosService, private toastrService: ToastrService) { }

  public radialChartOptions: Partial<any>;

  ngOnInit(): void {
    this.myForm = this.fb.group({
      id_usu: new FormControl(globales.usuarioLogueado.id_usu),
      nick: new FormControl(globales.usuarioLogueado.nick),
      password: new FormControl(globales.usuarioLogueado.password),
      name: new FormControl(globales.usuarioLogueado.name),
      surname: new FormControl(globales.usuarioLogueado.surname),
      email: new FormControl(globales.usuarioLogueado.email),
      picture: new FormControl(globales.usuarioLogueado.picture),
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

  async submit() {
    console.log(globales.usuarioLogueado.id_usu)
    console.log(this.myForm.value)
    await this.usuariosService.putUsuario(globales.usuarioLogueado.id_usu, this.myForm.value).subscribe(resp => {
      console.log(resp)
      this.toastrService.success('Tu información ha sido actualizada')
    })
    globales.usuarioLogueado = this.myForm.value
  }

  reset() {
    this.myForm.setValue(globales.usuarioLogueado)
  }

}
