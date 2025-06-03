from flask import Blueprint

zms_bp = Blueprint('zms', __name__, url_prefix='/zms')

from . import zms_home
from . import zms_auth
