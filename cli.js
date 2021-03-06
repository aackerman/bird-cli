var Bird = require('bird');

var BirdCLI = {
  errors: [],
  run: function() {
    if (!this.isValid()) {
      console.log(this.errors.join(', '));
      return;
    }

    oauth = {
      consumer_key: process.env.TW_CONSUMER_KEY,
      consumer_secret: process.env.TW_CONSUMER_SECRET,
      token: process.env.TW_TOKEN,
      token_secret: process.env.TW_TOKEN_SECRET
    };

    status = process.argv.map(function(val, i) {
      if (i != 0 && i != 1) {
        return val
      }
    }).join(' ');

    if (status.length < 140) {
      Bird.tweets.update({
        oauth: oauth,
        // status: status
      }, function(err, response, body) {
        if (err) {
          console.log(err, response, body);
        } else {
          if (body) {
            try {
              body = JSON.parse(body)
            } catch(e) {
              console.log(e)
            }
          }

          if (body.errors) {
            console.log(body.errors.map(function(error){
              return error.message;
            }).join(', '))
          } else {
            console.log("posted: " + status)
          }
        }
      })
    } else {
      console.log("Status must be less than 140 characters")
    }
  },
  isValid: function() {
    this._validations();
    return this.errors.length == 0;
  },
  _validations: function() {
    this.errors = [];
    [
      'TW_CONSUMER_KEY',
      'TW_CONSUMER_SECRET',
      'TW_TOKEN',
      'TW_TOKEN_SECRET'
    ].forEach(function(v) {
      if (!process.env[v]) {
        this.errors.push("Missing environment var "+v);
      }
    }.bind(this));
  }
}

module.exports = BirdCLI;
