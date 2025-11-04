from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import random
import string
from utils.send_email import send_email

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde tu frontend

# ------------------------------
# 🧩 BASE DE DATOS (SQLite)
# ------------------------------
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE,
                    email TEXT UNIQUE,
                    password TEXT,
                    reset_code TEXT
                )''')
    conn.commit()
    conn.close()

init_db()

# ------------------------------
# 🔹 REGISTRO
# ------------------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = generate_password_hash(data.get('password'))

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                  (username, email, password))
        conn.commit()
        return jsonify({"message": "Usuario registrado correctamente"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "El usuario o correo ya existen"}), 400
    finally:
        conn.close()

# ------------------------------
# 🔹 LOGIN
# ------------------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE username = ?", (username,))
    row = c.fetchone()
    conn.close()

    if row and check_password_hash(row[0], password):
        return jsonify({"message": "Login exitoso", "user": username}), 200
    else:
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

# ------------------------------
# 🔹 OLVIDÉ CONTRASEÑA
# ------------------------------
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT username FROM users WHERE email = ?", (email,))
    row = c.fetchone()

    if not row:
        conn.close()
        return jsonify({"error": "No existe un usuario con ese correo"}), 404

    # Generar código aleatorio
    code = ''.join(random.choices(string.digits, k=6))
    c.execute("UPDATE users SET reset_code = ? WHERE email = ?", (code, email))
    conn.commit()
    conn.close()

    # Enviar el correo con el código
    send_email(email, "Recuperar contraseña", f"Tu código de recuperación es: {code}")
    return jsonify({"message": "Código enviado al correo"}), 200

# ------------------------------
# 🔹 RESTABLECER CONTRASEÑA
# ------------------------------
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('new_password')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT reset_code FROM users WHERE email = ?", (email,))
    row = c.fetchone()

    if not row or row[0] != code:
        conn.close()
        return jsonify({"error": "Código incorrecto"}), 400

    hashed_pw = generate_password_hash(new_password)
    c.execute("UPDATE users SET password = ?, reset_code = NULL WHERE email = ?",
            (hashed_pw, email))
    conn.commit()
    conn.close()

    return jsonify({"message": "Contraseña actualizada correctamente"}), 200


    # ------------------------------
# 🔹 CRUD de PROYECTOS
# ------------------------------
@app.route('/projects', methods=['GET', 'POST'])
def projects():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        title = data.get('title')
        description = data.get('description')
        status = data.get('status')
        progress = data.get('progress')

        # Crear tabla si no existe
        c.execute('''CREATE TABLE IF NOT EXISTS projects (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT,
                        title TEXT,
                        description TEXT,
                        status TEXT,
                        progress INTEGER
                    )''')
        c.execute('INSERT INTO projects (username, title, description, status, progress) VALUES (?, ?, ?, ?, ?)',
                  (username, title, description, status, progress))
        conn.commit()
        conn.close()
        return jsonify({"message": "Proyecto agregado correctamente"}), 201

    # Método GET: listar todos los proyectos de un usuario
    username = request.args.get('username')
    c.execute('SELECT * FROM projects WHERE username = ?', (username,))
    projects = [
        {"id": row[0], "username": row[1], "title": row[2], "description": row[3],
         "status": row[4], "progress": row[5]}
        for row in c.fetchall()
    ]
    conn.close()
    return jsonify(projects), 200


@app.route('/projects/<int:project_id>', methods=['PUT', 'DELETE'])
def project_detail(project_id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    if request.method == 'PUT':
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        status = data.get('status')
        progress = data.get('progress')
        c.execute('UPDATE projects SET title=?, description=?, status=?, progress=? WHERE id=?',
                (title, description, status, progress, project_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Proyecto actualizado"}), 200

    elif request.method == 'DELETE':
        c.execute('DELETE FROM projects WHERE id=?', (project_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Proyecto eliminado"}), 200

@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    username = data.get('username')
    name = data.get('name')
    email = data.get('email')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('UPDATE users SET username=?, email=? WHERE username=?', (name, email, username))
    conn.commit()
    conn.close()
    return jsonify({"message": "Perfil actualizado correctamente"}), 200

@app.route('/messages', methods=['GET', 'POST'])
def messages():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    content TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )''')

    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        content = data.get('content')
        c.execute('INSERT INTO messages (username, content) VALUES (?, ?)', (username, content))
        conn.commit()

    c.execute('SELECT username, content, created_at FROM messages ORDER BY created_at DESC LIMIT 10')
    messages = [{"username": r[0], "content": r[1], "created_at": r[2]} for r in c.fetchall()]
    conn.close()
    return jsonify(messages)

# ------------------------------
# 🔹 INICIAR SERVIDOR
# ------------------------------
if __name__ == '__main__':
    app.run(debug=True)


