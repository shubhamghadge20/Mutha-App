# Guide to create and deploy containers

## Development in Windows

1. At root level move docker-compose-dev.yml to docker-compose.yml
   `mv docker-compose-dev.yml docker-compose.yml`
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

## Virtual Box shared folder settings

1. Poweroff the VM
2. Go to Settings -> Shared Folders
3. Click on + icon and select folder to share with VM from Folder Path
4. Give a Folder name, ex - Mutha
5. Select Auto-Mount
6. Click Ok and start the VM
7. Inside VM create directory as -
   `sudo mkdir -p /mnt/Mutha-Files`
8. Mount Directory
   `sudo mount -t vboxsf Mutha '/mnt/Mutha'`
9. Verify if files are shared in
   `ls /mnt/Mutha-Files`
