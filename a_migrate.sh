#!/bin/bash
source venv/bin/activate

python manage.py makemigrations users

python manage.py migrate
