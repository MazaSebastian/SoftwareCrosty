// Script para convertir CSV de Caja Diaria al formato de Supabase
// Ejecutar en Node.js: node convertir-csv-caja.js

const fs = require('fs');
const path = require('path');

// Función para convertir el CSV
function convertirCSV() {
  try {
    // Leer el archivo CSV original
    const csvContent = `id	type	concept	amount	date	created_at
mov-1755653103867	EGRESO	[Sebastian] 1er Pedido verduras + Papelera + Frigorifico + Bolsas Gofradas	166732	2025-08-20	2025-08-20 01:25:04.859734+00
mov-1755653121508	INGRESO	[Sebastian] Venta (esta plata me la diste a mi)	55000	2025-08-20	2025-08-20 01:25:21.724146+00
mov-1755653131264	INGRESO	[Sebastian] VENTA (esta plata me la diste a mi)	20000	2025-08-20	2025-08-20 01:25:31.757007+00
mov-1755653400237	EGRESO	[Sebastian] 2do Pedido de verduras + Frigorifico	86000	2025-08-20	2025-08-20 01:30:00.700417+00
mov-1755653414932	INGRESO	[Sebastian] Venta	65000	2025-08-20	2025-08-20 01:30:15.1542+00
mov-1755715623809	INGRESO	[Sebastian] VENTA (esta plata me la diste a mi)	20000	2025-08-20	2025-08-20 18:47:03.990303+00
mov-1755724897317	INGRESO	[Sebastian] VENTA (esta plata me la diste a mi)	54000	2025-08-20	2025-08-20 21:21:37.557702+00
mov-1755784810627	INGRESO	[Sebastian] VENTA	7000	2025-08-21	2025-08-21 14:00:10.77749+00
mov-1756163168885	EGRESO	[Sebastian] 3er Pedido VERDULERIA	71232	2025-08-25	2025-08-25 23:06:09.126608+00
mov-1756163190572	INGRESO	[Sebastian] VENTA	82000	2025-08-25	2025-08-25 23:06:30.728956+00
mov-1756229708461	EGRESO	[Sebastian] Frigorifico	65000	2025-08-26	2025-08-26 17:35:08.611071+00
mov-1756229717894	EGRESO	[Sebastian] Pollo	17200	2025-08-26	2025-08-26 17:35:18.05282+00
mov-1756310671765	INGRESO	[Sebastian] Venta (esta plata me la diste a mi)	20000	2025-08-27	2025-08-27 16:04:32.913332+00
mov-1756324271576	EGRESO	[Sebastian] Segunda compra bolsas gofradas	55000	2025-08-27	2025-08-27 19:51:11.712344+00
mov-1756563810497	INGRESO	[Sebastian] VENTA	80000	2025-08-30	2025-08-30 14:23:30.79425+00
mov-1756563819250	EGRESO	[Sebastian] VENTA	20000	2025-08-30	2025-08-30 14:23:39.556703+00
mov-1756563854969	INGRESO	[Sebastian] CORRECCIÓN DE SALDO, me equivoque	20000	2025-08-30	2025-08-30 14:24:15.294152+00
mov-1756563870685	INGRESO	[Sebastian] VENTA (ahora si)	20000	2025-08-30	2025-08-30 14:24:31.020225+00
mov-1756755016863	EGRESO	[Sebastian] Frigorífico	93000	2025-09-01	2025-09-01 19:30:17.100266+00
mov-1756845869822	INGRESO	[Sebastian] Venta	35000	2025-09-02	2025-09-02 20:44:30.008387+00
mov-1756914409907	EGRESO	[Sebastian] Frigorífico fiambres	106000	2025-09-03	2025-09-03 15:46:50.418611+00
mov-1756927604270	INGRESO	[Sebastian] Venta fer (esta plata me la diste a mi)	20000	2025-09-03	2025-09-03 19:26:44.081235+00
mov-1756943354569	EGRESO	[Sebastian] 5 packs de tapas + 2 maples de huevos	30000	2025-09-03	2025-09-03 23:49:15.79388+00
mov-1757080960637	EGRESO	[Santiago] Pollos tomi barf	75000	2025-09-05	2025-09-05 14:02:41.93491+00
mov-1757178459200	INGRESO	[Sebastian] Venta	20000	2025-09-06	2025-09-06 17:07:39.867476+00
mov-1757378618985	EGRESO	[Sebastian] 30 tapas tartas	11490	2025-09-09	2025-09-09 00:43:39.59209+00
mov-1757378643966	EGRESO	[Sebastian] Frigorifico huevos	10500	2025-09-09	2025-09-09 00:44:04.643761+00
mov-1757378692913	EGRESO	[Sebastian] Atún 13 latas makro	21437	2025-09-09	2025-09-09 00:44:54.116116+00
mov-1757385124103	INGRESO	[Santiago] 1er pago Pollos cafe Nuñez (Fiorella)	23750	2025-09-09	2025-09-09 02:32:04.619105+00
mov-1757419938684	EGRESO	[Santiago] Freezer 1/3	294200	2025-09-09	2025-09-09 12:12:17.24263+00
mov-1757420111665	INGRESO	[Santiago] Venta coni 6 tartas	38000	2025-09-09	2025-09-09 12:15:10.40277+00
mov-1757420130262	INGRESO	[Santiago] Venta emi 6 tartas	35000	2025-09-09	2025-09-09 12:15:28.407466+00
mov-1757423377260	INGRESO	[Santiago] Venta caro 6 tartas	38000	2025-09-09	2025-09-09 13:09:35.214398+00
mov-1757450908384	EGRESO	[Sebastian] 2kg puerro	7658	2025-09-09	2025-09-09 20:48:28.69854+00
mov-1757450932069	EGRESO	[Sebastian] Tapas delitap	19000	2025-09-09	2025-09-09 20:48:52.311778+00
mov-1757457811619	INGRESO	[Sebastian] Venta megstlon primer pago	118400	2025-09-09	2025-09-09 22:43:31.805429+00
mov-1757521088997	INGRESO	[Sebastian] Devolución selladora manchester	76000	2025-09-10	2025-09-10 16:18:09.134114+00
mov-1757521102494	EGRESO	[Sebastian] Compra ítems varios cocina	33000	2025-09-10	2025-09-10 16:18:22.641182+00
mov-1757681012892	EGRESO	[Sebastian] Caja tapas delitap fabrica	76600	2025-09-12	2025-09-12 12:43:33.08468+00
mov-1757682391849	EGRESO	[Sebastian] Pedido verduras nuevo + pedido anterior pagado	183500	2025-09-12	2025-09-12 13:06:32.849104+00
mov-1757687427584	EGRESO	[Sebastian] 10 tarteras 16cm	50000	2025-09-12	2025-09-12 14:30:27.729483+00
mov-1757705210117	EGRESO	[Sebastian] Limones	3490	2025-09-12	2025-09-12 19:26:50.246631+00
mov-1757866510413	EGRESO	[Sebastian] Miel y azúcar	6902	2025-09-14	2025-09-14 16:15:10.587172+00
mov-1757973307913	EGRESO	[Sebastian] Cajas x25	12000	2025-09-15	2025-09-15 21:55:08.065355+00
mov-1757973317143	EGRESO	[Sebastian] Muzarella tubo	26000	2025-09-15	2025-09-15 21:55:17.309954+00
mov-1758029677578	INGRESO	[Sebastian] Venta tartas GYM	70000	2025-09-16	2025-09-16 13:34:37.780645+00
mov-1758032129854	INGRESO	[Sebastian] Venta Joel (Treekoo)	80000	2025-09-16	2025-09-16 14:15:30.331093+00
mov-1758040652702	INGRESO	[Santiago] Primera venta Fiore + 50% segundo pedido	53750	2025-09-16	2025-09-16 16:37:33.164838+00`;

    // Parsear el CSV
    const lineas = csvContent.split('\n');
    const headers = lineas[0].split('\t');
    
    console.log('📋 Headers originales:', headers);
    
    // Crear nuevo CSV con headers de Supabase
    const nuevosHeaders = [
      'fecha',
      'tipo', 
      'concepto',
      'monto',
      'metodo',
      'usuario_id',
      'usuario_nombre',
      'descripcion',
      'categoria',
      'created_at',
      'updated_at'
    ];
    
    let nuevoCSV = nuevosHeaders.join(',') + '\n';
    
    // Procesar cada fila (saltar header)
    for (let i = 1; i < lineas.length; i++) {
      if (lineas[i].trim()) {
        const valores = lineas[i].split('\t');
        
        // Mapear valores
        const fecha = valores[4] || new Date().toISOString().split('T')[0]; // date -> fecha
        const tipo = valores[1]?.toLowerCase() === 'ingreso' ? 'ingreso' : 'egreso'; // type -> tipo
        const concepto = valores[2] || ''; // concept -> concepto
        const monto = parseFloat(valores[3]) || 0; // amount -> monto
        const metodo = 'efectivo'; // Por defecto
        const created_at = valores[5] || new Date().toISOString(); // created_at
        
        // Determinar usuario basado en el concepto
        let usuario_id, usuario_nombre;
        if (concepto.includes('[Sebastian]')) {
          usuario_id = '550e8400-e29b-41d4-a716-446655440001';
          usuario_nombre = 'Sebastian Maza';
        } else if (concepto.includes('[Santiago]')) {
          usuario_id = '550e8400-e29b-41d4-a716-446655440002';
          usuario_nombre = 'Santiago Maza';
        } else {
          usuario_id = '550e8400-e29b-41d4-a716-446655440001'; // Por defecto Sebastian
          usuario_nombre = 'Sebastian Maza';
        }
        
        // Limpiar concepto (remover [Usuario])
        const conceptoLimpio = concepto.replace(/\[(Sebastian|Santiago)\]\s*/, '');
        
        // Determinar categoría basada en el concepto
        let categoria = null;
        if (concepto.toLowerCase().includes('venta')) {
          categoria = 'ventas';
        } else if (concepto.toLowerCase().includes('pedido') || concepto.toLowerCase().includes('compra')) {
          categoria = 'compras';
        } else if (concepto.toLowerCase().includes('frigorifico') || concepto.toLowerCase().includes('freezer')) {
          categoria = 'equipamiento';
        } else if (concepto.toLowerCase().includes('tapas') || concepto.toLowerCase().includes('tarteras')) {
          categoria = 'envases';
        } else if (concepto.toLowerCase().includes('verduras') || concepto.toLowerCase().includes('pollo')) {
          categoria = 'ingredientes';
        }
        
        // Crear fila del nuevo CSV
        const nuevaFila = [
          fecha,
          tipo,
          `"${conceptoLimpio}"`, // Escapar comillas
          monto,
          metodo,
          usuario_id,
          `"${usuario_nombre}"`, // Escapar comillas
          `"${concepto}"`, // Descripción original
          categoria || '',
          created_at,
          created_at // updated_at = created_at
        ];
        
        nuevoCSV += nuevaFila.join(',') + '\n';
      }
    }
    
    // Guardar nuevo CSV
    fs.writeFileSync('movimientos_caja_supabase.csv', nuevoCSV, 'utf8');
    
    console.log('✅ CSV convertido exitosamente!');
    console.log('📁 Archivo generado: movimientos_caja_supabase.csv');
    console.log('📊 Total de movimientos:', lineas.length - 1);
    
    // Mostrar preview de las primeras filas
    const preview = nuevoCSV.split('\n').slice(0, 5).join('\n');
    console.log('\n📋 Preview del archivo generado:');
    console.log(preview);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar conversión
convertirCSV();
