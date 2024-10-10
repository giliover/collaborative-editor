import request from "supertest";
import mongoose, { ObjectId } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src";
import Document from "../../src/models/Document";
import User from "../../src/models/User";
import jwt from "jsonwebtoken";

jest.mock("../../src/middlewares/auth", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: "mockUserId" };
    next();
  },
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: "7.0.3",
    },
  });

  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
}, 20000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Document Routes", () => {
  let token: string;
  let mockUserId: string;

  beforeEach(async () => {
    const user = new User({
      email: "user@test.com",
      password: "password123",
    });
    await user.save();

    mockUserId = (user._id as ObjectId).toString();

    token = jwt.sign({ id: mockUserId }, "secret", { expiresIn: "1h" });
  });

  afterEach(async () => {
    await Document.deleteMany({});
    await User.deleteMany({});
  });

  it("should create a new document", async () => {
    const res = await request(app)
      .post("/api/documents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Document",
        content: "This is the content",
        userId: mockUserId,
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Document");
    expect(res.body.content).toBe("This is the content");
  });

  it("should return a document by id", async () => {
    const document = new Document({
      title: "Existing Document",
      content: "Some content",
      owner: mockUserId,
      versions: [{ content: "Some content", author: mockUserId }],
    });
    await document.save();

    const res = await request(app)
      .get(`/api/documents/${document._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Existing Document");
  });

  it("should return 404 if document not found", async () => {
    const res = await request(app)
      .get(`/api/documents/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should update a document by id", async () => {
    const document = new Document({
      title: "Document to update",
      content: "Old content",
      owner: mockUserId,
      versions: [{ content: "Old content", author: mockUserId }],
    });
    await document.save();

    const res = await request(app)
      .put(`/api/documents/${document._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Document", content: "New content" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Document");
    expect(res.body.content).toBe("New content");
  });

  it("should return document versions", async () => {
    const document = new Document({
      title: "Document with versions",
      content: "Initial content",
      owner: mockUserId,
      versions: [{ content: "Initial content", author: mockUserId }],
    });
    await document.save();

    const res = await request(app)
      .get(`/api/documents/${document._id}/versions`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].content).toBe("Initial content");
  });

  it("should revert a document to a previous version", async () => {
    const document = new Document({
      title: "Revertable document",
      content: "Current content",
      owner: mockUserId,
      versions: [
        { content: "Version 1", author: mockUserId },
        { content: "Version 2", author: mockUserId },
      ],
    });
    await document.save();

    const versionId = document.versions[0]._id;

    const res = await request(app)
      .post(`/api/documents/${document._id}/versions/${versionId}/revert`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: mockUserId });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Version 1");
  });
});
