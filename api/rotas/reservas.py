from flask import Blueprint, request, jsonify
from db import conectar
from datetime import timedelta, datetime, date
from decimal import Decimal

reservas_bp = Blueprint('reservas', __name__)

@reservas_bp.route('/reservas', methods=['GET'])
def listar_reservas():
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reserva")
    resultado = cursor.fetchall()
    conn.close()

    for item in resultado:
        for chave, valor in item.items():
            if isinstance(valor, (datetime, date)):
                item[chave] = valor.strftime('%d/%m/%Y')
            elif isinstance(valor, timedelta):
                item[chave] = str(valor)
            elif isinstance(valor, Decimal):
                item[chave] = float(valor)

    return jsonify({'reservas': resultado})

@reservas_bp.route('/reservas', methods=['POST'])
def criar_reserva():
    dados = request.get_json()
    print("🧾 Dados recebidos:", dados)
    try:
        data_formatada = datetime.strptime(dados['data_reserva'].replace(" ", ""), '%d/%m/%Y').date()
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO reserva (usuario, tipo_local, id_local, data_reserva, horario_inicio, horario_fim)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            dados['usuario'],
            dados['tipo_local'],
            dados['id_local'],
            data_formatada,
            dados['horario_inicio'],
            dados['horario_fim']
        ))
        conn.commit()
        conn.close()
        return jsonify({'mensagem': 'Reserva criada com sucesso!'}), 201
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
