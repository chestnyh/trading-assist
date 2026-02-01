import { exec } from 'child_process';

// I want to run several commands synchroniously
// 1) Creating directory for docker volume
// 2) Starting docker compose from docker-compose.yml file

exec(
  'dotenv -e .env.api-int-tests -- bash -c \'mkdir -p "${DOCKER_DB_VOLUME}" && docker compose --env-file .env.api-int-tests --profile api-service-int-tests up "$@"\' --',
  (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      process.exit(1);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      process.exit(1);
    }
    console.log(stdout);
  }
);
