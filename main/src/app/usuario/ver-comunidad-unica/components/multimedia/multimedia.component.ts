import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.scss']
})
export class MultimediaComponent implements OnInit {

  loadingFlag: boolean = true;

  constructor() { }

  ngOnInit(): void {

    this.loadingFlag = false;
  }

}
