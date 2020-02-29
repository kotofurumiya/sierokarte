const axios = require('axios');

class DiscordSender {
  constructor() {
    const envs = ['DISCORD_WEBHOOK_URL'];
    envs.forEach((key) => {
      if(!process.env[key]) {
        throw new Error(`You have to set ${key} variable.`);
      }
    });
  }

  async sendMessage(message) {
    return axios.post(`${process.env.DISCORD_WEBHOOK_URL}?wait=true`, {
      content: message
    });
  }
}

module.exports = {
  DiscordSender
};