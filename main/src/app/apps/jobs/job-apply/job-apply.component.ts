import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-apply',
  templateUrl: './job-apply.component.html',
  styleUrls: ['./job-apply.component.css']
})
export class JobApplyComponent implements OnInit {

  applyDetail: FormGroup;

  constructor(public fb: FormBuilder) { 

    this.applyDetail = this.fb.group({

      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],

    });


  }

  ngOnInit(): void {
  }


  onSubmit() {
    debugger;
    
  }



}
