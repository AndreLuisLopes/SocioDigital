export const enviarReservaAPI = async (reserva) => {
  try {
    const response = await fetch('http://192.168.15.9:5000/reservas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: 1,
        tipo_local: reserva.espaco.toLowerCase(),
        id_local: 1,
        data_reserva: reserva.data,
        horario_inicio: reserva.horaInicio,
        horario_fim: reserva.horaFim,
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao salvar no servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar reserva para API:', error);
    throw error;
  }
};

export const listarReservasAPI = async () => {
  try {
    const response = await fetch('http://192.168.15.9:5000/reservas');
    if (!response.ok) throw new Error('Erro ao obter reservas');
    const dados = await response.json();
    return dados.reservas || [];
  } catch (error) {
    console.error('Erro ao buscar reservas da API:', error);
    return [];
  }
};
