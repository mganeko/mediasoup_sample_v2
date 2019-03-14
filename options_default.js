'use strict';

module.exports =
  {
    serverOptions: {
      listenPort: 3000,
      hostName: 'localhost',
      useHttps: false,
      httpsKeyFile: 'cert/server.key',
      httpsCertFile: 'cert/server.crt',
      dummyTail: false
    }
  }
