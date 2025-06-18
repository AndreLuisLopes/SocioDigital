from flask import Blueprint, request, jsonify
from db import conectar

salao_bp = Blueprint('salao', __name__)

@salao_bp.route('/saloes', methods=['GET'])
def listar_saloes():
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM salao")
    resultado = cursor.fetchall()
    conn.close()
    return jsonify(resultado)

@salao_bp.route('/saloes', methods=['POST'])
def criar_salao():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO salao (nome, capacidade)
        VALUES (%s, %s)
    """, (dados['nome'], dados['capacidade']))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Salão criado com sucesso!'}), 201
