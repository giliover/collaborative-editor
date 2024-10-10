import { Router, Response, Request } from "express";
import { authenticateToken } from "../middlewares/auth";
import Document from "../models/Document";

const router = Router();

router.post("/", authenticateToken, async (req: any, res) => {
  const { title, content, userId } = req.body;
  try {
    const document = new Document({
      title,
      content: content || "",
      owner: userId,
      versions: [
        {
          content: content || "",
          author: userId,
          timestamp: new Date(),
        },
      ],
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error("Erro ao criar documento:", error);
    res.status(500).json({ error: "Erro ao criar documento" });
  }
});

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

router.get(
  "/:id/versions",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await Document.findById(req.params.id).populate(
        "versions.author",
        "email"
      );

      if (!document) {
        res.status(404).json({ error: "Documento não encontrado" });
        return;
      }

      res.status(200).json(document.versions);
    } catch (error) {
      console.error("Erro ao obter versões:", error);
      res.status(500).json({ error: "Erro ao obter versões" });
    }
  }
);

router.post(
  "/:id/versions/:versionId/revert",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        res.status(404).json({ error: "Documento não encontrado" });
        return;
      }

      const version = document.versions.id(req.params.versionId);
      if (!version) {
        res.status(404).json({ error: "Versão não encontrada" });
        return;
      }

      document.versions.push({
        content: document.content,
        author: req.body.userId,
        timestamp: new Date(),
      });

      document.content = version.content;
      await document.save();

      res.status(200).json({
        message: "Documento revertido com sucesso",
        content: document.content,
      });
    } catch (error) {
      console.error("Erro ao reverter documento:", error);
      res.status(500).json({ error: "Erro ao reverter documento" });
    }
  }
);

export default router;
