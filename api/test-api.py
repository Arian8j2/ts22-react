import flask
from flask_cors import CORS

import json
from time import sleep
from random import randint

app = flask.Flask(__name__)
app.config["DEBUG"] = True

CORS(app)

@app.route("/login", methods=["GET"])
def Login():
    # sleep(randint(2, 4))
    return '{"found": true, "ranks": "75,15,47,50,88", "cldbid": 19, "points": 4800, "refid": "", "net-usage": 34823, "conn-time": 4174, "needed-points": 4500, "donators": [{"javad.r": 5000}, {"DJ JOON": 3000}, {"Acid": 10000}, {"Dr.YakuZa": 10000}, {"atila126": 5000}, {"alirezawinner": 5000}, {"green tea": 7000}, {"atila126": 7000}, {"alitoofan": 5000}, {"|-_-|cryMORE|-_-|": 7000}, {"mahdisalam": 7000}, {"amir.baz": 7000}], "alert": null}'

@app.route("/submit_refid/<int:refid>", methods=["GET"])
def SubmitRefid(refid: int):
    return '{"success": true, "name": "Murphy"}'

@app.route("/upgrade", methods=["GET"])
def RankUp():
    return '{"success": true, "now-rank": "76,15,47,50,88", "now-point": 85, "now-needed-point": 0}'

@app.route("/submit_donation/<int:amount>", methods=["GET"])
def Donate(amount: int):
    return '{"result": 0, "url": "https://google.com"}'

app.run(host='0.0.0.0')