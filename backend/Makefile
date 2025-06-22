VENV ?= venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip

.PHONY: install run start lint format

install:
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run:
	# Development mode with hot-reload
	$(PYTHON) -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

start:
	# Production mode without reload
	$(PYTHON) -m uvicorn app.main:app --host 0.0.0.0 --port 8000

lint:
	$(VENV)/bin/flake8 app

format:
	$(VENV)/bin/black app
