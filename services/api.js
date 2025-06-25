const API_BASE = 'http://192.168.15.9:5000';

export const enviarReservaAPI = async (reserva, nomeUsuario) => {
  try {
    const response = await fetch(`${API_BASE}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: nomeUsuario,
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
    const response = await fetch(`${API_BASE}/reservas`);
    if (!response.ok) throw new Error('Erro ao obter reservas');
    const dados = await response.json();
    return dados.reservas || [];
  } catch (error) {
    console.error('Erro ao buscar reservas da API:', error);
    return [];
  }
};

export const salvarClubeAPI = async (clube) => {
  try {
    const response = await fetch(`${API_BASE}/clubes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clube)
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(`Erro ao cadastrar clube: ${erro}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao salvar clube:', error);
    throw error;
  }
};

export const verificarLoginClubeAPI = async (email, senha) => {
  try {
    const response = await fetch(`${API_BASE}/clubes/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.erro || 'Erro ao tentar login');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar login do clube:', error);
    throw error;
  }
};

export const cadastrarEspacoAPI = async (tipo, dados) => {
  let endpoint = '';

  switch (tipo) {
    case 'churrasqueira':
      endpoint = 'churrasqueiras';
      break;
    case 'quadra':
      endpoint = 'quadras';
      break;
    case 'salao':
      endpoint = 'saloes';
      break;
    default:
      throw new Error('Tipo de espaço inválido');
  }

  try {
    const resposta = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    const json = await resposta.json();

    if (!resposta.ok) {
      throw new Error(json.erro || 'Erro ao cadastrar espaço');
    }

    return json;
  } catch (error) {
    console.error('Erro ao cadastrar espaço:', error);
    throw error;
  }
};

export const salvarUsuarioAPI = async (usuario) => {
  try {
    const response = await fetch(`${API_BASE}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(`Erro ao cadastrar usuário: ${erro}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    throw error;
  }
};

export const verificarLoginUsuarioAPI = async (email, senha) => {
  try {
    const response = await fetch(`${API_BASE}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.erro || 'Erro ao tentar login');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar login do usuário:', error);
    throw error;
  }
};
