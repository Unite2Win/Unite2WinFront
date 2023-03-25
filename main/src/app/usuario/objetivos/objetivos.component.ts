import { Component, OnInit } from '@angular/core';
import { ObjetivosService } from '../services/objetivos.service';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.scss']
})
export class ObjetivosComponent implements OnInit {

  constructor(private objetivosService: ObjetivosService) { }

  ngOnInit(): void {
    console.log(this.objetivosService.getAll().subscribe(resp=> {
      console.log(resp)
    }))
  }

}
