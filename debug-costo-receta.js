// Script de debugging para analizar el costo de la receta "Tarta de Jamón y Queso"
// Ejecutar en la consola del navegador en la página de Recetas

console.log('🔍 DEBUGGING: Análisis del costo de la receta');

// Función para simular el cálculo de costo
function debugCostoReceta() {
  console.log('📊 INGREDIENTES DE LA RECETA:');
  console.log('1. Huevos: 2 unidad');
  console.log('2. Queso Crema: 25 g');
  console.log('3. Jamón Cocido Monte Carolina: 125 g');
  console.log('4. Queso Muzzarella Dom Tim: 100 g');
  
  console.log('\n💰 PRECIOS ACTUALES DE INSUMOS (después de la corrección):');
  console.log('• Huevos: $189,00 por unidad (antes era $5.690 por maple de 30)');
  console.log('• Queso Crema: $8.400,00 por kg (antes era $33.675 por 4kg)');
  console.log('• Jamón: $14.215,00 por kg (antes era $56.860 por 4kg)');
  console.log('• Queso: $6.670,50 por kg (antes era $26.682 por 4kg)');
  
  console.log('\n🧮 CÁLCULO PASO A PASO:');
  
  // 1. Huevos: 2 unidades × $189 = $378
  const costoHuevos = 2 * 189;
  console.log(`1. Huevos: 2 × $189 = $${costoHuevos}`);
  
  // 2. Queso Crema: 25g = 0.025kg × $8.400 = $210
  const costoQuesoCrema = (25 / 1000) * 8400;
  console.log(`2. Queso Crema: 25g = 0.025kg × $8.400 = $${costoQuesoCrema}`);
  
  // 3. Jamón: 125g = 0.125kg × $14.215 = $1.776.88
  const costoJamon = (125 / 1000) * 14215;
  console.log(`3. Jamón: 125g = 0.125kg × $14.215 = $${costoJamon.toFixed(2)}`);
  
  // 4. Queso: 100g = 0.1kg × $6.670.50 = $667.05
  const costoQueso = (100 / 1000) * 6670.50;
  console.log(`4. Queso: 100g = 0.1kg × $6.670.50 = $${costoQueso.toFixed(2)}`);
  
  const costoTotal = costoHuevos + costoQuesoCrema + costoJamon + costoQueso;
  console.log(`\n💵 COSTO TOTAL CALCULADO: $${costoTotal.toFixed(2)}`);
  
  console.log('\n❓ ¿POR QUÉ APARECE $2?');
  console.log('Posibles causas:');
  console.log('1. Los precios de insumos no se actualizaron correctamente');
  console.log('2. La función de cálculo no está usando los precios correctos');
  console.log('3. Hay un problema en la conversión de unidades');
  console.log('4. Los datos de Supabase no se están leyendo correctamente');
  
  return {
    costoHuevos,
    costoQuesoCrema,
    costoJamon,
    costoQueso,
    costoTotal
  };
}

// Ejecutar el debugging
const resultado = debugCostoReceta();

console.log('\n🎯 RESULTADO ESPERADO:');
console.log(`Costo total debería ser: $${resultado.costoTotal.toFixed(2)}`);
console.log('Pero aparece: $2');
console.log('\n🔧 PRÓXIMOS PASOS:');
console.log('1. Verificar que los precios de insumos se actualizaron');
console.log('2. Revisar la función calcularCostoReceta');
console.log('3. Verificar la conversión de unidades');
console.log('4. Comprobar que los datos de Supabase se leen correctamente');
