import mongoose, { Document, Schema } from 'mongoose';

export interface IVersion extends mongoose.Document {
  content: string;
  timestamp: Date;
  author: mongoose.Types.ObjectId;
}

export interface IDocument extends Document {
  title: string;
  content: string;
  owner: mongoose.Types.ObjectId;
  versions: mongoose.Types.DocumentArray<IVersion>;
  createdAt: Date;
  updatedAt: Date;
}

const VersionSchema: Schema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

const DocumentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    versions: [VersionSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);
