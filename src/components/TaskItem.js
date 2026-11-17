import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colores } from '../theme/tema';

export default function TaskItem({ tarea, onCompletar, onEliminar, onEditar, onAbrirCalendario }) {
    return (
        <View style={styles.contenedor}>

            <TouchableOpacity
                style={styles.contenido}
                onPress={() => onCompletar(tarea.id)}
                accessibilityRole="button"
                accessibilityLabel={
                    tarea.completada
                        ? `Marcar ${tarea.titulo} como pendiente`
                        : `Completar ${tarea.titulo}`
                }
            >
                <Text
                    style={[
                        styles.titulo,
                        tarea.completada && styles.tituloCompletado,
                    ]}
                >
                    {tarea.completada ? '✓ ' : '○ '}
                    {tarea.titulo}
                </Text>

                <Text style={styles.recordatorio}>
                    Recordatorio: {tarea.recordatorio || 'Sin recordatorio'}
                </Text>

                {tarea.imagenUri && <Image source={{ uri: tarea.imagenUri }} style={styles.imagen} accessibilityLabel={`Imagen de ${tarea.titulo}`} />}
                {(tarea.ubicacion || tarea.contacto || tarea.eventoCalendarioId) && (
                    <View style={styles.recursos}>
                        {tarea.ubicacion && <Text style={styles.recurso}>📍 Ubicación asociada</Text>}
                        {tarea.contacto && <Text style={styles.recurso}>👤 {tarea.contacto.nombre}</Text>}
                        {tarea.eventoCalendarioId && <Text style={styles.recurso}>📅 Evento agregado</Text>}
                    </View>
                )}

            </TouchableOpacity>

            {tarea.eventoCalendarioId && onAbrirCalendario && (
                <TouchableOpacity
                    onPress={() => onAbrirCalendario(tarea.eventoCalendarioId)}
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir calendario para ${tarea.titulo}`}
                    style={styles.botonCalendario}
                >
                    <Text style={styles.textoCalendario}>Ver en calendario</Text>
                </TouchableOpacity>
            )}

            <View style={styles.acciones}>
            <TouchableOpacity
                onPress={() => onEditar(tarea)}
                accessibilityRole="button"
                accessibilityLabel={`Editar ${tarea.titulo}`}
                style={styles.botonEliminar}
            >
                <Text style={{ color: colores.magenta, fontWeight: '600' }}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onEliminar(tarea.id)}
                accessibilityRole="button"
                accessibilityLabel={`Eliminar ${tarea.titulo}`}
                style={styles.botonEliminar}
            >
                <Text style={styles.textoEliminar}>Eliminar</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        alignItems: 'stretch',
        padding: 18,
        borderWidth: 1,
        borderColor: colores.borde,
        marginBottom: 10,
        backgroundColor: colores.superficie,
        borderRadius: 20,
    },
    contenido: { minHeight: 44 },
    acciones: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
    titulo: {
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 24,
        color: colores.texto,
    },
    tituloCompletado: {
        textDecorationLine: 'line-through',
        color: colores.tenue,
    },
    recordatorio: {
        marginTop: 6,
        fontSize: 13,
        color: colores.secundario,
    },
    imagen: { width: '100%', height: 120, borderRadius: 12, marginTop: 10, backgroundColor: colores.fondo },
    recursos: { marginTop: 8, gap: 3 },
    recurso: { color: colores.secundario, fontSize: 12 },
    botonCalendario: { alignSelf: 'flex-start', marginTop: 8, paddingVertical: 6 },
    textoCalendario: { color: colores.magenta, fontSize: 13, fontWeight: '600' },
    botonEliminar: {
        minHeight: 44,
        justifyContent: 'center',
        padding: 10,
        marginLeft: 8,
    },
    textoEliminar: {
        color: colores.coral,
    },
});
