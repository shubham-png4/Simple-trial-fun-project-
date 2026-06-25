from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows your frontend to communicate with the backend

# Temporary in-memory database
tasks = [
    {"id": 1, "title": "Setup GitHub Profile", "completed": False},
    {"id": 2, "title": "Build Flask API", "completed": True}
]

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    new_task = {
        "id": len(tasks) + 1,
        "title": data.get("title"),
        "completed": False
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)