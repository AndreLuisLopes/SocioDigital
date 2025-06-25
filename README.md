# SocioDigital

Aplicativo mobile desenvolvido com **React Native** + **Expo** para **gerenciar reservas de espaços comunitários**, como churrasqueiras, quadras esportivas e salões de festas.

## Tecnologias Utilizadas

- [Expo](https://expo.dev/)
- [Node.js](https://nodejs.org/pt)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- [Expo Calendar](https://docs.expo.dev/versions/latest/sdk/calendar/)
- [DateTimePicker](https://github.com/react-native-datetimepicker/datetimepicker)
- [Flask API Python](https://flask.palletsprojects.com/en/stable/)
- [mysql-connector-python](https://pypi.org/project/mysql-connector-python/)
- [flask-cors](https://pypi.org/project/flask-cors/)

## Funcionalidades

- Registro e login local com armazenamento de dados  
- Cadastro de reservas com:
  - Seleção de espaço (ex: churrasqueira, quadra)
  - Escolha de **data**, **hora de início** e **hora de término**

- Integração com o **calendário nativo do dispositivo**  
- Armazenamento de **reservas realizadas, registro e login de clubes e usuários** em um banco de dados MySQL através do Flask
- Cadastro de **espaços** em banco de dados MySQL através do Flask  
- Visualização de reservas anteriores


## Telas do App

- Tela de **Iníco**
- Tela de **Login de Usuário e de Clubes**
- Tela de **Registro de Usário e de Clubes**
- Tela **Main de clubes** com:
  - Cadastro de Espaço: Quadras, Salões de festa e Churrasqueiras   
- Tela **Main de usuários** com:
  - Reservas personalizadas
  - Lista de reservas salvas

## Como Executar

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/sociodigital.git
cd sociodigital

# 2. Instale as dependências
npm install

# 3. Inicie com o Expo
npx expo start
```

Você pode escanear o QR code com o aplicativo **Expo Go** no seu celular para rodar o app!

## Estrutura de Pastas

```
/api
  ├── rotas
    ├── churrasqueira.py          # Rota das Churrasqueiras
    ├── quadra.py                 # Rotas das Quadras
    ├── reservas.py               # Rotas das Reservas
    ├── usuario.py                # Rotas de Usuários
    ├── clube.py                  # Rotas de Clubes
    └── salao.py                  # Rotas dos Salões de Festa
  ├── app.py                        # Ponto de entrada da API
  ├── db.py                         # Conexão com o banco

/services
  └── api.js          # Funções de enviar e listar

/screens
  ├── login.js           # Tela de login
  ├── registro.js        # Tela de registro
  ├── HomeScreen.js      # Tela inicial
  ├── registroClube.js   # Tela de Registro de Clubes
  ├── loginClube.js      # Tela de Login de Clubes
  ├── clube.js           # Tela de principal de Clubes
  ├── cadastroEspaço.js  # Tela de Cadastro de espaços
  └── main.js            # Tela principal com calendário e reservas

/App.js                # Navegação entre telas

SocioDigital.sql       # Banco de Dados
```

## Futuras Melhorias

- Logout e troca de usuários
- Remover reservas da lista
- Tela de calendário visual com reservas do mês

## Autor

Feito por [André Luís Lopes](https://github.com/AndreLuisLopes)  
Licenciado sob [MIT](LICENSE)
