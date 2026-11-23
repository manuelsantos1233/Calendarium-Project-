SHELL := /bin/bash

.PHONY: help build-backend run-backend install-frontend run-frontend dev clean status

help:
	@echo "=========================================================="
	@echo " Calendário de Convívios - Java (Backend) + Next.js (Frontend)"
	@echo "=========================================================="
	@echo "  make install-frontend  - Instala dependências do Next.js"
	@echo "  make build-backend     - Compila o projeto Backend (Spring Boot / Maven)"
	@echo "  make run-backend       - Inicia o servidor Backend (Porta 8080)"
	@echo "  make run-frontend      - Inicia o servidor Frontend Next.js (Porta 3000)"
	@echo "  make dev               - Inicia backend e frontend em conjunto"
	@echo "  make clean             - Limpa build files e dados temporários"
	@echo "  make status            - Mostra o estado do Git"

install-frontend:
	cd calendario-grupo-frontend && npm install

build-backend:
	cd calendario-grupo-backend && ./mvnw clean package

run-backend:
	cd calendario-grupo-backend && ./mvnw spring-boot:run

run-frontend:
	cd calendario-grupo-frontend && npm run dev

dev:
	@set -e; \
	(cd calendario-grupo-backend && exec ./mvnw spring-boot:run) & backend_pid=$$!; \
	(cd calendario-grupo-frontend && exec npm run dev) & frontend_pid=$$!; \
	cleanup() { \
		kill "$$backend_pid" "$$frontend_pid" 2>/dev/null || true; \
		wait "$$backend_pid" "$$frontend_pid" 2>/dev/null || true; \
	}; \
	trap cleanup EXIT; \
	trap 'exit 130' INT; \
	trap 'exit 143' TERM; \
	wait -n "$$backend_pid" "$$frontend_pid"

clean:
	rm -rf backend/target frontend/.next frontend/node_modules
	@echo "Limpeza concluída."

status:
	git status
