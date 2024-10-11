import request from "supertest";
import mongoose, { ObjectId } from "mongoose";
import app from "../../src";
import User from "../../src/models/User";
import jwt from "jsonwebtoken";
import MongoMemoryServer from "mongodb-memory-server-core";

User.prototype.comparePassword = jest.fn(async function (password: string) {
  return password === this.password;
});
let mongoServer: MongoMemoryServer;

describe("Auth Routes", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: "7.0.3",
      },
    });

    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();

    await mongoose.connect(uri);
  }, 20000);

  beforeEach(async () => {
    await User.deleteMany({});
  }, 20000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  }, 20000);

  describe("POST /api/auth/register", () => {
    it("should register a new user and return a token", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();

      const decoded = jwt.verify(
        res.body.token,
        process.env.JWT_SECRET || "secret"
      );
      expect(decoded).toHaveProperty("id");

      const user = await User.findOne({ email: "test@example.com" });
      expect(user).not.toBeNull();
      expect(user?.email).toBe("test@example.com");
    });

    it("should return 500 if there is an error during registration", async () => {
      jest.spyOn(User.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Erro ao registrar usuário");
      });

      const res = await request(app).post("/api/auth/register").send({
        email: "error@example.com",
        password: "password123",
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao registrar usuário");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should register and login a user", async () => {
      const payload = {
        email: "login@example.com",
        password: "password123",
      };

      const req = request(app);

      const userRegistered = await req.post("/api/auth/register").send(payload);
      expect(userRegistered.status).toBe(201);

      const mockComparePassword = jest.spyOn(User.prototype, "comparePassword");
      mockComparePassword.mockResolvedValue(true);

      const loginRes = await req.post("/api/auth/login").send(payload);
      expect(loginRes.status).toBe(200);
      expect(loginRes.body.token).toBeDefined();
    });

    it("should return 400 if credentials are invalid (wrong password)", async () => {
      const user = new User({
        email: "login@example.com",
        password: "password123",
      });
      await user.save();

      const mockComparePassword = jest.spyOn(User.prototype, "comparePassword");
      mockComparePassword.mockResolvedValue(false);

      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Credenciais inválidas");
    });

    it("should return 400 if user does not exist", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Credenciais inválidas");
    });

    it("should return 500 if there is an error during authentication", async () => {
      jest.spyOn(User, "findOne").mockImplementationOnce(() => {
        throw new Error("Erro ao autenticar usuário");
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao autenticar usuário");
    });
  });
});
