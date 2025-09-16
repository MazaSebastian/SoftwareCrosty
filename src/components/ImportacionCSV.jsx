import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import importacionService from '../services/importacionService';

const ImportacionContainer = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Titulo = styled.h3`
  color: #722F37;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Instrucciones = styled.div`
  background: #F3F4F6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  
  h4 {
    color: #374151;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  ul {
    color: #6B7280;
    font-size: 0.9rem;
    margin: 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
`;

const FormularioImportacion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputFile = styled.input`
  display: none;
`;

const BotonSeleccionar = styled.button`
  background: #722F37;
  color: #FFFFFF;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #8B3A42;
  }
  
  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
  }
`;

const BotonImportar = styled.button`
  background: #10B981;
  color: #FFFFFF;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #059669;
  }
  
  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
  }
`;

const ArchivoSeleccionado = styled.div`
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  border-radius: 8px;
  padding: 1rem;
  color: #065F46;
  font-size: 0.9rem;
`;

const ProgresoContainer = styled.div`
  background: #F3F4F6;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const BarraProgreso = styled.div`
  background: #E5E7EB;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const Progreso = styled.div`
  background: #10B981;
  height: 100%;
  width: ${props => props.progreso}%;
  transition: width 0.3s ease;
`;

const TextoProgreso = styled.div`
  color: #6B7280;
  font-size: 0.9rem;
  text-align: center;
`;

const ResultadoContainer = styled.div`
  background: ${props => props.exitoso ? '#ECFDF5' : '#FEF2F2'};
  border: 1px solid ${props => props.exitoso ? '#A7F3D0' : '#FECACA'};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const MensajesLista = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: ${props => props.exitoso ? '#065F46' : '#DC2626'};
  font-size: 0.9rem;
`;

const ImportacionCSV = ({ onImportacionCompleta }) => {
  const [archivo, setArchivo] = useState(null);
  const [importando, setImportando] = useState(false);
  const [estado, setEstado] = useState(null);
  const [resultado, setResultado] = useState(null);
  const fileInputRef = useRef(null);

  const handleSeleccionarArchivo = () => {
    fileInputRef.current?.click();
  };

  const handleArchivoChange = (e) => {
    const archivoSeleccionado = e.target.files[0];
    if (archivoSeleccionado) {
      setArchivo(archivoSeleccionado);
      setResultado(null);
    }
  };

  const handleImportar = async () => {
    if (!archivo) return;

    setImportando(true);
    setEstado(null);
    setResultado(null);

    try {
      const resultado = await importacionService.importarCSV(archivo);
      setResultado(resultado);
      
      if (resultado.exitoso && onImportacionCompleta) {
        onImportacionCompleta();
      }
    } catch (error) {
      setResultado({
        exitoso: false,
        error: error.message,
        mensajes: [`❌ Error: ${error.message}`]
      });
    } finally {
      setImportando(false);
    }
  };

  const estadoActual = importacionService.obtenerEstado();

  return (
    <ImportacionContainer>
      <Titulo>
        📊 Importar Movimientos desde CSV
      </Titulo>

      <Instrucciones>
        <h4>📋 Instrucciones:</h4>
        <ul>
          <li>El archivo CSV debe tener las siguientes columnas (en cualquier orden):</li>
          <li><strong>concepto</strong> - Descripción del movimiento (obligatorio)</li>
          <li><strong>monto</strong> - Cantidad del movimiento (obligatorio)</li>
          <li><strong>tipo</strong> - "ingreso" o "egreso" (opcional, se detecta automáticamente)</li>
          <li><strong>fecha</strong> - Fecha del movimiento (opcional, usa fecha actual si no se especifica)</li>
          <li><strong>metodo</strong> - "efectivo" o "transferencia" (opcional, usa "efectivo" por defecto)</li>
          <li><strong>descripcion</strong> - Descripción adicional (opcional)</li>
          <li><strong>categoria</strong> - Categoría del movimiento (opcional)</li>
        </ul>
      </Instrucciones>

      <FormularioImportacion>
        <InputFile
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleArchivoChange}
        />
        
        <BotonSeleccionar onClick={handleSeleccionarArchivo}>
          📁 Seleccionar Archivo CSV
        </BotonSeleccionar>

        {archivo && (
          <ArchivoSeleccionado>
            ✅ Archivo seleccionado: <strong>{archivo.name}</strong>
            <br />
            Tamaño: {(archivo.size / 1024).toFixed(2)} KB
          </ArchivoSeleccionado>
        )}

        <BotonImportar
          onClick={handleImportar}
          disabled={!archivo || importando}
        >
          {importando ? '⏳ Importando...' : '📥 Importar Movimientos'}
        </BotonImportar>
      </FormularioImportacion>

      {importando && (
        <ProgresoContainer>
          <BarraProgreso>
            <Progreso progreso={estadoActual.progreso} />
          </BarraProgreso>
          <TextoProgreso>
            Progreso: {estadoActual.progreso}% ({estadoActual.exitosos + estadoActual.errores} de {estadoActual.total})
          </TextoProgreso>
        </ProgresoContainer>
      )}

      {resultado && (
        <ResultadoContainer exitoso={resultado.exitoso}>
          <h4>{resultado.exitoso ? '✅ Importación Exitosa' : '❌ Error en Importación'}</h4>
          <MensajesLista exitoso={resultado.exitoso}>
            {resultado.mensajes?.map((mensaje, index) => (
              <li key={index}>{mensaje}</li>
            ))}
          </MensajesLista>
          {resultado.total && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <strong>Resumen:</strong> {resultado.exitosos} exitosos, {resultado.errores} errores de {resultado.total} total
            </div>
          )}
        </ResultadoContainer>
      )}
    </ImportacionContainer>
  );
};

export default ImportacionCSV;
