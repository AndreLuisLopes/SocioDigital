from flask import Flask
from flask_cors import CORS
from rotas.reservas import reservas_bp
from rotas.churrasqueira import churrasqueira_bp
from rotas.quadra import quadra_bp
from rotas.salao import salao_bp
from rotas.usuario import usuario_bp
from rotas.clube import clube_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(reservas_bp)
app.register_blueprint(churrasqueira_bp)
app.register_blueprint(quadra_bp)
app.register_blueprint(salao_bp)
app.register_blueprint(usuario_bp)
app.register_blueprint(clube_bp)

@app.route('/')
def home():
    return 'API SocioDigital está no ar'

@app.route('/churrasqueira')
def churrasqueira():
    return 'Rota da Churrasqueira OK!'

@app.route('/quadra')
def quadra():
    return 'Rota da quadra OK!'

@app.route('/salao')
def salao():
    return 'Rota do salão OK!'

@app.route('/usuarios')
def usuario():
    return 'Rota do usuário OK!'

@app.route('/clubes')
def clube():
    return 'Rota do clube OK!'

@app.route('/clubes/login')
def login_clube():
    return 'Rota de login do clube OK!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
