import Mongoose from 'mongoose';

export = class Mongo {
  static async connect(mongoose: typeof Mongoose, url: string) {
    try {
      new URL(url);
    } catch (err) {
      throw new Error('Invalid connect url');
    }

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }

  static async disconnect(mongoose: typeof Mongoose) {
    await Promise.all(
      mongoose.connections.map(async (connection) => {
        await connection.close();
      })
    );
  }
};
