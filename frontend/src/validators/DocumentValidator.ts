import * as yup from "yup";

export default yup.object().shape({
  title: yup.string().required("Nome do documento obrigatório!"),
  content: yup.string().required("Conteúdo obrigatório!"),
  userId: yup.string().required("Usuário obrigatório!"),
});
