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
    return '{"found": true, "ranks": "75,15", "cldbid": 19, "points": 2442, "refid": "Murphy", "net-usage": 34823, "conn-time": 4174, "needed-points": 4500}'

app.run(host='0.0.0.0')