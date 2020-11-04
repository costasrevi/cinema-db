# from app import Userscore, Queue, Queuetournament, Tournament
import os
from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from datetime import datetime as dt
import json
import redis
from sqlalchemy import or_

# Initialize Application
app = Flask(__name__)

r = redis.Redis(host=os.environ['REDIS_HOST'],
                port=os.environ['REDIS_PORT'], db=os.environ['REDIS_DB'])

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
# class User(db.Model):
#     __tablename__ = "user"
#     user_id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(255), unique=True,
#                          nullable=False)
#     favorites  = db.Column(db.String(255))

#     def json(self):
#         return {"username": self.username,"favorites": self.favorites}

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

@app.route("/dbmaster/getmovies", methods=["POST"])
def getmovies():
    username = request.json['username']
    temps = Movies.query.order_by(Movies.endDate.asc()).filter(Movies.endDate>dt.now()).all()
    data = []
    if (r.exists(username)):
        movies = json.loads(r.get(username))
        for temp in temps:
            current = 0
            favorite=False
            while current < len(movies["FavList"]):
                if movies["FavList"][current] == temp.movie_id:
                    favorite=True
                    break
                current += 1
            data.append({'movie_id': temp.movie_id,'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category,'favorite':favorite})
    else:
        for temp in temps:
            data.append({'movie_id': temp.movie_id,'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category})
    return jsonify(movies=data)

@app.route("/dbmaster/getownermovies", methods=["POST"])
def getownermovies():
    username = request.json['username']
    # cinemaname=Cinema.query.filter(Cinema.owner == username).first()
    temps = Movies.query.order_by(Movies.endDate.asc()).filter(username == Movies.cinema).all()
    data = []
    for temp in temps:
        data.append({'movie_id': temp.movie_id,'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category})
    return jsonify(movies=data)

@app.route("/dbmaster/DeleteMovie", methods=["POST"])
def DeleteMovie():
    movie_id = request.json['movie_id']
    Movie = Movies.query.filter(Movies.movie_id == movie_id).first()
    db.session.delete(Movie)
    db.session.commit()
    return Response("Userdb deleted with great success", status=200)

@app.route("/dbmaster/editMovie", methods=["POST"])
def editMovie():
    movie_id = request.json['movie_id']
    movie = Movies.query.filter(Movies.movie_id == movie_id).first()
    try:
        title = request.json['title']
        movie.title = title
        db.session.commit()
        return Response("Userdb changed with great success "+ title, status=200)
    except:
        pass
    try:
        startDate = request.json['startDate']
        movie.startDate = dt.strptime(startDate,"%Y-%m-%d")
        db.session.commit()
        return Response("Userdb changed with great success "+ startDate, status=200)
    except:
        pass
    try:
        endDate = request.json['endDate']
        movie.endDate = dt.strptime(endDate,"%Y-%m-%d")
        db.session.commit()
        return Response("Userdb changed with great success "+endDate, status=200)
    except:
        pass
    try:
        category = request.json['category']
        movie.category = category
        db.session.commit()
        return Response("Userdb changed with great success "+category, status=200)
    except:
        pass
    return Response("moviedb changed with great failure", status=350)

# @app.route("/dbmaster/initFav", methods=["POST"])
# def initFav():
#     username  = request.json['username']
#     init = {
#         'username': username,
#         'FavList':[],
#         }
#     r.set(username, json.dumps(init))
#     return Response("movie favorites list init", status=200)

@app.route("/dbmaster/addtoFav", methods=["POST"])
def addtoFav():
    username = request.json['username']
    movie_id = request.json['movie_id']
    if (r.exists(username)):
        movies = json.loads(r.get(username))
        if movie_id not in movies["FavList"]:
            movies["FavList"].append(movie_id)
            updated = {
                'FavList':movies["FavList"],
                }
            r.set(username, json.dumps(updated))
            return Response("movie added to favorites", status=200)
    else:
        updated = {
            'username': username,
            'FavList':[],
            }
        r.set(username, json.dumps(updated))
        return Response("movie added to favorites", status=200)
    # return Response("movie added to favorites fail", status=350)

@app.route("/dbmaster/removeFav", methods=["POST"])
def removeFav():
    username = request.json['username']
    movie_id = request.json['movie_id']
    if (r.exists(username)):
        movies = json.loads(r.get(username))
        if movie_id in movies["FavList"]:
            movies["FavList"].remove(movie_id)
            updated = {
                'FavList':movies["FavList"],
                }
            r.set(username, json.dumps(updated))
            return Response("movie remove to favorites", status=200)
    return Response("movie remove to favorites fail", status=350)


@app.route("/dbmaster/getFav", methods=["POST"])
def getFav():
    username = request.json['username']
    if (r.exists(username)):
        data = json.loads(r.get(username))
        current = 0
        movielist = []
        while current < len(data["FavList"]):
            temp=Movies.query.order_by(Movies.endDate.asc()).filter(Movies.movie_id==data["FavList"][current]).first()
            current += 1
            if temp:
                movielist.append({'movie_id': temp.movie_id,'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category,'favorite':True})
        return jsonify(movies=movielist)
    return Response("movie get favorites fail", status=350)

@app.route("/dbmaster/getspecmovies", methods=["POST"])
def getspecmovies():
    search = request.json['search']
    search = "%{}%".format(search)
    username = request.json['username']
    startDate = request.json['startDate']
    endDate = request.json['endDate']
    favorite = request.json['favorite']
    if favorite=="True":
        if (r.exists(username)):
            data = json.loads(r.get(username))
            current = 0
            movielist = []
            while current < len(data["FavList"]):
                if startDate!="" and endDate!="":
                    temp=Movies.query.filter(and_(dt.strptime(startDate,"%Y-%m-%d")<=Movies.startDate,dt.strptime(endDate,"%Y-%m-%d")>=Movies.endDate),Movies.movie_id==data["FavList"][current],or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search))).first()
                elif startDate!="":
                    temp=Movies.query.filter(and_(dt.strptime(startDate,"%Y-%m-%d")<=Movies.startDate,Movies.movie_id==data["FavList"][current],or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).first()
                elif endDate!="":
                    temp=Movies.query.filter(and_(dt.strptime(endDate,"%Y-%m-%d")>=Movies.endDate,Movies.movie_id==data["FavList"][current],or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).first()
                else:
                    temp=Movies.query.filter(and_(Movies.movie_id==data["FavList"][current],or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).first()
                current += 1
                if temp:
                    movielist.append({'movie_id': temp.movie_id,'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category,'favorite':True})
            return jsonify(movies=movielist)
    else:
        if startDate!="" and endDate!="":
            temps = Movies.query.order_by(Movies.endDate.asc()).filter(and_(dt.strptime(startDate,"%Y-%m-%d")<=Movies.startDate,dt.strptime(endDate,"%Y-%m-%d")>=Movies.endDate,or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).all()
        elif startDate!="":
            temps = Movies.query.order_by(Movies.endDate.asc()).filter(and_(dt.strptime(startDate,"%Y-%m-%d")<=Movies.startDate,or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).all()
        elif endDate!="":
            temps = Movies.query.order_by(Movies.endDate.asc()).filter(and_(dt.strptime(endDate,"%Y-%m-%d")>=Movies.endDate,or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).all()
        else:
            temps = Movies.query.order_by(Movies.endDate.asc()).filter(or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search))).all()
        data = []
        for temp in temps:
            data.append({'movie_id': temp.movie_id,'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category})
        return jsonify(movies=data)


@app.route("/dbmaster/getspecmoviesowner", methods=["POST"])
def getspecmoviesowner():
    search = request.json['search']
    owner = request.json['owner']
    search = "%{}%".format(search)
    temps = Movies.query.order_by(Movies.endDate.asc()).filter(and_(or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)),Movies.cinema == owner)).all()
    data = []
    for temp in temps:
        data.append({'movie_id': temp.movie_id,'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category})
    return jsonify(movies=data)


if __name__ == "__main__":
    app.run(debug=False)
