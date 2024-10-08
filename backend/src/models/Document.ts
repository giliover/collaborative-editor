import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  content: string;
  versions: Array<IVersion>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVersion {
  content: string;
  timestamp: Date;
  author: mongoose.Types.ObjectId;
}

const VersionSchema: Schema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
});

const DocumentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    versions: [VersionSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);
