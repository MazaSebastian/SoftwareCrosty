// Índice de servicios para CROSTY Software
import * as cajaService from './cajaService';
import * as insumosService from './insumosService';
import * as recetasService from './recetasService';
import * as ventasService from './ventasService';
import * as stockService from './stockService';
import * as reportesService from './reportesService';
import * as usuariosService from './usuariosService';
import backupService from './backupService';
import migrationService from './migrationService';
import syncService from './syncService';
import * as supabaseAdapters from './supabaseAdapters';

export { cajaService, insumosService, recetasService, ventasService, stockService, reportesService, usuariosService, backupService, migrationService, syncService, supabaseAdapters };

// Funciones específicas para backup
export const obtenerMovimientosCaja = () => {
  return cajaService.obtenerMovimientosCaja();
};

export const obtenerInsumos = () => {
  return insumosService.obtenerInsumos();
};

export const obtenerRecetas = () => {
  return recetasService.obtenerRecetas();
};

export const obtenerVentas = () => {
  return ventasService.obtenerVentas();
};

export const obtenerProductosStock = () => {
  return stockService.obtenerProductosStock();
};
