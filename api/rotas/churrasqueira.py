from flask import Blueprint, request, jsonify
from db import conectar

churrasqueira_bp = Blueprint('churrasqueira', __name__)

@churrasqueira_bp.route('/churrasqueiras', methods=['GET'])
def listar_churrasqueiras():
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM churrasqueira")
    resultado = cursor.fetchall()
    conn.close()
    return jsonify(resultado)

@churrasqueira_bp.route('/churrasqueiras', methods=['POST'])
def criar_churrasqueira():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO churrasqueira (nome) VALUES (%s)", (dados['nome'],))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Churrasqueira criada com sucesso!'}), 201
