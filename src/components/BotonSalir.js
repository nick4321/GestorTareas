import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colores } from '../theme/tema';

// Puerta y flecha hacia la izquierda, dibujadas con componentes nativos.
export default function BotonSalir({ onPress, disabled }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}
      accessibilityRole="button" accessibilityLabel="Cerrar sesión"
      accessibilityHint="Vuelve al inicio de sesión y cancela tus recordatorios pendientes"
      accessibilityState={{ disabled }} activeOpacity={0.7}
      style={[styles.boton, disabled && { opacity: 0.4 }]}>
      <View accessible={false} style={styles.icono}>
        <View style={styles.puerta} />
        <View style={styles.linea} />
        <View style={styles.punta} />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  boton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colores.elevado, borderRadius: 14 },
  icono: { width: 24, height: 24 },
  puerta: { position: 'absolute', right: 1, top: 3, width: 10, height: 18, borderWidth: 2, borderColor: colores.coral, borderRadius: 2 },
  linea: { position: 'absolute', left: 2, top: 11, width: 16, height: 2, backgroundColor: colores.coral },
  punta: { position: 'absolute', left: 2, top: 8, width: 8, height: 8, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: colores.coral, transform: [{ rotate: '45deg' }] },
});
