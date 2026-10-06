import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colores } from '../theme/tema';

export default function BotonAccion({ title, onPress, disabled = false, secundario = false }) {
  return (
    <TouchableOpacity
      onPress={onPress} disabled={disabled} activeOpacity={0.8}
      accessibilityRole="button" accessibilityState={{ disabled }}
      style={[styles.boton, secundario && styles.secundario, disabled && styles.deshabilitado]}
    >
      <Text style={[styles.texto, secundario && styles.textoSecundario]}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  boton: { minHeight: 52, borderRadius: 16, backgroundColor: colores.coral, justifyContent: 'center', alignItems: 'center', padding: 14 },
  texto: { color: colores.fondo, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  secundario: { backgroundColor: colores.elevado, borderWidth: 1, borderColor: colores.borde },
  textoSecundario: { color: colores.texto },
  deshabilitado: { opacity: 0.5 },
});
