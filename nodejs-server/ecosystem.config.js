module.exports = {
  apps : [{
    name: 'markdown-note.nodejs-server',
    script: 'bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : 'markdown.note',
      ref  : 'origin/deploy',
      repo : 'https://github.com/diandianzd/markdown-note.git',
      path : '/home/markdown-note',
      'post-deploy' : 'git fetch origin && git reset origin/deploy --hard && sudo npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
