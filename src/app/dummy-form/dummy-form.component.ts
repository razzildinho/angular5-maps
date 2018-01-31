import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dummy-form',
  templateUrl: './dummy-form.component.html',
  styleUrls: ['./dummy-form.component.scss']
})
export class DummyFormComponent implements OnInit {

    public address: any = {};

  constructor() { }

  ngOnInit() {
  }

}
