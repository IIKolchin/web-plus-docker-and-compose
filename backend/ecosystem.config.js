import dotenv from 'dotenv';

dotenv.config({ path: './.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REPO,
  DEPLOY_PATH_ENV,
  DEPLOY_REF = 'origin/main',
} = process.env;

export const apps = [
  {
    name: 'api-service',
    script: '/app/dist/main.js',
  },
];
export const deploy = {
  production: {
    user: DEPLOY_USER,
    host: DEPLOY_HOST,
    ref: DEPLOY_REF,
    repo: DEPLOY_REPO,
    path: DEPLOY_PATH,
    'pre-deploy-local': `scp ./.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_ENV}`,
    'post-deploy': 'docker compose up --build -d',
  },
};
