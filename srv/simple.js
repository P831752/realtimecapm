module.exports = (srv) => {
    srv.on('HelloWorld', (req) => {
      return "Hello " + req.data.spiderman;
    })
  }