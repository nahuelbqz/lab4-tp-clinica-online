import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink,NgIf],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent {
  spinner: boolean = false;
  
  constructor() {}

  ngOnInit(): void {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 1500);
  }

}
