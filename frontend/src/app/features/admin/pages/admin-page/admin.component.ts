import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AdminService } from '../../../../core/services/admin/admin.service';

type ResourceType =
  | 'ejemplares'
  | 'ejemplarespedigree'
  | 'cachorros'
  | 'camadas';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  resourceType: ResourceType = 'ejemplares';

  imagePreviews: string[] = [];

  nombresEjemplares: string[] = [];

  nuevoRecurso: any = {};

  loading = false;

  constructor(
    private adminService: AdminService
  ) {}

  async ngOnInit(): Promise<void> {
    this.resetForm();
    await this.loadEjemplaresNames();
  }

  /*
  |--------------------------------------------------------------------------
  | INIT
  |--------------------------------------------------------------------------
  */

  resetForm(): void {

    this.imagePreviews = [];

    switch (this.resourceType) {

      case 'camadas':
        this.nuevoRecurso = {
          nombre: '',
          fechaNacimiento: '',
          imagenPadre: '',
          imagenMadre: '',
          padreNombre: '',
          madreNombre: '',
          padreId: null,
          madreId: null
        };
        break;

      case 'cachorros':
        this.nuevoRecurso = {
          nombre: '',
          raza: '',
          color: '',
          sexo: '',
          fechaNacimiento: '',
          photo: '',
          padreNombre: '',
          madreNombre: '',
          padreId: null,
          madreId: null,
          camadaId: null
        };
        break;

      default:
        this.nuevoRecurso = {
          titles: '',
          name: '',
          breed: '',
          color: '',
          sexo: '',
          photo: [],
          padreNombre: '',
          madreNombre: '',
          padreId: null,
          madreId: null,
          descripcion: ''
        };
    }
  }

async loadEjemplaresNames(): Promise<void> {

  try {

    const data: any = await firstValueFrom(
      this.adminService.getAll()
    );

    const ejemplares = [
      ...(data.ejemplares || []),
      ...(data.ejemplarespedigree || []),
      ...(data.cachorros || [])
    ];

    this.nombresEjemplares = ejemplares
      .map((e: any) => e.name || e.nombre)
      .filter(Boolean)
      .sort((a: string, b: string) =>
        a.localeCompare(b)
      );

  } catch (error) {

    console.error(
      'Error loading ejemplares names:',
      error
    );
  }
}

  /*
  |--------------------------------------------------------------------------
  | FILES
  |--------------------------------------------------------------------------
  */

  async onMultipleFilesSelected(
    event: Event
  ): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const files = Array.from(input.files);

    const previews = await Promise.all(
      files.map(file => this.readFile(file))
    );

    this.imagePreviews = previews;

    this.nuevoRecurso.photo = previews;
  }

  async onSingleFileSelected(
    event: Event,
    field: string = 'photo'
  ): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const preview = await this.readFile(
      input.files[0]
    );

    this.nuevoRecurso[field] = preview;
  }

  private readFile(
    file: File
  ): Promise<string> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = () =>
        resolve(reader.result as string);

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | IDS
  |--------------------------------------------------------------------------
  */

  async resolveParentIds(): Promise<void> {

    this.nuevoRecurso.padreId =
      await this.findIdByName(
        this.nuevoRecurso.padreNombre
      );

    this.nuevoRecurso.madreId =
      await this.findIdByName(
        this.nuevoRecurso.madreNombre
      );
  }

  async findIdByName(
    nombre: string
  ): Promise<number | null> {

    if (!nombre) return null;

    try {

      const data: any = await firstValueFrom(
        this.adminService.getAll()
      );

      const lista = [
        ...(data.ejemplares || []),
        ...(data.ejemplarespedigree || []),
        ...(data.cachorros || [])
      ];

      const encontrado = lista.find(
        (item: any) =>
          (item.name || item.nombre)
            ?.toLowerCase() ===
          nombre.toLowerCase()
      );

      return encontrado?.id || null;

    } catch (error) {

      console.error(
        'Error resolving parent ID:',
        error
      );

      return null;
    }
  }

async generateAvailableId(): Promise<number> {

  const data: any = await firstValueFrom(
    this.adminService.getAll()
  );

  const allItems = [
    ...(data.ejemplares || []),
    ...(data.ejemplarespedigree || []),
    ...(data.cachorros || []),
    ...(data.camadas || [])
  ];

  const usedIds = allItems.map(
    (i: any) => i.id
  );

  let id: number;

  switch (this.resourceType) {

    case 'camadas':
      id = 10000;
      break;

    case 'cachorros':
      id = 20000;
      break;

    case 'ejemplarespedigree':
      id = 100;
      break;

    default:
      id = 1;
      break;
  }

  while (usedIds.includes(id)) {
    id++;
  }

  return id;
}

  /*
  |--------------------------------------------------------------------------
  | IMÁGENES PADRES
  |--------------------------------------------------------------------------
  */

async cargarImagenesPadres(): Promise<void> {

  const data: any = await firstValueFrom(
    this.adminService.getAll()
  );

  const perros = [
    ...(data.ejemplares || []),
    ...(data.ejemplarespedigree || [])
  ];

  const padre = perros.find(
    (p: any) =>
      p.id === this.nuevoRecurso.padreId
  );

  const madre = perros.find(
    (p: any) =>
      p.id === this.nuevoRecurso.madreId
  );

  this.nuevoRecurso.imagenPadre =
    padre?.photo?.[0]
      ?.replace('../img/', '/assets/img/')
      || '';

  this.nuevoRecurso.imagenMadre =
    madre?.photo?.[0]
      ?.replace('../img/', '/assets/img/')
      || '';
}

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  async submit(): Promise<void> {

    try {

      this.loading = true;

      this.nuevoRecurso.id =
        await this.generateAvailableId();

      await this.resolveParentIds();

      if (
        this.resourceType === 'camadas'
      ) {
        await this.cargarImagenesPadres();
      }

      this.adminService
        .agregarRecurso(
          this.resourceType,
          this.nuevoRecurso
        )
        .subscribe({

          next: () => {

            alert(
              'Recurso agregado correctamente'
            );

            this.resetForm();

            this.loading = false;
          },

          error: (error: any) => {

            console.error(error);

            alert('Error al guardar');

            this.loading = false;
          }
        });

    } catch (error) {

      console.error(error);

      this.loading = false;
    }
  }
}

