from flask import Blueprint

main_bp = Blueprint('main', __name__)

from . import routes 
from . import buy_courses