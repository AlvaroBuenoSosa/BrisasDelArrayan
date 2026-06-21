import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { normalizeImageUrl } from '../../../../shared/utils/image-url.util';

type ResourceType =
  | 'ejemplares'
  | 'ejemplarespedigree'
  | 'cachorros'
  | 'camadas';

type Accion = 'crear' | 'editar' | 'eliminar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  resourceType: ResourceType = 'ejemplares';
  accion: Accion = 'crear';

  loading = false;

  imagePreviews: string[] = [];
  selectedFiles: File[] = [];

  machos: any[] = [];
  hembras: any[] = [];

  todosLosRecursos: any[] = [];
  resultadosBusqueda: any[] = [];

  idSeleccionado: number | null = null;
  nombreBusqueda = '';

  nuevoRecurso: any = {};
  recursoSeleccionado: any = null;

  constructor(private adminService: AdminService) {}

  async ngOnInit(): Promise<void> {
    this.resetForm();

    try {
      await Promise.all([
        this.loadEjemplaresNames(),
        this.cargarTodosLosRecursos()
      ]);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar los datos del administrador');
    }
  }

  resetForm(): void {
    this.recursoSeleccionado = null;
    this.imagePreviews = [];
    this.selectedFiles = [];
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

  case 'ejemplares':
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
      madreId: null
    };
    break;

  case 'ejemplarespedigree':
    this.nuevoRecurso = {
      titles: '',
      name: '',
      breed: '',
      color: '',
      gender: '',
      photo: [],
      padreNombre: '',
      madreNombre: '',
      padreId: null,
      madreId: null
    };
    break;
}

    this.filtrarResultados();
  }

  async loadEjemplaresNames(): Promise<void> {
    const data: any = await firstValueFrom(this.adminService.getAll());

    const ejemplares = [
      ...(data.ejemplares || []),
      ...(data.ejemplarespedigree || []),
      ...(data.cachorros || [])
    ];

this.machos = ejemplares
  .filter((e: any) => e.sexo === 'Macho' || e.gender === 'Male')
  .sort((a: any, b: any) =>
    this.getNombre(a).localeCompare(this.getNombre(b))
  );

this.hembras = ejemplares
  .filter((e: any) => e.sexo === 'Hembra' || e.gender === 'Female')
  .sort((a: any, b: any) =>
    this.getNombre(a).localeCompare(this.getNombre(b))
  );
  }

  private async asegurarPadresCargados(): Promise<void> {
  if (this.machos.length && this.hembras.length) {
    return;
  }

  await this.loadEjemplaresNames();
}

  async onMultipleFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const nuevosArchivos = Array.from(input.files);
    const nuevosPreviews = await Promise.all(
      nuevosArchivos.map(file => this.readFile(file))
    );

    this.selectedFiles = [...this.selectedFiles, ...nuevosArchivos];
    this.imagePreviews = [...this.imagePreviews, ...nuevosPreviews];

    input.value = '';
  }

  deleteImage(index: number): void {
    const fotosActuales = Array.isArray(this.nuevoRecurso.photo)
      ? this.nuevoRecurso.photo
      : [];

    const fotosExistentes = fotosActuales.length;

    if (index < fotosExistentes) {
      this.nuevoRecurso.photo.splice(index, 1);
    } else {
      const archivoIndex = index - fotosExistentes;
      this.selectedFiles.splice(archivoIndex, 1);
    }

    this.imagePreviews.splice(index, 1);
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  async findIdByName(nombre: string): Promise<number | null> {
    if (!nombre?.trim()) {
      return null;
    }

    const data: any = await firstValueFrom(this.adminService.getAll());

    const lista = [
      ...(data.ejemplares || []),
      ...(data.ejemplarespedigree || []),
      ...(data.cachorros || [])
    ];

    const encontrado = lista.find(
      (item: any) =>
        this.getNombre(item).toLowerCase() === nombre.trim().toLowerCase()
    );

    return encontrado?.id ?? null;
  }

  async resolveParentIds(): Promise<void> {
    this.nuevoRecurso.padreId = await this.findIdByName(
      this.nuevoRecurso.padreNombre
    );

    this.nuevoRecurso.madreId = await this.findIdByName(
      this.nuevoRecurso.madreNombre
    );
  }

  async generateAvailableId(): Promise<number> {
    const data: any = await firstValueFrom(this.adminService.getAll());

    const usados = [
      ...(data.ejemplares || []),
      ...(data.ejemplarespedigree || []),
      ...(data.cachorros || []),
      ...(data.camadas || [])
    ]
      .map((item: any) => Number(item.id))
      .filter((id: number) => !Number.isNaN(id));

    let id = 1;

    if (this.resourceType === 'ejemplarespedigree') {
      id = 100;
    } else if (this.resourceType === 'camadas') {
      id = 10000;
    } else if (this.resourceType === 'cachorros') {
      id = 20000;
    }

    while (usados.includes(id)) {
      id++;
    }

    return id;
  }

async seleccionarResultado(): Promise<void> {
  const seleccionado = this.resultadosBusqueda.find(
    item => item.id === Number(this.idSeleccionado)
  );

  if (!seleccionado) {
    this.recursoSeleccionado = null;
    return;
  }

  await this.asegurarPadresCargados();

  this.cargarRecursoEnFormulario(seleccionado);
}

private cargarRecursoEnFormulario(recurso: any): void {
  this.recursoSeleccionado = recurso;

  const padre = this.machos.find(
    perro => Number(perro.id) === Number(recurso.padreId)
  );

  const madre = this.hembras.find(
    perra => Number(perra.id) === Number(recurso.madreId)
  );

  this.nuevoRecurso = {
    ...recurso,
    photo: this.normalizarFotos(recurso.photo),

    padreNombre:
      recurso.padreNombre ||
      recurso.padre ||
      (padre ? this.getNombre(padre) : ''),

    madreNombre:
      recurso.madreNombre ||
      recurso.madre ||
      (madre ? this.getNombre(madre) : '')
  };

  // EJEMPLARES: la base de datos usa sexo
  if (this.resourceType === 'ejemplares' && !this.nuevoRecurso.sexo) {
    this.nuevoRecurso.sexo =
      this.nuevoRecurso.gender === 'Female' ? 'Hembra' : 'Macho';
  }

  // CACHORROS: la base de datos usa sexo
  if (this.resourceType === 'cachorros' && !this.nuevoRecurso.sexo) {
    this.nuevoRecurso.sexo =
      this.nuevoRecurso.gender === 'Female' ? 'Hembra' : 'Macho';
  }

  // PEDIGREE: la base de datos usa gender
  if (
    this.resourceType === 'ejemplarespedigree' &&
    !this.nuevoRecurso.gender
  ) {
    this.nuevoRecurso.gender =
      this.nuevoRecurso.sexo === 'Hembra' ? 'Female' : 'Male';
  }

  this.selectedFiles = [];

  this.imagePreviews = this.nuevoRecurso.photo.map((imagen: string) =>
    this.getImageUrl(imagen)
  );
}

  private getImageUrl(image: string | undefined | null): string {
    return normalizeImageUrl(image);
  }

  private normalizarFotos(photo: unknown): string[] {
    if (Array.isArray(photo)) {
      return photo.filter(Boolean);
    }

    return photo ? [String(photo)] : [];
  }

  private getNombre(item: any): string {
    return String(item?.name || item?.nombre || '');
  }

  async onSubmit(): Promise<void> {
    if (this.accion === 'editar') {
      await this.guardarCambios();
      return;
    }

    if (this.accion !== 'crear') {
      return;
    }

    this.loading = true;

    try {
      await this.resolveParentIds();

      const payload = await this.prepararPayload(true);

      payload.id = await this.generateAvailableId();

      await firstValueFrom(
        this.adminService.agregarRecurso(this.resourceType, payload)
      );

      alert('Creado correctamente');

      await this.recargarDatos();
      this.accion = 'crear';
      this.resetForm();
    } catch (error) {
      console.error(error);
      alert('Error al crear el recurso');
    } finally {
      this.loading = false;
    }
  }

  async guardarCambios(): Promise<void> {
    if (!this.recursoSeleccionado?.id) {
      return;
    }

    this.loading = true;

    try {
      await this.resolveParentIds();

      const payload = await this.prepararPayload(false);
      payload.id = this.recursoSeleccionado.id;

      await firstValueFrom(
        this.adminService.actualizarRecurso(
          this.resourceType,
          this.recursoSeleccionado.id,
          payload
        )
      );

      alert('Actualizado correctamente');

      await this.recargarDatos();
      this.accion = 'crear';
      this.resetForm();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el recurso');
    } finally {
      this.loading = false;
    }
  }

private async prepararPayload(esCreacion: boolean): Promise<any> {
  const payload = {
    ...this.nuevoRecurso,
    photo: this.normalizarFotos(this.nuevoRecurso.photo)
  };

  if (this.selectedFiles.length) {
    const nuevasFotos = await firstValueFrom(
      this.adminService.uploadImages(this.selectedFiles)
    );

    payload.photo = esCreacion
      ? nuevasFotos
      : [...payload.photo, ...nuevasFotos];
  }

  // CAMADAS: no tienen fotos, sexo ni gender
  if (this.resourceType === 'camadas') {
    delete payload.photo;
    delete payload.sexo;
    delete payload.gender;

    return payload;
  }

  // CACHORROS: usan sexo, nunca gender
  if (this.resourceType === 'cachorros') {
    payload.sexo = payload.sexo || 'Macho';
    delete payload.gender;

    return payload;
  }

  // EJEMPLARES: usan sexo, nunca gender
  if (this.resourceType === 'ejemplares') {
    payload.sexo = payload.sexo || 'Macho';
    delete payload.gender;

    return payload;
  }

  // PEDIGREE: usa gender, nunca sexo
  if (this.resourceType === 'ejemplarespedigree') {
    payload.gender = payload.gender || 'Male';
    delete payload.sexo;

    return payload;
  }

  return payload;
}

  async eliminarActual(): Promise<void> {
    if (!this.recursoSeleccionado?.id) {
      return;
    }

    const confirmar = confirm(
      `¿Seguro que quieres eliminar "${this.getNombre(this.recursoSeleccionado)}"?`
    );

    if (!confirmar) {
      return;
    }

    this.loading = true;

    try {
      await firstValueFrom(
        this.adminService.eliminarPorId(
          this.resourceType,
          this.recursoSeleccionado.id
        )
      );

      alert('Eliminado correctamente');

      await this.recargarDatos();
      this.accion = 'crear';
      this.resetForm();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el recurso');
    } finally {
      this.loading = false;
    }
  }

  async cargarTodosLosRecursos(): Promise<void> {
    const data: any = await firstValueFrom(this.adminService.getAll());

    this.todosLosRecursos = [
      ...(data.ejemplares || []).map((item: any) => ({
        ...item,
        tipo: 'ejemplares'
      })),
      ...(data.ejemplarespedigree || []).map((item: any) => ({
        ...item,
        tipo: 'ejemplarespedigree'
      })),
      ...(data.cachorros || []).map((item: any) => ({
        ...item,
        tipo: 'cachorros'
      })),
      ...(data.camadas || []).map((item: any) => ({
        ...item,
        tipo: 'camadas'
      }))
    ];

    this.filtrarResultados();
  }

  filtrarResultados(): void {
    const termino = this.nombreBusqueda.trim().toLowerCase();

    this.resultadosBusqueda = this.todosLosRecursos.filter(item => {
      if (item.tipo !== this.resourceType) {
        return false;
      }

      return this.getNombre(item).toLowerCase().includes(termino);
    });
  }

  private async recargarDatos(): Promise<void> {
    await Promise.all([
      this.cargarTodosLosRecursos(),
      this.loadEjemplaresNames()
    ]);
  }
}

