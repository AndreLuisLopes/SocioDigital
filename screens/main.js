import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Button, Alert, TouchableOpacity, FlatList
} from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  enviarReservaAPI,
  listarReservasAPI,
  listarClubesAPI,
  listarEspacosPorClubeAPI
} from '../services/api';

export default function MainScreen({ route }) {
  const { usuario } = route.params || {};
  const [calendarId, setCalendarId] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [clubeSelecionado, setClubeSelecionado] = useState(null);
  const [espacos, setEspacos] = useState([]);
  const [espacoSelecionado, setEspacoSelecionado] = useState(null);

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
      await carregarClubes();
      await carregarReservas();
    })();
  }, []);

  const getDefaultCalendarId = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(cal => cal.allowsModifications);
    return defaultCalendar?.id;
  };

  const carregarClubes = async () => {
    try {
      const clubesAPI = await listarClubesAPI();
      setClubes(clubesAPI);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar clubes');
    }
  };

  const carregarEspacosDoClube = async (clube) => {
    try {
      const todosEspacos = await listarEspacosPorClubeAPI();
      const filtrados = todosEspacos.filter(e => e.clube_id === clube.id);
      setEspacos(filtrados);
      setClubeSelecionado(clube);
      setEspacoSelecionado(null);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar espaços do clube');
    }
  };

  const carregarReservas = async () => {
  try {
    const remoto = await listarReservasAPI();
    const reservasAPI = remoto.map((reserva, index) => ({
      id: reserva.id || 'api-' + index,
      espaco: reserva.tipo_local && typeof reserva.tipo_local === 'string'
        ? reserva.tipo_local.charAt(0).toUpperCase() + reserva.tipo_local.slice(1)
        : (reserva.espaco || 'Espaço'),
      data: reserva.data_reserva || '',
      horaInicio: reserva.horario_inicio ? reserva.horario_inicio.slice(0, 5) : '',
      horaFim: reserva.horario_fim ? reserva.horario_fim.slice(0, 5) : '',
    }));
    setReservas(reservasAPI.reverse());
  } catch (error) {
    Alert.alert('Erro', 'Falha ao carregar reservas');
    console.error('Erro ao carregar reservas:', error);
  }
};

  const criarReserva = async () => {
  if (!clubeSelecionado || !espacoSelecionado) {
    Alert.alert('Selecione o clube e o espaço desejado.');
    return;
  }

  const startDate = new Date(date);
  startDate.setHours(startTime.getHours(), startTime.getMinutes());

  const endDate = new Date(date);
  endDate.setHours(endTime.getHours(), endTime.getMinutes());

  if (startDate >= endDate) {
    Alert.alert('Erro', 'Horário de início deve ser antes do término.');
    return;
  }

  const tipoLocalInferido = espacoSelecionado.tipo?.toLowerCase() || 'churrasqueira';

  const reservaInfo = {
  usuario: usuario?.nome,
  tipo_local: espacoSelecionado.tipo || espacoSelecionado.nome,
  id_local: espacoSelecionado.id,
  clube_id: clubeSelecionado.id,
  data_reserva: date.toLocaleDateString('pt-BR'),
  horario_inicio: startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  horario_fim: endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
};

  try {
    await enviarReservaAPI(reservaInfo, usuario?.nome);

    if (calendarId) {
      await Calendar.createEventAsync(calendarId, {
        title: `Reserva: ${espacoSelecionado.nome}`,
        startDate,
        endDate,
        timeZone: 'America/Sao_Paulo',
        notes: `Reserva feita pelo app SocioDigital`,
      });
    }

    Alert.alert('Sucesso!', `Reserva de ${espacoSelecionado.nome} criada!`);
    carregarReservas();
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível criar a reserva: ' + error.message);
  }
};

  const renderReserva = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.espaco}</Text>
      <Text>{item.data} — {item.horaInicio} às {item.horaFim}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SocioDigital</Text>
      {usuario?.nome && <Text style={{ textAlign: 'center', marginBottom: 10 }}>Bem-vindo(a), {usuario.nome}!</Text>}
      <Text style={styles.subtitle}>Clube:</Text>
      <View style={styles.spaceContainer}>
        {clubes.map(clube => (
          <TouchableOpacity
            key={clube.id}
            style={[styles.spaceButton, clubeSelecionado?.id === clube.id && styles.selectedSpace]}
            onPress={() => carregarEspacosDoClube(clube)}
          >
            <Text style={clubeSelecionado?.id === clube.id ? styles.selectedText : styles.spaceText}>{clube.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {clubeSelecionado && (
        <>
          <Text style={styles.subtitle}>Espaço:</Text>
          <View style={styles.spaceContainer}>
            {espacos.map(espaco => (
              <TouchableOpacity
                key={espaco.nome}
                style={[styles.spaceButton, espacoSelecionado?.nome === espaco.nome && styles.selectedSpace]}
                onPress={() => setEspacoSelecionado(espaco)}
              >
                <Text style={espacoSelecionado?.nome === espaco.nome ? styles.selectedText : styles.spaceText}>{espaco.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.selectButton}>
        <Text>Data: {date.toLocaleDateString('pt-BR')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={(_, d) => {
          setShowDatePicker(false);
          if (d) setDate(d);
        }} />
      )}

      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.selectButton}>
        <Text>Início: {startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker value={startTime} mode="time" display="default" is24Hour onChange={(_, t) => {
          setShowStartTimePicker(false);
          if (t) setStartTime(t);
        }} />
      )}

      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.selectButton}>
        <Text>Término: {endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
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