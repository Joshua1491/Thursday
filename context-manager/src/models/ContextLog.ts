import mongoose, { Schema, Document } from 'mongoose';

export interface ContextLog extends Document {
  requestId: string;
  userId: string;
  roles: string[];
  timestamp: Date;
  event: string;
  details: any;
}

const ContextLogSchema = new Schema<ContextLog>({
  requestId: { type: String, required: true, index: true },
  userId:    { type: String, required: true },
  roles:     [{ type: String }],
  timestamp: { type: Date,   required: true },
  event:     { type: String, required: true },
  details:   { type: Schema.Types.Mixed }
});

export default mongoose.model<ContextLog>('ContextLog', ContextLogSchema); 