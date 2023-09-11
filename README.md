# DesafioV1

Este projeto consiste na criação de um serviço em Spring Boot para consumo de um arquivo xml e gravação no banco de dados Postgres


* Tecnologias utilizadas:
* Angular 16.2.0
* Angular Material 16.2.3
* Spring Boot 3.1.2
* Postgresql 16rc1 
* Docker
* NodeJS

## Requerimentos

Para rodar, precisamos ter instalado:

* docker

## Para rodar o projeto

1. Subir o ambiente (Postgresql) com o docker :

Na raiz do projeto, rodar:

``  docker compose up --build``
Em caso de mac:
``` docker compose --file docker-compose-arm.yml up --build ```

2. Acessar a url pelo navegador

`` http://localhost``

3. Acessar o menu upload e enviar o arquivo - aguardar até a mensagem do arquivo enviado com sucesso.