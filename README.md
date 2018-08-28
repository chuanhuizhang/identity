# Identity

An identity management, authentication and authorization service. It can server as either an individual service, or a HapiJS plugin. This service provide related API in [hal + json](https://apigility.org/documentation/api-primer/halprimer).

## Development

### Requirements
  * [Docker](https://www.docker.com/) - Use docker as dev and prod env.

#### Get Started:

  1. Download the required dependencies
  ```
    npm install
  ```

  2. Start the application:

  ```
    docker-compose up
  ```

  3. Seeding the database with a bash file, seed a `client` record to get started with auth
  ```
    ./scripts/seed_database localhost:27017 identity clients ./scripts/clients.json your_admin_username your_admin_password
  ```

  Note: you might have to ssh into docker container to rebuild bcrypt by for the first time:
  ```
  npm rebuild bcrypt --build-from-source
  ```

