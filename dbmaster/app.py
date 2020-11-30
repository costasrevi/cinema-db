# from app import Userscore, Queue, Queuetournament, Tournament
import os
from flask import Flask, jsonify, Response, request
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import and_
from datetime import datetime as dt
import json as jn
import requests
# import redis
# import pymongo MongoClient
from flask_mongoengine import *
from mongoengine.queryset.visitor import Q
# from sqlalchemy import or_

# Initialize Application
app = Flask(__name__)
db = MongoEngine()

# myclient = pymongo.MongoClient("mongodb://"+os.environ['MONGO_HOST']+":"+os.environ['MONGO_PORT']+"/")
app.config['MONGODB_SETTINGS'] = {
    'db': os.environ['MONGO_INITDB_DATABASE'],
    'host': os.environ['MONGO_HOST'],
    'port': int(os.environ['MONGO_PORT']),
    # 'username':os.environ['MONGO_INITDB_ROOT_USERNAME'],
    # 'password':os.environ['MONGO_INITDB_ROOT_PASSWORD']
}
db.init_app(app)

# connect(os.environ['MONGO_HOST'], username=os.environ['MONGO_HOST'], password=os.environ['MONGO_HOST'], authentication_source='admin')

# here the Movies db that have the required info for the movies
class Movies(db.Document):

    title = db.StringField(unique=True)
    startDate = db.DateTimeField()
    endDate = db.DateTimeField()
    cinema = db.StringField(required=True)
    category = db.StringField(required=True)

class Favorites(db.Document):
    username = db.StringField(primary_key=True)
    Fav_List = db.ListField(db.StringField(unique=True))



# adding a movie to the database the cinema name is the cinema owner username
@app.route("/dbmaster/addmovie", methods=["POST"])
def addmovie():
    title = request.json['title']
    startDate = request.json['startDate'].split("T")
    startDate2 =dt.strptime(startDate[0],"%Y-%m-%d")
    endDate = request.json['endDate'].split("T")
    endDate2 = dt.strptime(endDate[0],"%Y-%m-%d")
    cinema = request.json['cinemaname']
    category = request.json['category']
    tempo=Movies(title=title,startDate=startDate2,endDate=endDate2,cinema=cinema,category=category).save()
    url = "http://orion:1026/v2/entities"
    # payload="{\r\n  \"id\": \" dw45gdt\",\r\n  \"type\": \"movie\",\r\n  \"title\": {\r\n    \"value\": \"scary movie @\",\r\n    \"type\": \"String\"\r\n  },\r\n  \"Startdate\": {\r\n    \"value\": \"Startdate\",\r\n    \"type\": \"Date\"\r\n  },\r\n    \"Endate\": {\r\n    \"value\": \"Startdate\",\r\n    \"type\": \"Date\"\r\n  },\r\n    \"Category\": {\r\n    \"value\": \"Scary\",\r\n    \"type\": \"String\"\r\n  }\r\n}"
    payload={
        "id": str(tempo.id),
        "type": "movie",
        "title": {
            "value": title,
            "type": "String"
            },
        "Startdate": {
            "value": str(startDate2),
            "type": "String"
            },
        "Endate": {
            "value": str(endDate2),
            "type": "String"
            },
        "Category": {
            "value": category,
            "type": "String"
            }
        }
    headers = {
    'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=jn.dumps(payload))
    # print(response.text)
    return Response("Userdb created with great success  :"+str(tempo.id)+str(response), status=200)


@app.route("/dbmaster/getmovies", methods=["POST"])
def getmovies():
    username = request.json['username']
    data = []
    for movies in Movies.objects.order_by('endDate'):
        # temp=movies.id
        favorite=False
        fav=Favorites.objects(username=username)
        if fav:
            fav = fav.get(pk=username)
            if str(movies.id) in fav.Fav_List:
                favorite=True
        data.append({'movie_id': str(movies.id),'title': movies.title,'startDate': movies.startDate.strftime("%a %d/%m/%Y"),'endDate': movies.endDate.strftime("%a %d/%m/%Y"),'cinema': movies.cinema, 'category': movies.category,'favorite':favorite})
    return jsonify(movies=data)

@app.route("/dbmaster/getFav", methods=["POST"])
def getFav():
    username = request.json['username']
    data = []
    for movies in Movies.objects.order_by('endDate'):
        # temp=movies.id
        fav=Favorites.objects(username=username)
        if fav:
            fav = fav.get(pk=username)
            if str(movies.id) in fav.Fav_List:
                # favorite=True
                data.append({'movie_id': str(movies.id),'title': movies.title,'startDate': movies.startDate.strftime("%a %d/%m/%Y"),'endDate': movies.endDate.strftime("%a %d/%m/%Y"),'cinema': movies.cinema, 'category': movies.category,'favorite':True})
    return jsonify(movies=data)

# # getting the movies with cinema name  same  as the cinema owner username
@app.route("/dbmaster/getownermovies", methods=["POST"])
def getownermovies():
    username = request.json['username']
    # temp=
    # temp = temp.get(cinema=username)
    data = []
    # data.append(temp)
    for movies in Movies.objects(cinema=username).order_by('endDate'):
        # data.append(movies)
        data.append({'movie_id': str(movies.id),'title': movies.title,'startDate': movies.startDate.strftime("%a %d/%m/%Y"),'endDate': movies.endDate.strftime("%a %d/%m/%Y"),'cinema': movies.cinema, 'category': movies.category})
    return jsonify(movies=data)

# # searching throught the movies db and deleting  the first movie with the same id
@app.route("/dbmaster/DeleteMovie", methods=["POST"])
def DeleteMovie():
    movie_id = request.json['movie_id']
    Movies.objects(id=movie_id).delete()
    return Response("Userdb deleted with great success", status=200)

# We are editing the already added movies and checking which change was requested .Handling one change at a time
@app.route("/dbmaster/editMovie", methods=["POST"])
def editMovie():
    movie_id = request.json['movie_id']
    movie = Movies.objects(id=movie_id)
    movie = movie.get(id=movie_id)
    url="http://orion:1026/v2/entities/"+movie_id+"/attrs"
    headers = {'Content-Type': 'application/json'}
    try:
        title = request.json['title']
        movie.title = title
        movie.save()
        payload={
            "title": {
            "value": title,
            "type": "String"
            }
        }
        response = requests.request("PATCH", url, headers=headers, data=jn.dumps(payload))
        return Response("Userdb changed with great success "+ title+str(response), status=200)
    except:
        pass
    try:
        startDate = request.json['startDate']
        movie.startDate = dt.strptime(startDate,"%Y-%m-%d")
        movie.save()
        payload={
            "startDate": {
            "value": startDate,
            "type": "String"
            }
        }
        response = requests.request("PATCH", url, headers=headers, data=jn.dumps(payload))
        return Response("Userdb changed with great success "+ startDate+str(response), status=200)
    except:
        pass
    try:
        endDate = request.json['endDate']
        movie.endDate = dt.strptime(endDate,"%Y-%m-%d")
        movie.save()
        payload={
            "endDate": {
            "value": endDate,
            "type": "String"
            }
        }
        response = requests.request("PATCH", url, headers=headers, data=jn.dumps(payload))
        return Response("Userdb changed with great success "+endDate+str(response), status=200)
    except:
        pass
    try:
        category = request.json['category']
        movie.category = category
        movie.save()
        payload={
            "category": {
            "value": category,
            "type": "String"
            }
        }
        response = requests.request("PATCH", url, headers=headers, data=jn.dumps(payload))
        return Response("Userdb changed with great success "+category+str(response), status=200)
    except:
        pass
    return Response("moviedb changed with great failure", status=350)

# # adding a movie to a user's favorites 

@app.route("/dbmaster/addtoFav", methods=["POST"])
def addtoFav():
    username = request.json['username']
    movie_id = request.json['movie_id']
    fav=Favorites.objects(username=username)
    if fav:
        fav = fav.get(pk=username)
        fav.model = fav['Fav_List'].append(movie_id)
        fav.save()
        return Response("movie added to favorites", status=200)
    data = []
    data.append(movie_id)
    Favorites(username=username,Fav_List=data).save()
    return Response("movie added to favorites first time", status=200)

# removing a movie from a user's favorites 
@app.route("/dbmaster/removeFav", methods=["POST"])
def removeFav():
    username = request.json['username']
    movie_id = request.json['movie_id']
    fav=Favorites.objects(username=username)
    if fav:
        fav = fav.get(pk=username)
        if movie_id in fav['Fav_List']:
            fav.model = fav['Fav_List'].remove(movie_id)
            fav.save()
        return Response("movie delete to favorites", status=200)
    return Response("movie delete to favorites failed", status=500)

# # getting movies depending on search parametrs and also if we want only favorites or not
@app.route("/dbmaster/getspecmovies", methods=["POST"])
def getspecmovies():
    search = request.json['search']
    # search = "%{}%".format(search)
    username = request.json['username']
    # startDate = request.json['startDate']
    endDate = request.json['endDate']
    favorite = request.json['favorite']
    data = []
    if favorite=="True":
        fav=Favorites.objects(username=username)
        if fav:
            fav = fav.get(pk=username)
            if endDate!="":
                # temps = Movies.query.order_by(Movies.endDate.asc()).filter(and_(dt.strptime(endDate,"%Y-%m-%d")>=Movies.startDate,dt.strptime(endDate,"%Y-%m-%d")<=Movies.endDate,or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).all()
                temps = Movies.objects((Q(title__icontains=search) | Q(cinema__icontains=search) | Q(category__icontains=search)) & Q(startDate__lte=dt.strptime(endDate,"%Y-%m-%d")) & Q(endDate__gte=dt.strptime(endDate,"%Y-%m-%d"))).order_by('endDate')
            else:
                # temps = Movies.query.order_by(Movies.endDate.asc()).filter(or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search))).all()
                temps = Movies.objects(Q(title__icontains=search) | Q(cinema__icontains=search) | Q(category__icontains=search)).order_by('endDate')
            for temp in temps:
                if str(temp.id) in fav.Fav_List:
                    data.append({'movie_id': str(temp.id),'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category,'favorite':True})
            return jsonify(movies=data)
    else:
        fav=Favorites.objects(username=username)
        if fav:
            fav = fav.get(pk=username)
            if  endDate!="":
                # temps = Movies.query.order_by(Movies.endDate.asc()).filter(and_(dt.strptime(endDate,"%Y-%m-%d")>=Movies.startDate,dt.strptime(endDate,"%Y-%m-%d")<=Movies.endDate,or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).all()
                temps = Movies.objects((Q(title__icontains=search) | Q(cinema__icontains=search) | Q(category__icontains=search)) & Q(startDate__lte=dt.strptime(endDate,"%Y-%m-%d")) & Q(endDate__gte=dt.strptime(endDate,"%Y-%m-%d"))).order_by('endDate')
            else:
                # temps = Movies.query.order_by(Movies.endDate.asc()).filter(or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search))).all()
                temps = Movies.objects(Q(title__icontains=search) | Q(cinema__icontains=search) | Q(category__icontains=search)).order_by('endDate')
            for temp in temps:
                favorite=False
                if str(temp.id) in fav.Fav_List:
                    favorite=True
                data.append({'movie_id': str(temp.id),'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category,'favorite':True})
            return jsonify(movies=data)
        else:
            if  endDate!="":
                # temps = Movies.query.order_by(Movies.endDate.asc()).filter(and_(dt.strptime(endDate,"%Y-%m-%d")>=Movies.startDate,dt.strptime(endDate,"%Y-%m-%d")<=Movies.endDate,or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search)))).all()
                temps = Movies.objects((Q(title__icontains=search) | Q(cinema__icontains=search) | Q(category__icontains=search)) & Q(startDate__lte=dt.strptime(endDate,"%Y-%m-%d")) & Q(endDate__gte=dt.strptime(endDate,"%Y-%m-%d"))).order_by('endDate')
            else:
                # temps = Movies.query.order_by(Movies.endDate.asc()).filter(or_(Movies.title.like(search), Movies.cinema.like(search),Movies.category.like(search))).all()
                temps = Movies.objects(Q(title__icontains=search) | Q(cinema__icontains=search) | Q(category__icontains=search)).order_by('endDate')
            for temp in temps:
                data.append({'movie_id': str(temp.id),'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category})
            return jsonify(movies=data)

# #search fuction for cinema owners
@app.route("/dbmaster/getspecmoviesowner", methods=["POST"])
def getspecmoviesowner():
    search = request.json['search']
    owner = request.json['owner']
    data = []
    for temp in Movies.objects(( Q(title__icontains=search) | Q(cinema__icontains=search) | Q(category__icontains=search)) & Q(cinema=owner)):
        data.append({'movie_id': str(temp.id),'title': temp.title,'startDate': temp.startDate.strftime("%a %d/%m/%Y"),'endDate': temp.endDate.strftime("%a %d/%m/%Y"),'cinema': temp.cinema, 'category': temp.category})
    return jsonify(movies=data)


if __name__ == "__main__":
    app.run(debug=False)
