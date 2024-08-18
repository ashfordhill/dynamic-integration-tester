from flask import Flask
from controllers.docker_controller import docker_app
from controllers.function_controller import function_app

app = Flask(__name__)

# Register blueprints
app.register_blueprint(docker_app)
app.register_blueprint(function_app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8001) 