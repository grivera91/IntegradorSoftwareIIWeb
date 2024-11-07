// acciones-permisos.interface.ts
export interface AccionesPorCategoria {
    [categoria: string]: string[]; // Cada categoría tiene una lista de acciones (strings)
  }
  
  export interface AccionesPorRol {
    [rol: string]: AccionesPorCategoria; // Cada rol tiene varias categorías con sus acciones
  }
  