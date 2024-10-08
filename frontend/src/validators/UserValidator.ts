import * as yup from 'yup';

export default yup.object().shape({
    email: yup.string().email().required("Email obrigatório!"),
    password: yup.string().required("Senha obrigatório!"),
});
