FROM python:3-slim

WORKDIR /home/dbmaster-app

COPY ./requirments.txt .

RUN pip install -r requirments.txt

COPY . .

#KOSTA THYMISOU NA TO ALLAKSOUME EDW

EXPOSE 5002

CMD gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 app:app -b 0.0.0.0:5002



