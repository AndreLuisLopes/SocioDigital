from flask import Blueprint, request, jsonify
from db import conectar

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/usuarios', methods=['GET'])
def listar_usuarios():
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuario")
    resultado = cursor.fetchall()
    conn.close()
    return jsonify(resultado)

@usuario_bp.route('/usuarios', methods=['POST'])
def criar_usuario():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO usuario (nome, email, senha)
        VALUES (%s, %s, %s)
    """, (dados['nome'], dados['email'], dados['senha']))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Usuário criada com sucesso!'}), 201

@usuario_bp.route('/usuarios/login', methods=['POST'])
def login_clube():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuario WHERE email = %s AND senha = %s", (email, senha))
    usuario = cursor.fetchone()
    conn.close()

    if usuario:
        return jsonify({ 'mensagem': 'Login bem-sucedido', 'usuario': usuario }), 200
    else:
        return jsonify({ 'erro': 'Email ou senha inválidos' }), 401
