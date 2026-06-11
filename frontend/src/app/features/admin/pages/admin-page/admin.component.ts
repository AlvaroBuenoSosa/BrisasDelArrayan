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

  accion: 'crear' | 'editar' | 'eliminar' =
    'crear';

  loading = false;

  imagePreviews: string[] = [];

  nombresEjemplares: string[] = [];

  todosLosRecursos: any[] = [];

  resultadosBusqueda: any[] = [];

  idSeleccionado: number | null = null;

  nombreBusqueda = '';

  nuevoRecurso: any = {};

  recursoSeleccionado: any = null;

  modoEdicion = false;

  constructor(
    private adminService: AdminService
  ) {}

async ngOnInit(): Promise<void> {

  this.resetForm();

  await this.loadEjemplaresNames();

  await this.cargarTodosLosRecursos();
}

  /*
  |--------------------------------------------------------------------------
  | INIT
  |--------------------------------------------------------------------------
  */

resetForm(): void {

  this.recursoSeleccionado = null;

  this.imagePreviews = [];

  this.recursoSeleccionado = null;

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
        photo: [],
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
      ?.replace('../img/', '/assets/img/ejemplares')
      || '';

  this.nuevoRecurso.imagenMadre =
    madre?.photo?.[0]
      ?.replace('../img/', '/assets/img/ejemplares')
      || '';
}

  /*
  |--------------------------------------------------------------------------
  | Resolve Camada ID for Cachorros
  |--------------------------------------------------------------------------
  */

async resolveCamadaId(): Promise<void> {

  if (this.resourceType !== 'cachorros') {
    return;
  }

  const data: any = await firstValueFrom(
    this.adminService.getAll()
  );

  const camadas = data.camadas || [];

  const camada = camadas.find(
    (c: any) =>
      Number(c.padreId) === Number(this.nuevoRecurso.padreId) &&
      Number(c.madreId) === Number(this.nuevoRecurso.madreId)
  );

  console.log('Camada encontrada:', camada);

  this.nuevoRecurso.camadaId =
    camada?.id ?? null;
}

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  async onSubmit(): Promise<void> {

    try {

      this.loading = true;

      this.nuevoRecurso.id =
        await this.generateAvailableId();

      await this.resolveParentIds();

if (this.resourceType === 'cachorros') {
  await this.resolveCamadaId();
}

if (this.resourceType === 'camadas') {
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

  async cargarPorNombre() {

  const data: any =
    await firstValueFrom(
      this.adminService.getAll()
    );

  const lista =
    data[this.resourceType];

  const encontrado = lista.find(
    (item: any) =>
      (
        item.name ||
        item.nombre
      )?.toLowerCase() ===
      this.nombreBusqueda.toLowerCase()
  );

  if (!encontrado) {

    alert('No encontrado');

    return;
  }

  this.modoEdicion = true;

  this.recursoSeleccionado =
    encontrado;

  this.nuevoRecurso = {
    ...encontrado,
    id: encontrado.id
  };

  this.imagePreviews =
    Array.isArray(encontrado.photo)
      ? encontrado.photo
      : [encontrado.photo];
}

guardarCambios(): void {

  if (!this.recursoSeleccionado?.id) {
    alert('No hay recurso seleccionado');
    return;
  }

  const payload = {
    ...this.nuevoRecurso,
    id: this.recursoSeleccionado.id
  };

  this.adminService
    .actualizarRecurso(
      this.resourceType,
      this.recursoSeleccionado.id,
      payload
    )
    .subscribe({

      next: () => {

        alert('Actualizado correctamente');

        this.resetForm();

        this.recursoSeleccionado = null;

        this.accion = 'crear';
      },

      error: err => {

        console.error(err);

        alert('Error actualizando');
      }
    });
}

eliminarActual(): void {

  if (!this.recursoSeleccionado) {
    return;
  }

  const nombre =
    this.recursoSeleccionado.name ||
    this.recursoSeleccionado.nombre;

  if (
    !confirm(
      `Eliminar ${nombre}?`
    )
  ) {
    return;
  }

  this.adminService
    .eliminarPorId(
      this.resourceType,
      this.recursoSeleccionado.id
    )
    .subscribe({

      next: () => {

        alert('Eliminado');

        this.resetForm();

        this.recursoSeleccionado =
          null;

        this.resultadosBusqueda = [];

        this.nombreBusqueda = '';
      },

      error: err => {

        console.error(err);

        alert(
          'Error eliminando'
        );
      }
    });
}

filtrarResultados(): void {

  const texto =
    this.nombreBusqueda.toLowerCase();

  this.resultadosBusqueda =
    this.todosLosRecursos.filter((item: any) => {

      if (item.tipo !== this.resourceType) {
        return false;
      }

      const nombre =
        (
          item.name ||
          item.nombre ||
          ''
        ).toLowerCase();

      return nombre.includes(texto);
    });
}

seleccionarResultado(): void {

  const seleccionado =
    this.resultadosBusqueda.find(
      item =>
        item.id === Number(this.idSeleccionado)
    );

  if (!seleccionado) return;

  this.recursoSeleccionado = seleccionado;

  this.nuevoRecurso = {
    ...seleccionado,
    id: seleccionado.id
  };

  this.imagePreviews =
    seleccionado.photo
      ? (Array.isArray(seleccionado.photo)
          ? seleccionado.photo
          : [seleccionado.photo])
      : [];

  this.accion = 'editar';
}

async cargarTodosLosRecursos(): Promise<void> {

  const data: any = await firstValueFrom(
    this.adminService.getAll()
  );

  this.todosLosRecursos = [
    ...(data.ejemplares || []).map((i: any) => ({
      ...i,
      tipo: 'ejemplares'
    })),

    ...(data.ejemplarespedigree || []).map((i: any) => ({
      ...i,
      tipo: 'ejemplarespedigree'
    })),

    ...(data.cachorros || []).map((i: any) => ({
      ...i,
      tipo: 'cachorros'
    })),

    ...(data.camadas || []).map((i: any) => ({
      ...i,
      tipo: 'camadas'
    }))
  ];

  this.filtrarResultados();
}

async recargarBusqueda(): Promise<void> {

  await this.cargarTodosLosRecursos();

  this.filtrarResultados();
}
}

