import { Component, ElementRef, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { LogService } from '../../services/log.service';
import { LogInterface } from '../../interfaces/log';
import { trigger, transition, style, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(
          '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'translateX(-100%)' })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  toastService = inject(ToastrService);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  logService = inject(LogService);
  datePipe = inject(DatePipe);
  loadedField: boolean = false;
  spinner: boolean = false;

  flag: boolean = false;
  captcha: string = '';

  imgUsuario1?: string;
  imgUsuario2?: string;
  imgUsuario3?: string;
  imgUsuario4?: string;
  imgUsuario5?: string;
  imgUsuario6?: string;

  formLogin = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    captcha: ['', Validators.required],
  });

  ngOnInit(): void {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 1500);

    this.obtenerImgUsuario(); // imagenes usuarios acceso rapido
    this.captcha = this.generarCaptcha(6); //CREA CAPTCHA
  }

  //CAPTCHA
  generarCaptcha(num: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      res += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return res;
  }

  onSubmit(): void {
    const value = this.formLogin.getRawValue();
    if (value.captcha === this.captcha) {
      this.authService
        .login(value.email, value.password)
        .then((r) => {
          this.authService.getUsuario(value.email).then((usuario) => {
            if (usuario.rol === 'admin' || r.user.emailVerified) {
              // Si el rol es admin, no necesita verificar email
              if (usuario.rol === 'especialista') {
                if (usuario.estaValidado) {
                  this.authService.mailActual = value.email;
                  this.authService.passActual = value.password;
                  const logAux: LogInterface = {
                    email: value.email,
                    date: this.getFechaActual(),
                    time: this.getHorarioActual(),
                  };
                  this.logService.guardarLog(logAux).then(() => {
                    this.router.navigateByUrl('/');
                  });
                } else {
                  this.authService.logout();
                  this.toastService.info(
                    'Intentelo mas tarde',
                    'Especialista no validado'
                  );
                }
              } else {
                this.authService.mailActual = value.email;
                this.authService.passActual = value.password;
                const logAux: LogInterface = {
                  email: value.email,
                  date: this.getFechaActual(),
                  time: this.getHorarioActual(),
                };
                this.logService.guardarLog(logAux).then(() => {
                  this.router.navigateByUrl('/');
                  this.toastService.success('Login exitoso!');
                });
              }
            } else {
              // Si no es admin y no tiene verificación de email, hacemos logout
              this.authService.logout();
              this.toastService.info('Verifique su email!', 'Login error');
            }
          });
        })
        .catch(() => {
          this.toastService.error('Email o Password incorrecto', 'Login Error');
        });
    } else {
      this.toastService.error('Falta Captcha', 'Login Error');
    }
  }

  getFechaActual(): string {
    const fecha = new Date();
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  getHorarioActual(): string {
    const horario = new Date();
    return this.datePipe.transform(horario, 'HH:mm') || '';
  }

  cargarUsuario(option: number) {
    this.loadedField = true;
    switch (option) {
      case 1:
        this.formLogin.setValue({
          email: 'cifasi8066@abatido.com',
          password: '123123',
          captcha: this.captcha,
        });
        break;
      case 2:
        this.formLogin.setValue({
          email: '9rgymr8nlw@smykwb.com',
          password: '123123',
          captcha: this.captcha,
        });
        break;
      case 3:
        this.formLogin.setValue({
          email: 'yojec36413@bulatox.com',
          password: '123123',
          captcha: this.captcha,
        });
        break;
      case 4:
        this.formLogin.setValue({
          email: 'nexar25753@aleitar.com',
          password: '123123',
          captcha: this.captcha,
        });
        break;
      case 5:
        this.formLogin.setValue({
          email: 'pawan69453@aleitar.com',
          password: '123123',
          captcha: this.captcha,
        });
        break;
      case 6:
        this.formLogin.setValue({
          email: 'admin@admin.com',
          password: '123123',
          captcha: this.captcha,
        });
        break;
    }

    this.toastService.info('Usurario cargado', 'Login info');
  }

  obtenerImgUsuario() {
    this.authService.getUsuario('cifasi8066@abatido.com').then((r) => {
      this.imgUsuario1 = r.imagenUno;
    });
    this.authService.getUsuario('9rgymr8nlw@smykwb.com').then((r) => {
      this.imgUsuario2 = r.imagenUno;
    });
    this.authService.getUsuario('yojec36413@bulatox.com').then((r) => {
      this.imgUsuario3 = r.imagenUno;
    });
    this.authService.getUsuario('nexar25753@aleitar.com').then((r) => {
      this.imgUsuario4 = r.imagenUno;
    });
    this.authService.getUsuario('pawan69453@aleitar.com').then((r) => {
      this.imgUsuario5 = r.imagenUno;
    });
    this.authService.getUsuario('admin@admin.com').then((r) => {
      this.imgUsuario6 = r.imagenUno;
    });
  }
}
