from flask import Flask, jsonify, session, render_template, logging, request
# from data import Articles
from flask_mysqldb import MySQL
from wtforms import Form, StringField, FloatField, PasswordField, validators
from passlib.hash import sha256_crypt
from functools import wraps

app = Flask(__name__)
app.secret_key = 'secret123'

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'ttbmp123'
app.config['MYSQL_DB'] = 'sky_detector'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# init MYSQL
mysql = MySQL(app)

# Articles = Articles()


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
    form = RegisterForm(request.form)
    if request.method == 'POST' and form.validate():
        name = form.name.data
        username = form.username.data
        password = sha256_crypt.encrypt(str(form.password.data))
        focalLength = form.focalLength.data
        height = form.height.data
        width = form.width.data

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

    return jsonify(error="Please try again")

# User login


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        # Get Form Fields
        username = request.form['username']
        password_candidate = request.form['password']

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


class RegisterForm(Form):
    name = StringField('name', [validators.Length(min=1, max=50)])
    username = StringField('username', [validators.Length(min=4, max=25)])
    password = PasswordField('password', [
        validators.DataRequired()
    ])
    focalLength = FloatField('focalLength', [validators.InputRequired()])
    height = FloatField('height', [validators.InputRequired()])
    width = FloatField('width', [validators.InputRequired()])


if __name__ == 'main':
    app.run(debug=True)
