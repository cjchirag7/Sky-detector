from flask import Flask, jsonify, session, render_template, logging, request
# from data import Articles
from flask_mysqldb import MySQL
from flask_cors import CORS
from wtforms import Form, StringField, FloatField, PasswordField, validators
from passlib.hash import sha256_crypt
from functools import wraps
from cerberus import Validator
import json

app = Flask(__name__)
CORS(app)
app.secret_key = 'secret123'

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'ttbmp123'
app.config['MYSQL_DB'] = 'sky_detector'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# init MYSQL
mysql = MySQL(app)

Registerschema = {'name': {'type': 'string', 'required': True},
                  'username': {'type': 'string', 'required': True},
                  'password': {'type': 'string', 'required': True},
                  'focalLength': {'type': 'number', 'required': True},
                  'height': {'type': 'number', 'required': True},
                  'width': {'type': 'number', 'required': True}}


def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return jsonify(error="Not Authenticated")
    return wrap


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/register', methods=['POST'])
def register():
    RegisterValidator = Validator(Registerschema)
    data = json.loads(request.stream.read().decode())
    print(data)
    if request.method == 'POST' and RegisterValidator.validate(data):
        name = data['name']
        username = data['username']
        password = sha256_crypt.encrypt(str(data['password']))
        focalLength = data['focalLength']
        height = data['height']
        width = data['width']

        # Create cursor
        cur = mysql.connection.cursor()

        # Execute query
        cur.execute("INSERT INTO USERS(name, username, password, focalLength, height, width) VALUES(%s, %s, %s, %s,%s,%s)",
                    (name, username, password, focalLength, height, width))

        # Commit to DB
        mysql.connection.commit()

        # Close connection
        cur.close()

        return jsonify(msg="Successfully Registered. You can now log in to continue.")

    return jsonify(error=RegisterValidator.errors)

# User login


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        # Get Form Fields
        print(request)
        username = request.json['username']
        password_candidate = request.json['password']
        # Create cursor
        cur = mysql.connection.cursor()

        # Get user by username
        result = cur.execute(
            "SELECT * FROM USERS WHERE username = %s", [username])

        if result > 0:
            # Get stored hash
            data = cur.fetchone()
            password = data['password']

            # Compare Passwords
            if sha256_crypt.verify(password_candidate, password):
                # Passed
                session['logged_in'] = True
                session['username'] = username
                app.logger.info('Password matched !')
                return jsonify(success=True)
            else:
                error = 'Invalid login'
                app.logger.info('Not matched !')
                return jsonify(success=False)
            # Close connection
            cur.close()
        else:
            error = 'Username not found'
            return jsonify(success=False)

    return jsonify(success=False)

# Logout


@app.route('/logout')
@is_logged_in
def logout():
    session.clear()
    return jsonify(success=True)


if __name__ == 'main':
    app.run(debug=True)
