import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orientn');
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Erreur de connexion MongoDB : ${error.message}`);
    console.log('💡 Note : Assurez-vous que le service MongoDB est démarré ou configurez MONGODB_URI dans server/.env');
  }
};
