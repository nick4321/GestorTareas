import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskItem({ tarea, onCompletar, onEliminar, onEditar }) {
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

            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onEditar(tarea)}
                accessibilityRole="button"
                accessibilityLabel={`Editar ${tarea.titulo}`}
                style={styles.botonEliminar}
            >
                <Text style={{ color: '#1565c0' }}>Editar</Text>
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
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
    },
    contenido: {
        flex: 1,
    },
    titulo: {
        fontSize: 17,
        color: '#222222',
    },
    tituloCompletado: {
        textDecorationLine: 'line-through',
        color: '#777777',
    },
    recordatorio: {
        marginTop: 6,
        fontSize: 13,
        color: '#666666',
    },
    botonEliminar: {
        padding: 10,
        marginLeft: 8,
    },
    textoEliminar: {
        color: '#c62828',
    },
});