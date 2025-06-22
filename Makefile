# Root Makefile

.PHONY: install-backend install-frontend run-backend run-frontend run-all

install-backend:
	$(MAKE) -C backend install

install-frontend:
	$(MAKE) -C frontend install

run-backend:
	$(MAKE) -C backend run

run-frontend:
	$(MAKE) -C frontend run

run-all:
	@echo "Starting backend and frontend..."
	@$(MAKE) -C backend run & \
	$(MAKE) -C frontend run
