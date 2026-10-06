import { StyleSheet } from 'react-native';

export const colores = {
  fondo: '#191422', superficie: '#261E33', elevado: '#332842',
  borde: '#493958', violeta: '#9473B4', magenta: '#B48BBD',
  indigo: '#5A4A9C', coral: '#FF9494', peligro: '#FF5A5A',
  texto: '#FFF6FF', secundario: '#D0BFD9', tenue: '#AB96B7',
};

export const formularioStyles = StyleSheet.create({
  contenedor: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: colores.fondo },
  tarjeta: { backgroundColor: colores.superficie, padding: 24, borderRadius: 24, borderWidth: 1, borderColor: colores.borde },
  marca: { color: colores.magenta, fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 14 },
  titulo: { color: colores.texto, fontSize: 30, fontWeight: '700', marginBottom: 10 },
  subtitulo: { color: colores.secundario, fontSize: 15, lineHeight: 23, marginBottom: 28 },
  etiqueta: { color: colores.secundario, fontWeight: '600', marginBottom: 8 },
  input: { color: colores.texto, backgroundColor: colores.fondo, borderWidth: 1, borderColor: colores.borde, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 20 },
  fila: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  texto: { color: colores.secundario, fontSize: 14, flexShrink: 1 },
  pie: { color: colores.tenue, textAlign: 'center', lineHeight: 21, marginTop: 24 },
});
