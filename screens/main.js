import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Button, Alert, TouchableOpacity, FlatList
} from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { enviarReservaAPI, listarReservasAPI } from '../services/api';

const ESPACOS = ['Churrasqueira', 'Quadra', 'Salão de Festas'];

export default function MainScreen({ route }) {
  const { usuario } = route.params || {};
  const [calendarId, setCalendarId] = useState(null);
  const [reservas, setReservas] = useState([]);

  const [espaco, setEspaco] = useState(ESPACOS[0]);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const defaultCalendar = await getDefaultCalendarId();
        setCalendarId(defaultCalendar);
      }
    })();
    carregarReservas();
  }, []);

  const getDefaultCalendarId = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(cal => cal.allowsModifications);
    return defaultCalendar?.id;
  };

  const carregarReservas = async () => {
    try {
      const remoto = await listarReservasAPI();
      const reservasAPI = remoto.map((reserva, index) => ({
        id: 'api-' + index,
        espaco: reserva.tipo_local.charAt(0).toUpperCase() + reserva.tipo_local.slice(1),
        data: reserva.data_reserva,
        horaInicio: reserva.horario_inicio.slice(0, 5),
        horaFim: reserva.horario_fim.slice(0, 5),
      }));
      setReservas(reservasAPI.reverse());
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar reservas');
    }
  };

  const criarReserva = async () => {
  const startDate = new Date(date);
  startDate.setHours(startTime.getHours(), startTime.getMinutes());

  const endDate = new Date(date);
  endDate.setHours(endTime.getHours(), endTime.getMinutes());

  if (startDate >= endDate) {
    Alert.alert('Erro', 'Horário de início deve ser antes do término.');
    return;
  }

  const reservaInfo = {
    id: Date.now(),
    espaco,
    data: date.toLocaleDateString(),
    horaInicio: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    horaFim: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  try {
    console.log("📦 Enviando reserva:", reservaInfo, "Usuário:", usuario?.nome);
    await enviarReservaAPI(reservaInfo, usuario?.nome);

    if (calendarId) {
      await Calendar.createEventAsync(calendarId, {
        title: `Reserva: ${espaco}`,
        startDate,
        endDate,
        timeZone: 'America/Sao_Paulo',
        notes: `Reserva feita pelo app SocioDigital`,
      });
    }

    Alert.alert('Sucesso!', `Reserva de ${espaco} criada!`);
    carregarReservas();
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível criar a reserva: ' + error.message);
  }
};

  const renderReserva = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.espaco}</Text>
    <Text>
      {item.data} — {item.horaInicio.replace(/:$/, '')} às {item.horaFim.replace(/:$/, '')}
    </Text>
  </View>
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SocioDigital</Text>
      {usuario?.nome && <Text style={{ textAlign: 'center', marginBottom: 10 }}>Bem-vindo(a), {usuario.nome}!</Text>}
      <Text style={styles.description}>Selecione o espaço, data e horário para reservar:</Text>

      <Text style={styles.subtitle}>Espaço:</Text>
      <View style={styles.spaceContainer}>
        {ESPACOS.map(opcao => (
          <TouchableOpacity
            key={opcao}
            style={[styles.spaceButton, espaco === opcao && styles.selectedSpace]}
            onPress={() => setEspaco(opcao)}
          >
            <Text style={espaco === opcao ? styles.selectedText : styles.spaceText}>{opcao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.selectButton}>
        <Text>Data: {date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={(_, d) => {
          setShowDatePicker(false);
          if (d) setDate(d);
        }} />
      )}

      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.selectButton}>
        <Text>Início: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker value={startTime} mode="time" display="default" is24Hour onChange={(_, t) => {
          setShowStartTimePicker(false);
          if (t) setStartTime(t);
        }} />
      )}

      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.selectButton}>
        <Text>Término: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker value={endTime} mode="time" display="default" is24Hour onChange={(_, t) => {
          setShowEndTimePicker(false);
          if (t) setEndTime(t);
        }} />
      )}

      <Button title="Reservar" onPress={criarReserva} />

      <Text style={[styles.subtitle, { marginTop: 30 }]}>Reservas Realizadas:</Text>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReserva}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 10 }}>Nenhuma reserva feita.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  description: { textAlign: 'center', marginBottom: 15, fontSize: 15 },
  subtitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  spaceContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 15 },
  spaceButton: {
    padding: 10, borderWidth: 1, borderColor: '#007AFF',
    borderRadius: 5, margin: 5
  },
  selectedSpace: { backgroundColor: '#007AFF' },
  spaceText: { color: '#007AFF' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  selectButton: {
    padding: 10, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 5, marginBottom: 10, width: '100%', alignItems: 'center',
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
});
