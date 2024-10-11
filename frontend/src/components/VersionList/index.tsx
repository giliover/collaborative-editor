import React, { useEffect, useState } from "react";
import {
  AuthorInfo,
  ListContainer,
  RevertButton,
  Title,
  VersionItem,
} from "./styles";
import api from "@services/api";
import { getUserIdAndToken } from "@global/getUserIdAndToken";

interface Version {
  _id: string;
  content: string;
  timestamp: string;
  author: {
    _id: string;
    email: string;
  };
}

interface VersionListProps {
  documentId: string;
  onRevert: (content: string) => void;
}

const VersionList: React.FC<VersionListProps> = ({ documentId, onRevert }) => {
  const { userId } = getUserIdAndToken();
  const [versions, setVersions] = useState<Version[]>([]);
  const [lastRevertion, setLastRevertion] = useState("");

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await api.get(`/documents/${documentId}/versions`);
        setVersions(
          res.data.sort(
            (a: Version, b: Version) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      } catch (error) {
        console.error("Erro ao obter versões:", error);
      }
    };

    fetchVersions();
  }, [documentId]);

  const handleRevert = async (versionId: string) => {
    try {
      const res = await api.post(
        `/documents/${documentId}/versions/${versionId}/revert`,
        { userId }
      );

      setLastRevertion(versionId);
      onRevert(res.data.content);
    } catch (error) {
      console.error("Erro ao reverter documento:", error);
    }
  };

  const getButtonText = (id: string) =>
    id === lastRevertion ? "Revertido" : "Reverter";

  return (
    <ListContainer>
      <Title>Histórico de Versões</Title>
      <ul>
        {versions.map((version) => (
          <VersionItem key={version._id}>
            <AuthorInfo>
              <p>
                <strong>Autor: </strong>
                {version.author.email}
              </p>
              <p>
                <strong>Data: </strong>
                {new Date(version.timestamp).toLocaleString()}
              </p>
            </AuthorInfo>
            <RevertButton onClick={() => handleRevert(version._id)}>
              {getButtonText(version._id)}
            </RevertButton>
          </VersionItem>
        ))}
      </ul>
    </ListContainer>
  );
};

export default VersionList;
