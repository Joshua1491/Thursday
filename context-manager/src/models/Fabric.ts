import { Schema, model } from 'mongoose';

const FabricSchema = new Schema({
  epc:           { type: String, required: true, unique: true },
  name:          String,
  color:         String,
  weight:        Number,
  location:      String,
  tagIssuedOn:   Date,
  rollType:      String,
  createdAt:     { type: Date, default: Date.now }
});

export default model('Fabric', FabricSchema); 