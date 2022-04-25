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
    resp = flask.make_response('{"found": true, "ranks": [186, 155, 140], "cldbid": 19, "points": 4800, "refid": "", "net-usage": 3482300, "conn-time": 4174, "needed-points": 4500, "donators": [{"name": "javad.r", "amount": 5000}, {"name": "DJ JOON", "amount": 3000}, {"name": "Acid", "amount": 10000}, {"name": "Dr.YakuZa", "amount": 10000}, {"name": "atila126", "amount": 5000}, {"name": "alirezawinner", "amount": 5000}, {"name": "green tea", "amount": 7000}, {"name": "atila126", "amount": 7000}, {"name": "alitoofan", "amount": 5000}, {"name": "|-_-|cryMORE|-_-|", "amount": 7000}, {"name": "mahdisalam", "amount": 7000}, {"name": "amir.baz", "amount": 7000}], "alert": null}')
    resp.set_cookie("csrftoken", "just-test")
    return resp

@app.route("/submit_refid", methods=["POST"])
def SubmitRefid():
    return '{"success": true, "name": "Murphy"}'

@app.route("/upgrade", methods=["POST"])
def RankUp():
    return '{"success": true, "now-ranks": [184, 155, 140], "now-point": 85, "now-needed-point": 0}'

@app.route("/submit_donation", methods=["POST"])
def Donate():
    return '{"success": true, "authority": "A000000000121"}'

app.run(host='0.0.0.0')