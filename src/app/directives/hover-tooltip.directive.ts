import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverTooltip]',
  standalone: true,
})
export class HoverTooltipDirective {
  private tooltipElement: HTMLSpanElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    // Cambiar el puntero a una mano
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');

    // Crear el tooltip
    this.tooltipElement = this.renderer.createElement('span');
    const text = this.renderer.createText('Descargar Excel de usuario');
    this.renderer.appendChild(this.tooltipElement, text);

    // Agregar estilos al tooltip
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(
      this.tooltipElement,
      'background',
      'rgba(0, 0, 0, 0.7)'
    );
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');

    // Posicionar el tooltip
    this.renderer.setStyle(
      this.tooltipElement,
      'top',
      `${this.el.nativeElement.offsetTop}px`
    );
    this.renderer.setStyle(
      this.tooltipElement,
      'left',
      `${this.el.nativeElement.offsetLeft}px`
    );

    // Adjuntar el tooltip al cuerpo
    this.renderer.appendChild(document.body, this.tooltipElement);
  }

  @HostListener('mouseleave') onMouseLeave() {
    // Eliminar el tooltip al salir del elemento
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
