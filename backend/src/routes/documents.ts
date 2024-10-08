import { Router, Response, Request } from "express";
import { authenticateToken } from "../middlewares/auth";
import Document from "../models/Document";

const router = Router();

router.post(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const { title } = req.body;
    try {
      const document = new Document({ title });
      await document.save();
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar documento" });
    }
  }
);

router.get(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        res.status(404).json({ error: "Documento não encontrado" });
        return;
      }
      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter documento" });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await Document.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!document) {
        res.status(404).json({ error: "Documento não encontrado" });
        return;
      }
      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar documento" });
    }
  }
);

export default router;
