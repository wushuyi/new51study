module.exports = {
  apps: [

    // First application
    {
      name: 'new51study',
      script: './dist/server.js',
      env_dev: {
        "NODE_ENV": "development",
      },
      env: {
        "NODE_ENV": "production"
      },
      // watch: true,
      instances: 4,
      exec_mode: "cluster"
    },

  ]
};
