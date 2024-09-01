from flask import Flask
from controllers.docker_controller import docker_app
from controllers.function_controller import function_app
import debugpy

# Allow other computers to attach to debugpy at this IP address and port.
#debugpy.listen(("localhost", 5681))
print("Waiting for debugger attach...")

app = Flask(__name__)

# Register blueprints
app.register_blueprint(docker_app)
app.register_blueprint(function_app)

if __name__ == '__main__':
    # Seem to need to turn off hot reloader in order to use debugpy
    # There's prob a way to use both
    app.run(debug=True, use_reloader=True, host='0.0.0.0', port=8001) 