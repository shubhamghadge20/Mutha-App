# Guide to create and deploy containers

## Development in Windows

1. At root level of project run following command
   `bash ./build.sh 1.1.1`
   Here add version as per your versioning criteria

## Production in VM

1. Transfer frontend and backend tar files to VM in dedicated directory
2. Transfer .env.example, load.sh and docker-compose-prod.yml file to same directory where you have stored tar files
3. Provide permission to load.sh file using following command
   `chmod +x load.sh`
4. Run following command to load container
   `./load.sh`
5. Rename .env.example with .env and docker-compose-prod.yml with docker-compose.yml
   `mv .env.example .env`
   `mv docker-compose-prod.yml docker-compose.yml`
6. Edit version tag in docker-compose.yml file as per your tar files and then start app using following command
   `docker compose up -d`
