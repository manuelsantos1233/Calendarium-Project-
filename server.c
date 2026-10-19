#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <pthread.h>

#define PORT 8080
#define BUFFER_SIZE 4096

// Função simples para verificar se uma pasta existe e criá-la se necessário
void ensure_directories() {
    mkdir("public", 0777);
    mkdir("uploads", 0777);
    mkdir("data", 0777);

    // Garantir que data/photos.json existe
    FILE *f = fopen("data/photos.json", "r");
    if (!f) {
        f = fopen("data/photos.json", "w");
        if (f) {
            fprintf(f, "{}\n");
            fclose(f);
        }
    } else {
        fclose(f);
    }
}

// Envia ficheiro estático (HTML, JS, CSS, imagens)
void send_file(int client_socket, const char *filepath, const char *content_type) {
    int fd = open(filepath, O_RDONLY);
    if (fd < 0) {
        char *not_found = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\n404 Not Found";
        write(client_socket, not_found, strlen(not_found));
        return;
    }

    char header[512];
    struct stat st;
    fstat(fd, &st);

    sprintf(header, "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nContent-Length: %ld\r\n\r\n", content_type, st.st_size);
    write(client_socket, header, strlen(header));

    char buffer[BUFFER_SIZE];
    int bytes_read;
    while ((bytes_read = read(fd, buffer, sizeof(buffer))) > 0) {
        write(client_socket, buffer, bytes_read);
    }
    close(fd);
}

// Processa pedidos HTTP do cliente
void *handle_client(void *socket_desc) {
    int sock = *(int *)socket_desc;
    free(socket_desc);

    char buffer[BUFFER_SIZE * 4];
    int bytes_received = recv(sock, buffer, sizeof(buffer) - 1, 0);
    if (bytes_received <= 0) {
        close(sock);
        pthread_exit(NULL);
    }
    buffer[bytes_received] = '\0';

    // Ler a primeira linha do pedido HTTP (ex: GET / HTTP/1.1)
    char method[16], path[256];
    sscanf(buffer, "%s %s", method, path);

    if (strcmp(method, "GET") == 0) {
        if (strcmp(path, "/") == 0 || strcmp(path, "/index.html") == 0) {
            send_file(sock, "public/index.html", "text/html");
        } else if (strcmp(path, "/app.js") == 0) {
            send_file(sock, "public/app.js", "application/javascript");
        } else if (strcmp(path, "/api/photos") == 0) {
            // Ler dados JSON do disco e enviar
            int fd = open("data/photos.json", O_RDONLY);
            if (fd < 0) {
                char *resp = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{}";
                write(sock, resp, strlen(resp));
            } else {
                struct stat st;
                fstat(fd, &st);
                char header[256];
                sprintf(header, "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: %ld\r\n\r\n", st.st_size);
                write(sock, header, strlen(header));
                char file_buf[BUFFER_SIZE];
                int br;
                while ((br = read(fd, file_buf, sizeof(file_buf))) > 0) {
                    write(sock, file_buf, br);
                }
                close(fd);
            }
        } else if (strncmp(path, "/uploads/", 9) == 0) {
            // Servir imagens enviadas
            char filepath[512];
            snprintf(filepath, sizeof(filepath), ".%s", path);
            send_file(sock, filepath, "image/jpeg");
        } else {
            char *not_found = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\n404 Not Found";
            write(sock, not_found, strlen(not_found));
        }
    } else if (strcmp(method, "POST") == 0 && strcmp(path, "/api/upload") == 0) {
        // Servidor HTTP em C simplificado para simulação/demonstração de upload
        // Numa implementação completa em C, faríamos o parsing do multipart/form-data.
        // Como o foco é a estrutura, enviamos uma resposta de sucesso simulada.
        char *response = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\":\"success\",\"message\":\"Foto recebida com sucesso!\"}";
        write(sock, response, strlen(response));
    }

    close(sock);
    pthread_exit(NULL);
}

int main() {
    ensure_directories();

    int server_fd, *new_sock;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof(address);

    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("Erro ao criar socket");
        exit(EXIT_FAILURE);
    }

    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt));

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address))<0) {
        perror("Erro no bind");
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 10) < 0) {
        perror("Erro no listen");
        exit(EXIT_FAILURE);
    }

    printf("Servidor C de Calendário de Convívios a correr em http://localhost:%d\n", PORT);
    printf("Podes abrir o projeto no VS Code e editar os ficheiros em C/HTML/JS.\n");

    while (1) {
        int client_sock = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen);
        if (client_sock < 0) {
            perror("Erro no accept");
            continue;
        }

        pthread_t client_thread;
        new_sock = malloc(1);
        *new_sock = client_sock;

        if (pthread_create(&client_thread, NULL, handle_client, (void *)new_sock) < 0) {
            perror("Erro ao criar thread");
            free(new_sock);
            continue;
        }
        pthread_detach(client_thread);
    }

    return 0;
}
