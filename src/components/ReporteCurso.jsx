// ReporteCurso.jsx
import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ReporteCurso = ({ supabase }) => {
  const generarPDF = () => {

    if (!supabase) {
      console.error("Supabase data is undefined");
      return;
    }
  
    console.log('Datos completos:', supabase);  // Imprime los datos completos para verificar la estructura
  
    console.log('Temas:', supabase.temas);
    console.log('Actividades:', supabase.actividades);
    console.log('Calificaciones:', supabase.calificaciones);
    console.log('Tareas:', supabase.tareas);

    const documentDefinition = {
      content: [
        { text: 'Reporte de Progreso del Curso', style: 'header' },
        { text: 'Temas Impartidos', style: 'subheader' },
        ...(supabase.temas || []).map((tema) => ({ text: tema.titulo, margin: [0, 5] })),
        { text: 'Actividades Realizadas', style: 'subheader' },
        ...(supabase.actividades || []).map((actividad) => ({ text: actividad.descripcion, margin: [0, 5] })),
        { text: 'Calificaciones Asignadas', style: 'subheader' },
        ...(supabase.calificaciones || []).map((calificacion) => ({ text: `Puntuación: ${calificacion.puntuacion}`, margin: [0, 5] })),
        { text: 'Estado de las Tareas', style: 'subheader' },
        ...(supabase.tareas || []).map((tarea) => ({ text: `Tarea ${tarea.tareaID}: ${tarea.estado}`, margin: [0, 5] })),
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  };

  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Reporte de Progreso del Curso</Text>
          <Text style={styles.subheader}>Temas Impartidos</Text>
          {(supabase.temas || []).map((tema) => (
            <Text key={tema.temaID}>{tema.titulo}</Text>
          ))}
          <Text style={styles.subheader}>Actividades Realizadas</Text>
          {(supabase.actividades || []).map((actividad) => (
            <Text key={actividad.actividadID}>{actividad.descripcion}</Text>
          ))}
          <Text style={styles.subheader}>Calificaciones Asignadas</Text>
          {(supabase.calificaciones || []).map((calificacion) => (
            <Text key={calificacion.calificacionID}>{`Puntuación: ${calificacion.puntuacion}`}</Text>
          ))}
          <Text style={styles.subheader}>Estado de las Tareas</Text>
          {(supabase.tareas || []).map((tarea) => (
            <Text key={tarea.tareaID}>{`Tarea ${tarea.tareaID}: ${tarea.estado}`}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div>
      <h2>Generar Reporte de Progreso del Curso</h2>
      <button onClick={generarPDF}>Generar PDF</button>
      <PDFViewer style={{ width: '100%', height: '500px' }}>{MyDocument}</PDFViewer>
    </div>
  );
};

const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
    },
    section: {
      margin: [10, 10, 10, 10], // [top, right, bottom, left]
      padding: 10,
      flexGrow: 1,
    },
    header: { fontSize: 18, bold: true, marginBottom: 10 },
    subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
  });

export default ReporteCurso;
