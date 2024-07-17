import mongoose from 'mongoose';

const uri =
  'mongodb+srv://basic:aQIVvWgxQdMDVyI6@cluster.tewuo07.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster';

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

async function connectToDatabase() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (err) {
    console.log('Database cannot be connected', err);
  }
}

export default connectToDatabase;
