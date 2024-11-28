import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ImageHighlightDirective } from '../../directives/image-highlight.directive';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink, HighlightDirective, ImageHighlightDirective],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css',
})
export class BienvenidaComponent {
  spinner: boolean = false;
  authService = inject(AuthService);
  constructor() {}

  ngOnInit(): void {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 1500);
  }
}
