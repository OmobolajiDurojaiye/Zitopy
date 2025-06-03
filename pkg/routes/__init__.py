def register_blueprints(app):
    from .main import main_bp
    from .users import users_bp
    from .zms import zms_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(zms_bp)
