#/bin/bash

set -x
set -e

python -m poetry run python manage.py migrate
python -m poetry run python manage.py runserver 0.0.0.0:8000
