const API_BASE = 'http://192.168.15.9:5000';

export const enviarReservaAPI = async (reservaInfo, usuario) => {
  const body = {
    usuario: usuario,
    tipo_local: reservaInfo.tipo_local,
    id_local: reservaInfo.id_local,
    clube_id: reservaInfo.clube_id,
    data_reserva: reservaInfo.data_reserva,
    horario_inicio: reservaInfo.horario_inicio,
    horario_fim: reservaInfo.horario_fim,
  };

  const response = await fetch(`${API_BASE}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro desconhecido');
  }

  return await response.json();
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

export const listarClubesAPI = async () => {
  try {
    const response = await fetch(`${API_BASE}/clubes`);
    if (!response.ok) throw new Error('Erro ao obter clubes');
    const clubes = await response.json();
    return clubes;
  } catch (error) {
    console.error('Erro ao buscar clubes da API:', error);
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

export const listarEspacosPorClubeAPI = async () => {
  try {
    const [churrasqueirasRes, quadrasRes, saloesRes] = await Promise.all([
      fetch(`${API_BASE}/churrasqueiras`),
      fetch(`${API_BASE}/quadras`),
      fetch(`${API_BASE}/saloes`)
    ]);

    if (!churrasqueirasRes.ok || !quadrasRes.ok || !saloesRes.ok) {
      throw new Error('Erro ao buscar espaços');
    }

    const [churrasqueiras, quadras, saloes] = await Promise.all([
      churrasqueirasRes.json(),
      quadrasRes.json(),
      saloesRes.json()
    ]);

    return [...churrasqueiras, ...quadras, ...saloes];
  } catch (error) {
    console.error('Erro ao buscar espaços:', error);
    return [];
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
