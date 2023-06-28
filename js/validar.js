const usuarios = [
  {
    login: "eugenio",
    pass: "eugenio",
  },
  {
    login: "lucas",
    pass: "lucas",
  },
  {
    login: "admin",
    pass: "admin",
  },
];

let botao = document.getElementById("btn-login");

botao.addEventListener("click", function logar() {
  let reqUsuario = document.getElementById("usuario").value;
  let reqSenha = document.getElementById("senha").value;
  let validaLogin = false;

  for (let i in usuarios) {
    if (reqUsuario === usuarios[i].login && reqSenha === usuarios[i].pass) {
      validaLogin = true;
      break;
    }
  }
  if (validaLogin == true) {
    location.href="listadetarefas.html";
  } else {
    alert("Usuário ou senha inválido");
  }
});
