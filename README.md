# Nosso Diário Visual

Aplicação para o grupo partilhar fotografias associadas a datas e guardar memórias.

## Executar localmente

Com Java 17 e Node.js instalados, inicia os dois servidores a partir da raiz:

```bash
make dev
```

O backend fica em `http://localhost:8080` e o frontend em `http://localhost:3000`. Para parar ambos, usa `Ctrl+C`.

Também podes iniciá-los separadamente:

```bash
cd calendario-grupo-backend && ./mvnw spring-boot:run
cd calendario-grupo-frontend && npm run dev
```

Abre <http://localhost:3000/dashboard>.

## Persistência local

- As fotografias ficam em `calendario-grupo-backend/uploads/`.
- Os metadados (data, nome e legenda) ficam na base de dados H2 em `calendario-grupo-backend/data/`.
- A tabela SQL `photos` é criada e atualizada automaticamente quando o backend inicia.
- São aceites JPEG, PNG e GIF, até 10 MB por fotografia.
- Esta configuração guarda os dados apenas neste computador; antes de publicar a aplicação, será necessário migrar para armazenamento e base de dados alojados.
