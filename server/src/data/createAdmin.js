import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Administrateur from '../models/Administrateur.js';
import { nextId } from '../utils/nextId.js';

dotenv.config();

const [login = 'admin', password = 'Admin@2026'] = process.argv.slice(2);

await mongoose.connect(process.env.MONGODB_URI);
const hash = await bcrypt.hash(password, 10);
await Administrateur.findOneAndUpdate(
  { login },
  { $set: { motDePasseHash: hash }, $setOnInsert: { id: await nextId(Administrateur) } },
  { upsert: true }
);
console.log(`✅ Admin "${login}" prêt.`);
await mongoose.disconnect();