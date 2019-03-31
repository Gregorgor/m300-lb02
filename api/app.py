from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return_dict = {
        "message": "Hello World",
        "value": 1234
    }
    return jsonify(return_dict)


if __name__ == "__main__":
    app.run(host="0.0.0.0")
