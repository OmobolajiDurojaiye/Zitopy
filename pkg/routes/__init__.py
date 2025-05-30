def register_blueprints(app):
    from .main import main_bp
    from .users import users_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(users_bp)
