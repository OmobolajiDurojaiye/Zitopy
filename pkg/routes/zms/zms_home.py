from . import zms_bp
from flask import render_template

@zms_bp.route('/')
def zms_index():
    return render_template('zms/home.html') 