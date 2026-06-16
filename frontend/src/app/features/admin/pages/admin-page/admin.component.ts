import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { environment } from '../../../../../environments/environment';
import { normalizeImageUrl } from '../../../../shared/utils/image-url.util';

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

  accion: 'crear' | 'editar' | 'eliminar' = 'crear';

  loading = false;

  imagePreviews: string[] = [];

  nombresEjemplares: string[] = [];

  machos: any[] = [];

  hembras: any[] = [];

  todosLosRecursos: any[] = [];

  resultadosBusqueda: any[] = [];

  selectedFiles: File[] = [];

  idSeleccionado: number | null = null;

  nombreBusqueda = '';

  nuevoRecurso: any = {};

  recursoSeleccionado: any = null;

  modoEdicion = false;

  constructor(private adminService: AdminService) {}

  async ngOnInit(): Promise<void> {
    this.resetForm();
    await this.loadEjemplaresNames();
    await this.cargarTodosLosRecursos();
  }

  // =========================
  // RESET
  // =========================
  resetForm(): void {
    this.recursoSeleccionado = null;
    this.imagePreviews = [];
    this.nombreBusqueda = '';
    this.idSeleccionado = null;
    this.resultadosBusqueda = [];

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
        };
    }

    if (this.todosLosRecursos.length) {
      this.filtrarResultados();
    }
  }

  // =========================
  // LOAD NAMES
  // =========================
async loadEjemplaresNames(): Promise<void> {

  const data: any =
    await firstValueFrom(
      this.adminService.getAll()
    );

  const ejemplares = [

    ...(data.ejemplares || []),

    ...(data.ejemplarespedigree || []),

    ...(data.cachorros || [])

  ];

  this.machos = ejemplares
    .filter((e: any) =>
      e.gender === 'Male' ||
      e.sexo === 'Macho'
    )
    .sort((a: any, b: any) => {
      const aName = (a.name || a.nombre || '').toString();
      const bName = (b.name || b.nombre || '').toString();
      return aName.localeCompare(bName);
    });

  this.hembras = ejemplares
    .filter((e: any) =>
      e.gender === 'Female' ||
      e.sexo === 'Hembra'
    )
    .sort((a: any, b: any) => {
      const aName = (a.name || a.nombre || '').toString();
      const bName = (b.name || b.nombre || '').toString();
      return aName.localeCompare(bName);
    });
}

  // =========================
  // FILES
  // =========================
async onMultipleFilesSelected(event: Event): Promise<void> {

  const input = event.target as HTMLInputElement;

  if (!input.files?.length) return;

  this.selectedFiles = Array.from(input.files);

  this.imagePreviews = await Promise.all(
    this.selectedFiles.map(f => this.readFile(f))
  );
}

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // =========================
  // IDS
  // =========================
  async findIdByName(nombre: string): Promise<number | null> {
    if (!nombre) return null;

    const data: any = await firstValueFrom(this.adminService.getAll());

    const lista = [
      ...(data.ejemplares || []),
      ...(data.ejemplarespedigree || []),
      ...(data.cachorros || [])
    ];

    const found = lista.find(
      (i: any) => (i.name || i.nombre)?.toLowerCase() === nombre.toLowerCase()
    );

    return found?.id || null;
  }

  async resolveParentIds(): Promise<void> {
    this.nuevoRecurso.padreId = await this.findIdByName(this.nuevoRecurso.padreNombre);
    this.nuevoRecurso.madreId = await this.findIdByName(this.nuevoRecurso.madreNombre);
  }

  async generateAvailableId(): Promise<number> {
    const data: any = await firstValueFrom(this.adminService.getAll());

    const used = [
      ...(data.ejemplares || []),
      ...(data.ejemplarespedigree || []),
      ...(data.cachorros || []),
      ...(data.camadas || [])
    ].map((i: any) => i.id);

    let id = this.resourceType === 'camadas'
      ? 10000
      : this.resourceType === 'cachorros'
        ? 20000
        : this.resourceType === 'ejemplarespedigree'
          ? 100
          : 1;

    while (used.includes(id)) id++;

    return id;
  }

  // =========================
  // SEARCH
  // =========================
async cargarPorNombre() {

  const data: any =
    await firstValueFrom(
      this.adminService.getAll()
    );

  const lista = data[this.resourceType];

  const encontrado = lista.find(
    (i: any) =>
      (i.name || i.nombre)
        ?.toLowerCase() ===
      this.nombreBusqueda.toLowerCase()
  );

  if (!encontrado) {
    return alert('No encontrado');
  }

  this.recursoSeleccionado = encontrado;

  this.nuevoRecurso = {
    ...encontrado
  };

  // Convertir gender -> sexo para el formulario
  if (
    !this.nuevoRecurso.sexo &&
    this.nuevoRecurso.gender
  ) {

    this.nuevoRecurso.sexo =
      this.nuevoRecurso.gender === 'Female'
        ? 'Hembra'
        : 'Macho';
  }

  this.imagePreviews = Array.isArray(encontrado.photo)
    ? (encontrado.photo as string[]).map((image: string) => this.getImageUrl(image))
    : [this.getImageUrl(encontrado.photo)];

  this.accion = 'editar';
}

seleccionarResultado(): void {

  const sel = this.resultadosBusqueda.find(
    i => i.id === Number(this.idSeleccionado)
  );

  if (!sel) return;

  this.recursoSeleccionado = sel;

  this.nuevoRecurso = { ...sel };

  if (!this.nuevoRecurso.gender) {

    if (this.nuevoRecurso.sexo === 'Macho') {
      this.nuevoRecurso.gender = 'Male';
    }

    if (this.nuevoRecurso.sexo === 'Hembra') {
      this.nuevoRecurso.gender = 'Female';
    }

  }

  this.imagePreviews = Array.isArray(sel.photo)
    ? (sel.photo as string[]).map((image: string) => this.getImageUrl(image))
    : [this.getImageUrl(sel.photo)];

}

  private getImageUrl(image: string | undefined | null): string {
    return normalizeImageUrl(image);
  }


  // =========================
  // CREATE / UPDATE CONTROL
  // =========================
async onSubmit(): Promise<void> {

  this.loading = true;

  try {

    await this.resolveParentIds();

     // =========================
    // SUBIR IMÁGENES AL BACKEND
    // =========================

    if (this.selectedFiles?.length) {

      const uploadedImages =
        await firstValueFrom(
          this.adminService.uploadImages(
            this.selectedFiles
          )
        );

        console.log(this.selectedFiles);

      this.nuevoRecurso.photo = uploadedImages;
    }

    // ==================================
    // CONVERTIR SEXO SEGÚN TIPO
    // ==================================

    if (this.resourceType === 'ejemplarespedigree') {

      this.nuevoRecurso.gender =
        this.nuevoRecurso.gender || 'Male';

      delete this.nuevoRecurso.sexo;

    } else {

      this.nuevoRecurso.sexo =
        this.nuevoRecurso.gender === 'Female'
          ? 'Hembra'
          : 'Macho';

      delete this.nuevoRecurso.gender;
    }

    if (this.accion === 'crear') {

      this.nuevoRecurso.id =
        await this.generateAvailableId();

      this.adminService
        .agregarRecurso(
          this.resourceType,
          this.nuevoRecurso
        )
        .subscribe({
          next: () => {
            alert('Creado correctamente');
            this.resetForm();
            this.loading = false;
          },
          error: () => this.loading = false
        });
    }

  } catch (e) {
    console.error(e);
    this.loading = false;
  }
}

  guardarCambios(): void {
    if (!this.recursoSeleccionado?.id) return;

    const payload = {
      ...this.nuevoRecurso,
      id: this.recursoSeleccionado.id
    };

    this.adminService
      .actualizarRecurso(this.resourceType, this.recursoSeleccionado.id, payload)
      .subscribe({
        next: () => {
          alert('Actualizado correctamente');
          this.resetForm();
          this.accion = 'crear';
        },
        error: err => console.error(err)
      });
  }

  eliminarActual(): void {
    if (!this.recursoSeleccionado) return;

    this.adminService
      .eliminarPorId(this.resourceType, this.recursoSeleccionado.id)
      .subscribe({
        next: () => {
          alert('Eliminado');
          this.resetForm();
          this.accion = 'crear';
        }
      });
  }

  async cargarTodosLosRecursos(): Promise<void> {
    const data: any = await firstValueFrom(this.adminService.getAll());

    this.todosLosRecursos = [
      ...(data.ejemplares || []).map((i: any) => ({ ...i, tipo: 'ejemplares' })),
      ...(data.ejemplarespedigree || []).map((i: any) => ({ ...i, tipo: 'ejemplarespedigree' })),
      ...(data.cachorros || []).map((i: any) => ({ ...i, tipo: 'cachorros' })),
      ...(data.camadas || []).map((i: any) => ({ ...i, tipo: 'camadas' }))
    ];

    this.filtrarResultados();
  }

  filtrarResultados(): void {
    const t = this.nombreBusqueda.toLowerCase();

    this.resultadosBusqueda = this.todosLosRecursos.filter(i => {
      if (i.tipo !== this.resourceType) return false;

      const n = (i.name || i.nombre || '').toLowerCase();
      return n.includes(t);
    });
  }

  
}

