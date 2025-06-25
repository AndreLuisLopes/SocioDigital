from flask import Blueprint, request, jsonify
from db import conectar

clube_bp = Blueprint('clube', __name__)

@clube_bp.route('/clubes', methods=['GET'])
def listar_clubes():
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clube")
    resultado = cursor.fetchall()
    conn.close()
    return jsonify(resultado)

@clube_bp.route('/clubes', methods=['POST'])
def criar_clube():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO clube (nome, email, senha, cep)
        VALUES (%s, %s, %s, %s)
    """, (dados['nome'], dados['email'], dados['senha'], dados['cep']))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Usuário criada com sucesso!'}), 201

@clube_bp.route('/clubes/login', methods=['POST'])
def login_clube():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clube WHERE email = %s AND senha = %s", (email, senha))
    clube = cursor.fetchone()
    conn.close()

    if clube:
        return jsonify({ 'mensagem': 'Login bem-sucedido', 'clube': clube }), 200
    else:
        return jsonify({ 'erro': 'Email ou senha inválidos' }), 401
