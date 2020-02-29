const { Firestore } = require('@google-cloud/firestore');

class CloudFirestoreConnector {
  #firestore;

  constructor() {
    const envs = ['PROJECT_ID', 'CLIENT_EMAIL', 'PRIVATE_KEY'];
    envs.forEach((key) => {
      if(!process.env[key]) {
        throw new Error(`You have to set ${key} variable.`);
      }
    });

    this.#firestore = new Firestore({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
      }
    });
  }

  async getPastArticles() {
    const docRef = this.#firestore.collection('sierokarte').doc('shelf');
    const data = await docRef.get().then((snapshot) => snapshot.data());
    return (data || {}).articles || [];
  }

  async writePastArticles(articles) {
    const docRef = this.#firestore.collection('sierokarte').doc('shelf');
    return docRef.set({articles});
  }
}

module.exports = {
  CloudFirestoreConnector
};