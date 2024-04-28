#!/bin/bash
source venv/bin/activate
kill -9 $(lsof -i:8000 -t) 2> /dev/null
python manage.py runserver 8000