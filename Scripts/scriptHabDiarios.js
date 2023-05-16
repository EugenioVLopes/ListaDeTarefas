// Obtém a tabela
var tabela = document.getElementById("habitos-diarios");

// Adiciona um listener (bloco de código que é executado em resposta a um evento específico) de clique para todas as células da tabela
for (var i = 1; i < tabela.rows.length; i++) {
  for (var j = 1; j < tabela.rows[i].cells.length; j++) {
    tabela.rows[i].cells[j].addEventListener("click", function() {
      // Inverte o valor da célula quando clicada
      if (this.innerHTML === "") {
        this.innerHTML = "X";
      } else {
        this.innerHTML = "";
      }
    });
  }
}

document.getElementById("resultados").innerHTML = localStorage.tarefas

//Adicão da função (Lista de ordem para execução) que ira gerar a nova tarefa
function novaTarefa() {
  var nT = document.getElementById("tarefa").value;
  var data = document.getElementById("data").value;
  if (localStorage.id) {
    localStorage.setItem("id", (Number(localStorage.id) + 1));
  } else {
    localStorage.setItem("id", 0);
  }
  localStorage.setItem("tarefa" + localStorage.getItem("id"), localStorage.tarefas + " " + nT + " - " + data)
}

function exibirTarefas() {
  var resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = ""; // Limpa o conteúdo anterior da div

  // Itera (código irá percorrer todos os itens armazenados no localStorage e realizar uma determinada ação para cada um deles) sobre todas as tarefas armazenadas no localStorage
  for (var i = 0; i <= localStorage.getItem("id"); i++) {
    var tarefa = localStorage.getItem("tarefa" + i);
    if (tarefa) {
      // Cria um elemento de parágrafo(para exibir cada tarefa armazenada no localStorage) para cada tarefa e adiciona-o à div "resultados"
      var paragrafo = document.createElement("p");
      paragrafo.innerText = tarefa;

      // Cria um botão "Remover" para a tarefa e adiciona-o ao parágrafo
      var botao = document.createElement("button");
      botao.innerText = "Remover";
      botao.addEventListener("click", function() {
        // Obtém o índice da tarefa no localStorage
        var indice = this.parentElement.getAttribute("data-indice");

        // Remove a tarefa do localStorage
        localStorage.removeItem("tarefa" + indice);

        // Remove o parágrafo da tarefa da div "resultados"
        this.parentElement.remove();
      });
      paragrafo.appendChild(botao);

      // Adiciona um atributo "data-indice" ao parágrafo com o índice da tarefa no localStorage
      paragrafo.setAttribute("data-indice", i);

      resultadosDiv.appendChild(paragrafo);
    }
  }
}
