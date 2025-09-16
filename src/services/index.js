// Índice de servicios para CROSTY Software
import * as cajaService from './cajaService';
import * as insumosService from './insumosService';
import * as recetasService from './recetasService';
import * as ventasService from './ventasService';
import * as stockService from './stockService';
import * as reportesService from './reportesService';
import backupService from './backupService';

export { cajaService, insumosService, recetasService, ventasService, stockService, reportesService, backupService };

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
