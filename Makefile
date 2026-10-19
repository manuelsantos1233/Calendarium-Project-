.PHONY: help install build run clean status

help:
	@echo "=========================================================="
	@echo " Calendário de Convívios em C (Servidor HTTP + Backend/Frontend)"
	@echo "=========================================================="
	@echo "  make install - Verifica dependências (gcc, make)"
	@echo "  make build   - Compila o servidor C"
	@echo "  make run     - Compila e executa o servidor na porta 8080"
	@echo "  make clean   - Remove binários e limpa dados"
	@echo "  make status  - Mostra o estado do Git"

install:
	@echo "A verificar ferramentas de compilação..."
	gcc --version
	@echo "Pronto! Podes executar 'make run'."

build:
	mkdir -p public uploads data
	gcc -O2 server.c -o server -lpthread
	@echo "Compilação concluída com sucesso! Executável 'server' gerado."

run: build
	@echo "A iniciar servidor web em http://localhost:8080 ..."
	./server

clean:
	rm -f server
	rm -rf data/* uploads/*
	@echo "Ambiente limpo."

status:
	git status
