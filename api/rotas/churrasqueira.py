from flask import Blueprint, request, jsonify
from db import conectar

churrasqueira_bp = Blueprint('churrasqueira', __name__)

@churrasqueira_bp.route('/churrasqueiras', methods=['GET'])
def listar_churrasqueiras():
    clube_id = request.args.get('clube_id')
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    if clube_id:
        cursor.execute("SELECT * FROM churrasqueira WHERE clube_id = %s", (clube_id,))
    else:
        cursor.execute("SELECT * FROM churrasqueira")
    resultado = cursor.fetchall()
    conn.close()
    return jsonify(resultado)

@churrasqueira_bp.route('/churrasqueiras', methods=['POST'])
def criar_churrasqueira():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO churrasqueira (nome, clube_id) VALUES (%s, %s)",
        (dados['nome'], dados['clube_id'])
    )
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Churrasqueira criada com sucesso!'}), 201