# from app import Userscore, Queue, Queuetournament, Tournament
import os
from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from datetime import datetime as dt


import json

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

# Initialize Database
db = SQLAlchemy(app)


# Database User Model
class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True,
                         nullable=False)
    favorites  = db.Column(db.String(255))

    def json(self):
        return {"username": self.username,"favorites": self.favorites}

class Cinema(db.Model):
    __tablename__ = "cinema"
    cinema_id = db.Column(db.Integer, primary_key=True)
    owner = db.Column(db.String(255), unique=True,
                         nullable=False)
    name  = db.Column(db.String(255),nullable=False)

    def json(self):
        return {"username": self.username,"favorites": self.favorites}

class Movies(db.Model):
    __tablename__ = "movies"
    # user_id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255),nullable=False)
    startDate = db.Column(db.Date)
    endDate = db.Column(db.Date)
    cinema = db.Column(db.String(255),nullable=False)
    category = db.Column(db.String(255))

    def json(self):
        return {"id": self.movie_id, "title": self.title, "startDate": self.startDate, "endDate": self.endDate, "cinema": self.cinema, "category": self.category}


# Create Database Table and Model
db.create_all()
db.session.commit()


# CreateUser API
@app.route("/dbmaster/createUser", methods=["POST"])
def createUser():
    username = request.json['username']

    user = User(
        username=username,
        favorites=''
    )
    db.session.add(user)
    db.session.commit()

    return Response("Userdb created with great success" + username, status=200)


@app.route("/dbmaster/getuser", methods=["POST"])
def getscores():
    username = request.json['username']

    scores = User.query.filter_by(username=username).first()
    return scores.json()

@app.route("/dbmaster/addmovie", methods=["POST"])
def addmovie():
    title = request.json['title']
    startDate = request.json['startDate']
    endDate = request.json['endDate']
    cinema = request.json['cinemaname']
    category = request.json['category']
    movie = Movies(
        title=title,
        startDate=startDate,
        endDate=endDate,
        cinema=cinema,
        category=category
    )
    db.session.add(movie)
    db.session.commit()

    return Response("Userdb created with great success" + title, status=200)

@app.route("/dbmaster/getmovies", methods=["GET"])
def getmovies():

    temps = Movies.query.order_by(Movies.startDate.asc()).filter(Movies.endDate>dt.now()).all()
    data = []
    for temp in temps:
        data.append({'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category})
    return jsonify(movies=data)

@app.route("/dbmaster/getownermovies", methods=["GET"])
def getownermovies():
    username = request.json['username']
    cinemaname=Cinema.query.filter(Cinema.owner == username).first()
    temps = Movies.query.order_by(Movies.startDate.asc()).filter(Movies.cinema == cinemaname).all()
    data = []
    for temp in temps:
        data.append({'movie_id': temp.movie_id,'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category})
    return jsonify(movies=data)

# @app.route("/dbmaster/editMovie", methods=["POST"])
# def editMovie():
#     movie_id = request.json['movie_id']
#     change = request.json['change']
#     Movies.query.order_by.filter(Movies.movie_id == movie_id).first()
#     movie = Movies(
#         title=title,
#         startDate=startDate,
#         endDate=endDate,
#         cinema=cinema,
#         category=category
#     )
#     db.session.add(movie)
#     db.session.commit()
#     return Response("Userdb created with great success" + title, status=200)

if __name__ == "__main__":
    app.run(debug=False)
