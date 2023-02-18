import json
from flask import Flask, request, jsonify, Response
import uuid

app = Flask(__name__)

@app.route("/find", methods=["POST"])
def find_path():
    data = request.stream.read()
    id = uuid.uuid1()

    return jsonify(id)

@app.route("/get_path", methods=["GET"])
def get_path():
    id = request.stream.read()
    print(id)

app.run()