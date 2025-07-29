import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  tipoRecurso: string = 'ejemplares';
  imagePreviews: string[] = [];
  nuevoRecurso: any = this.crearNuevoRecurso();

  padreNoEncontrado: boolean = false;
  madreNoEncontrada: boolean = false;

  nombresEjemplares: string[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarNombresEjemplares();
  }

  async cargarNombresEjemplares() {
    try {
      const data: any = await firstValueFrom(this.adminService.getAll());
      const ejemplares = [...(data.ejemplares || []), ...(data.ejemplarespedigree || [])];
      this.nombresEjemplares = ejemplares
        .map((e: any) => e.name || e.nombre)
        .filter(Boolean)
        .sort((a: string, b: string) => a.localeCompare(b));  // ORDEN ALFABÉTICO
    } catch (error) {
      console.error('Error al cargar nombres de ejemplares:', error);
    }
  }

  crearNuevoRecurso() {
    if (this.tipoRecurso === 'camadas') {
      return {
        id: null,
        nombre: '',
        imagenPadre: '',
        imagenMadre: '',
        fechaNacimiento: '',
        padreId: null,
        madreId: null,
        padreNombre: '',
        madreNombre: ''
      };
    } else if (this.tipoRecurso === 'cachorros') {
      return {
        id: null,
        nombre: '',
        raza: '',
        photo: '',
        color: '',
        sexo: '',
        fechaNacimiento: '',
        padreNombre: '',
        madreNombre: '',
        padreId: null,
        madreId: null,
        camadaId: null
      };
    } else {
      return {
        id: null,
        photo: '',
        titles: '',
        name: '',
        breed: '',
        color: '',
        sexo: '',
        padreNombre: '',
        madreNombre: '',
        padreId: null,
        madreId: null,
        descripcion: ''
      };
    }
  }

  async buscarIdPorNombre(nombre: string): Promise<number | null> {
    if (!nombre) return null;

    try {
      const data: any = await firstValueFrom(this.adminService.getAll());
      if (!data) return null;

      const lista = [
        ...(data.ejemplares || []),
        ...(data.ejemplarespedigree || []),
        ...(data.cachorros || []),
        ...(data.camadas || [])
      ];
      const encontrado = lista.find(
        (e: any) => (e.name || e.nombre)?.toLowerCase() === nombre.toLowerCase()
      );

      return encontrado ? encontrado.id : null;
    } catch (error) {
      console.error(`Error buscando ID para "${nombre}":`, error);
      return null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.imagePreviews = [];
    const files = Array.from(input.files);

    const readers = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      this.imagePreviews = results;
      this.nuevoRecurso.photo = results.length === 1 ? results[0] : results;
    });
  }

  onSingleFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.nuevoRecurso.photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onPadreImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => (this.nuevoRecurso.imagenPadre = reader.result as string);
      reader.readAsDataURL(input.files[0]);
    }
  }

  onMadreImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => (this.nuevoRecurso.imagenMadre = reader.result as string);
      reader.readAsDataURL(input.files[0]);
    }
  }

  async obtenerIdDisponible(): Promise<number | null> {
    try {
      const data: any = await firstValueFrom(this.adminService.getAll());
      if (!data) return null;

      const lista = [
        ...(data.ejemplares || []),
        ...(data.ejemplarespedigree || []),
        ...(data.cachorros || []),
        ...(data.camadas || [])
      ];

      const idsUsados = lista.map((item: any) => item.id);

      for (let id = 10; id <= 100; id++) {
        if (!idsUsados.includes(id)) return id;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo IDs:', error);
      return null;
    }
  }

  async agregarRecurso() {
    this.nuevoRecurso.id = await this.obtenerIdDisponible();

    if (this.tipoRecurso === 'camadas') {
      if (!this.nuevoRecurso.nombre || !this.nuevoRecurso.fechaNacimiento) {
        alert('Completa todos los campos requeridos para la camada.');
        return;
      }

      const padreId = await this.buscarIdPorNombre(this.nuevoRecurso.padreNombre);
      const madreId = await this.buscarIdPorNombre(this.nuevoRecurso.madreNombre);

      this.nuevoRecurso.padreId = padreId;
      this.nuevoRecurso.madreId = madreId;

    } else if (this.tipoRecurso === 'cachorros') {
      if (!this.nuevoRecurso.nombre) {
        alert('El campo "nombre" es obligatorio para cachorros.');
        return;
      }

      const padreId = await this.buscarIdPorNombre(this.nuevoRecurso.padreNombre);
      const madreId = await this.buscarIdPorNombre(this.nuevoRecurso.madreNombre);
      this.nuevoRecurso.padreId = padreId;
      this.nuevoRecurso.madreId = madreId;

      if (!this.nuevoRecurso.camadaId) {
        alert('Completa el campo "ID de la camada".');
        return;
      }

    } else {
      if (!this.nuevoRecurso.name) {
        alert('El campo "nombre" es obligatorio.');
        return;
      }

      const padreId = await this.buscarIdPorNombre(this.nuevoRecurso.padreNombre);
      const madreId = await this.buscarIdPorNombre(this.nuevoRecurso.madreNombre);

      this.nuevoRecurso.padreId = padreId;
      this.nuevoRecurso.madreId = madreId;
    }

    this.adminService.agregarRecurso(this.tipoRecurso, this.nuevoRecurso).subscribe({
      next: () => {
        alert('Recurso agregado exitosamente');
        this.nuevoRecurso = this.crearNuevoRecurso();
        this.imagePreviews = [];
      },
      error: (err) => {
        console.error('Error al agregar el recurso:', err);
        alert('Error al agregar el recurso. Intenta nuevamente.');
      }
    });
  }
}


