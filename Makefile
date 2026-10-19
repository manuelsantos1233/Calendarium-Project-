.PHONY: help build-backend run-backend install-frontend run-frontend clean status

help:
	@echo "=========================================================="
	@echo " Calendário de Convívios - Java (Backend) + Next.js (Frontend)"
	@echo "=========================================================="
	@echo "  make install-frontend  - Instala dependências do Next.js"
	@echo "  make build-backend     - Compila o projeto Backend (Spring Boot / Maven)"
	@echo "  make run-backend       - Inicia o servidor Backend (Porta 8080)"
	@echo "  make run-frontend      - Inicia o servidor Frontend Next.js (Porta 3000)"
	@echo "  make clean             - Limpa build files e dados temporários"
	@echo "  make status            - Mostra o estado do Git"

install-frontend:
	cd frontend && npm install

build-backend:
	cd backend && ./mvnw clean package

run-backend:
	cd backend && ./mvnw spring-boot:run

run-frontend:
	cd frontend && npm run dev

clean:
	rm -rf backend/target frontend/.next frontend/node_modules
	@echo "Limpeza concluída."

status:
	git status
