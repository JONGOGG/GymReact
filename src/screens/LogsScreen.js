import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const LogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const AsyncUser = await AsyncStorage.getItem('userUser');

      if (!AsyncUser) {
        console.error('No se encontró el usuario en AsyncStorage.');
        setLoading(false);
        return;
      }

      const response = await fetch(`https://apirestgym-production-23c8.up.railway.app/logs/${AsyncUser}`);
      const data = await response.json();

      if (data && Array.isArray(data.Acciones)) {
        setLogs(data.Acciones);
        setFilteredLogs(data.Acciones);
      } else {
        console.error('La respuesta de la API no contiene logs válidos.');
      }
    } catch (error) {
      console.error('Error al obtener los logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogsByDate = () => {
    if (!selectedDate) {
      setFilteredLogs(logs);
      return;
    }

    const filtered = logs.filter(log => {
      const logDate = new Date(log.fecha);
      return logDate.toDateString() === selectedDate.toDateString();
    });

    setFilteredLogs(filtered);
  };

  const resetFilters = () => {
    setSelectedDate(null);
    setFilteredLogs(logs);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogsByDate();
  }, [selectedDate]);

  const renderItem = ({ item }) => {
    if (!item) return null;

    const formattedDate = new Date(item.fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = new Date(item.fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return (
      <View style={styles.logItem}>
        <Text style={styles.logText}>Usuario: {item.usuario || 'N/A'}</Text>
        <Text style={styles.logText}>Acción: {item.accion || 'N/A'}</Text>
        <Text style={styles.logText}>IP: {item.ip || 'N/A'}</Text>
        <Text style={styles.logText}>Lugar de Acción: {item.lugar_accion || 'N/A'}</Text>
        <Text style={styles.logText}>Fecha: {formattedDate} {formattedTime}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.filterButtonText}>
            Seleccionar Día: {selectedDate ? selectedDate.toLocaleDateString('es-ES') : 'Ninguna'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>Restablecer Filtros</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setSelectedDate(selectedDate);
            }
          }}
        />
      )}

      <Button title="Recargar Logs" onPress={fetchLogs} disabled={loading} />
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={(item) => (item._id ? item._id.toString() : Math.random().toString())}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  filterButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  resetButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  resetButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  logItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logText: {
    fontSize: 14,
    marginBottom: 5,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
});

export default LogsScreen;
