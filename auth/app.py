import os
import requests
import jwt
import datetime
import json
from sqlalchemy import or_
from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Application
app = Flask(__name__)

# Configuration of postgreSQL Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}'.format(
    user=os.environ['POSTGRES_USER'],
    password=os.environ['POSTGRES_PASSWORD'],
    host=os.environ['POSTGRES_HOST'],
    port=os.environ['POSTGRES_PORT'],
    db=os.environ['POSTGRES_DB'])

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SECRET_KEY'] = 'my_secret_key'

jwt_secret_key = "secret"

# Initialize Database
db = SQLAlchemy(app)

# Database User Model


class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    surname = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))
    confirmed = db.Column(db.Boolean)
    user_role = db.Column(db.String(255))

    def json(self):
        return {"id": self.user_id, "username": self.username,"surname": self.surname,"name": self.name, "email": self.email, "password": self.password, "user_role": self.user_role, "confirmed": self.confirmed}


# Create Database Table and Model
db.create_all()
db.session.commit()

#adding default user admin
admin_user = User(
    username='admin',
    name='admin',
    surname='admin',
    confirmed=True,
    email='admin@admin',
    password=generate_password_hash('admin', method='sha256'),
    user_role='admin'
)
user = db.session.query(User).filter_by(username=admin_user.username).first()
if user is None:
    db.session.add(admin_user)
    db.session.commit()


# CreateUser API to register a user
@app.route("/auth/register", methods=["POST"])
def register():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    name = request.json['name']
    surname = request.json['surname']
    user_role = request.json['role']

    if username is None or email is None or password is None or name is None or surname is None:
        error = 'username, email and password are required'
        return Response(error, status=400)
    if ' ' in username:
        error = 'Username should not contain spaces'
        return Response(error, status=400)
    else:
        user = db.session.query(User).filter_by(username=username).first()
        if user is not None:
            error = 'A User with the same username already exists'
            return Response(error, status=400)
        user = db.session.query(User).filter_by(email=email).first()
        if user is not None:
            error = 'A User with the same email already exists'
            return Response(error, status=400)
        if user_role == "Admin":
            user_role="admin"
        elif user_role == "User":
            user_role="user"
        elif user_role == "cinema_owner":
            user_role="cinema_owner"
        else:
            error = 'A User role is wrong'
            return Response(error, status=300)
        user = User(
            username=username,
            email=email,
            password=generate_password_hash(password, method='sha256'),
            surname=surname,
            name=name,
            confirmed=False,
            user_role=user_role  # default role is user
        )
        db.session.add(user)
        db.session.commit()
        token = encodeAuthToken(user.username, user.user_role,user.confirmed)
        return token


#handling login of user and returning token 
@app.route("/auth/login", methods=["POST"])
def login():
    username = request.json['username']
    password = request.json['password']
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status=400)
    check_password = check_password_hash(user.password, password)
    if not check_password:
        error = 'Password is incorrect'
        return Response(error, status=400)
    if not user.confirmed:
        error = 'not confirmed'
        return Response(error, status=400)
    token = encodeAuthToken(user.username, user.user_role,user.confirmed)
    return token

#checking the token
@app.route("/auth/check_token", methods=["POST"])
def check_token():
    token = request.json['token']
    dec = decodeAuthToken(token)
    if dec['username'] is None:
        error = "Validation Unsuccessfull"
        return Response(error, status=400)
    response = {
        'username': dec['username'],
        'user_role': dec['user_role'],
    }
    return jsonify(response)

#changing the role of the user
@app.route("/auth/change_role", methods=["POST"])
def change_role():
    username = request.json['username']
    user_role = request.json['user_role']
    if user_role != "admin" and user_role != "cinema_owner" and user_role != "user":
        error = "This user role is not accepted: "+user_role
        return Response(error, status=400)
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status=400)
    if user.user_role == user_role:
        error = 'User already has this role'
        return Response(error, status=400)
    user.user_role = user_role
    db.session.commit()
    # Generate New Token
    token = encodeAuthToken(user.username, user.user_role,user.confirmed)
    return token

#confirming or unconfirm any user
@app.route("/auth/confirm_role", methods=["POST"])
def confirm_role():
    username = request.json['username']
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status=400)
    if user.confirmed:
        user.confirmed = False
    else:
        user.confirmed = True
    db.session.commit()
    # Generate New Token
    token = encodeAuthToken(user.username, user.user_role,user.confirmed)
    return token

#getting all the users
@app.route("/auth/get_users", methods=['GET'])
def get_users():
    users = db.session.query(User).order_by(User.username.asc()).all()
    users_list = []
    for user in users:
        if user.confirmed == True:
            temp = "True"
        else:
            temp = "False" 
        users_list.append({'username': user.username,
                           'email': user.email,'surname': user.surname,'name': user.name,'confirmed': temp, 'user_role': user.user_role})
    return jsonify(users_list=users_list)

#getting specific users depending of the search parametr
@app.route("/auth/getspecusers", methods=["POST"])
def getspecusers():
    search = request.json['search']  
    if "e" == search:
        search = "%{}%".format(search)
        temps = User.query.order_by(User.username.asc()).all()
    elif search in "True":
        search = "%{}%".format(search)
        temps = User.query.order_by(User.username.asc()).filter(or_(User.confirmed==True,User.username.like(search),User.email.like(search),User.surname.like(search), User.name.like(search),User.user_role.like(search))).all()
    elif search in "False":
        search = "%{}%".format(search)
        temps = User.query.order_by(User.username.asc()).filter(or_(User.confirmed==False,User.username.like(search),User.email.like(search),User.surname.like(search), User.name.like(search),User.user_role.like(search))).all()
    else:
        search = "%{}%".format(search)
        temps = User.query.order_by(User.username.asc()).filter(or_(User.username.like(search),User.email.like(search),User.surname.like(search), User.name.like(search),User.user_role.like(search))).all()
    users_list = []
    for temp in temps:
        if temp.confirmed == True:
            confirmed = "True"
        else:
            confirmed = "False" 
        users_list.append({'username': temp.username,
                           'email': temp.email,'surname': temp.surname,'name': temp.name,'confirmed': confirmed, 'user_role': temp.user_role})
    return jsonify(users_list=users_list)

#deleting a user from the db
@app.route("/auth/DeleteUser", methods=["POST"])
def DeleteUser():
    username = request.json['username']
    user = User.query.filter(User.username == username).first()
    db.session.delete(user)
    db.session.commit()
    return Response("Userdb deleted with great success", status=200)

# JWT TOKEN
def encodeAuthToken(username, user_role,confirmed):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=30),
            'iat': datetime.datetime.utcnow(),
            'username': username,
            'user_role': user_role,
            'confirmed': confirmed,
        }
        token = jwt.encode(
            payload, jwt_secret_key, algorithm='HS256')
        return token
    except Exception as e:
        print(e)
        return e

#decoding the authentication token
def decodeAuthToken(token):
    try:
        payload = jwt.decode(
            token, jwt_secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Login please'
    except jwt.InvalidTokenError:
        return 'Nice try, invalid token. Login please'


if __name__ == "__main__":
    app.run(debug=False)
