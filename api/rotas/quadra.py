from flask import Blueprint, request, jsonify
from db import conectar

quadra_bp = Blueprint('quadra', __name__)

@quadra_bp.route('/quadras', methods=['GET'])
def listar_quadras():
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM quadra")
    resultado = cursor.fetchall()
    conn.close()
    return jsonify(resultado)

@quadra_bp.route('/quadras', methods=['POST'])
def criar_quadra():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO quadra (nome, tipo)
        VALUES (%s, %s)
    """, (dados['nome'], dados['tipo']))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Quadra criada com sucesso!'}), 201
