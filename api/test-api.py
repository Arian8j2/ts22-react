import flask
from flask_cors import CORS

import json
from time import sleep
from random import randint

app = flask.Flask(__name__)
app.config["DEBUG"] = True

CORS(app, supports_credentials=True)

@app.route("/login", methods=["GET"])
def Login():
    resp = flask.make_response('{"found": true, "ranks": [131, 155, 140], "cldbid": 19, "points": 4800, "refid": "", "net-usage": 34823, "conn-time": 4174, "needed-points": 4500, "donators": [{"javad.r": 5000}, {"DJ JOON": 3000}, {"Acid": 10000}, {"Dr.YakuZa": 10000}, {"atila126": 5000}, {"alirezawinner": 5000}, {"green tea": 7000}, {"atila126": 7000}, {"alitoofan": 5000}, {"|-_-|cryMORE|-_-|": 7000}, {"mahdisalam": 7000}, {"amir.baz": 7000}], "alert": null}')
    resp.set_cookie("csrftoken", "just-test")
    return resp

@app.route("/submit_refid", methods=["POST"])
def SubmitRefid():
    return '{"success": true, "name": "Murphy"}'

@app.route("/upgrade", methods=["POST"])
def RankUp():
    return '{"success": true, "now-ranks": [131, 155, 140], "now-point": 85, "now-needed-point": 0}'

@app.route("/submit_donation", methods=["POST"])
def Donate():
    return '{"success": true, "authority": "A000000000121"}'

app.run(host='0.0.0.0')