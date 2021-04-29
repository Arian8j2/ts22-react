import flask
from flask_cors import CORS

import json
from time import sleep
from random import randint

app = flask.Flask(__name__)
app.config["DEBUG"] = True

CORS(app)

@app.route("/login_api", methods=["GET"])
def Login():
    # sleep(randint(2, 4))
    return '{"found": true, "ranks": "75,15,47,50,88", "cldbid": 19, "points": 4800, "refid": "", "net-usage": 34823, "conn-time": 4174, "needed-points": 4500, "donators": {"amir_ali_bahadori_rad": 3000, "AriaN": 5000, "حجت الاسلام خرابی": 100000}}'

@app.route("/submitrefid_api/<int:refid>", methods=["GET"])
def SubmitRefid(refid: int):
    return '{"success": true, "name": "Murphy"}'

@app.route("/upgrade_api", methods=["GET"])
def RankUp():
    return '{"success": true, "now-rank": "76,15,47,50,88", "now-point": 85, "now-needed-point": 0}'

@app.route("/submitdonation/<int:amount>", methods=["GET"])
def Donate(amount: int):
    return '{"result": 0, "url": "https://google.com"}'

app.run(host='0.0.0.0')