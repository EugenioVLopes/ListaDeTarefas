//Declarada uma variável NLWSetup e associando a ela uma classe.
var NLWSetup = class NLWSetup {
//Declara uma propriedade data dentro da classe e atribui a ela um objeto vazio.
  data = {}
//Declara uma propriedade habits dentro da classe  e  atribuí um array vazio a ela.
  habits = []
//Declarada uma propriedade days dentro da classe  e cria um novo objeto do tipo Set vazio.
//A classe Set é uma coleção de valores únicos, ou seja, não permite duplicatas.  
  days = new Set()
//Construtor recebe um parâmetro form.
  constructor(form) {
//O parâmetro form é atribuído à propriedade form do objeto atual (this). 
//O objeto criado a partir dessa classe terá uma propriedade form que armazena o valor passado ao construtor.
    this.form = form
//A propriedade daysContainer é atribuída ao resultado de this.form.querySelector(".days").
//O objeto criado terá uma propriedade daysContainer que referencia o elemento HTML com a classe "days" dentro do formulário (this.form).
    this.daysContainer = this.form.querySelector(".days")
//Quando ocorrer um evento "change" no formulário, a função this.#update() será chamada.
    this.form.addEventListener("change", () => this.#update())
//Chama a função createHabits().
    this.createHabits()
//Carrega dados.
    this.load()
  }
  load() {
//É criada uma variável hasData que verifica se a propriedade data do objeto atual (this) contém alguma chave.
//Object.keys(this.data) retorna um array contendo as chaves presentes em this.data, e length > 0 verifica se esse array tem um tamanho maior que zero.
    const hasData = Object.keys(this.data).length > 0
//Se a variável hasData for falsa (ou seja, se this.data estiver vazio), o método retorna, interrompendo a execução do restante do código.
    if (!hasData) return

    this.#registerDays()
    this.renderLayout()
  }

  #registerDays() {
//Chama Object.keys(this.data) para obter um array com as chaves presentes na propriedade data do objeto atual (this). 
//Em seguida, é utilizado o método forEach() para iterar(passar por cada elemento ou item de uma sequência de dados) sobre cada chave.
    Object.keys(this.data).forEach((key) => {
//Utiliza this.data[key] para obter um array de datas correspondente a essa chave. 
//Em seguida, é utilizado o método forEach() para iterar sobre cada data.
      this.data[key].forEach((date) => {
//Para cada data, é chamado o método add() da propriedade days (que é um objeto do tipo Set).
//Isso adiciona a data ao conjunto days, garantindo que apenas datas únicas sejam armazenadas.
        this.days.add(date)
      })
    })
  }
  renderLayout() {
//O contéudo HTML this.daysContainer é definido como uma string vazia. 
//Isso é feito para limpar qualquer conteúdo anterior.
    this.daysContainer.innerHTML = ""
// É iniciado um loop for...of usando o método #getSortedDays(). 
    for (let date of this.#getSortedDays()) {
//A data é dividida em dois valores, mês e dia, usando o método split("-") e a atribuição via desestruturação.
//A data está no formato "AAAA-MM-DD", então essa linha separa o mês e o dia.
      const [month, day] = date.split("-")
//Chama #createDayElement() passando uma string concatenada com o dia e o mês formatados.
//Esse método é responsável por criar um elemento HTML correspondente ao dia e adicioná-lo ao layout.
      this.#createDayElement(day + "/" + month)
    }
  }

  createHabits() {
    this.form
      .querySelectorAll(".habit")
      .forEach((habit) => this.#addHabit(habit.dataset.name))
  }

  #addHabit(habit) {
    this.habits = [...this.habits, habit]
    return this
  }

  #getFormattedDate(date) {
    const [day, month] = date.split("/")
    return month + "-" + day
  }

  #update() {
    const formData = new FormData(this.form)
    const prepareData = {}
    for (let habit of this.habits) {
      prepareData[habit] = formData.getAll(habit)
    }

    this.setData(prepareData)
  }
  setData(data) {
    if (!data) {
      throw "Object data is needed { habitName: [...days: string]"
    }
    this.data = data
  }

  #getSortedDays() {
    return [...this.days].sort()
  }

  dayExists(date) {
    const formattedDate = this.#getFormattedDate(date)
    return [...this.days].includes(formattedDate)
  }
  addDay(date) {
    if (!date || !date?.includes("/")) return
    if (this.dayExists(date)) return
    this.days.add(this.#getFormattedDate(date))
    this.renderLayout()
  }

  #createDayElement(date) {
    const divDay = document.createElement("div")
    divDay.setAttribute("class", "day")
    divDay.innerHTML = `<div>${date}</div>` + this.createCheckboxes(date)
    this.daysContainer.append(divDay)
  }

  createCheckboxes(date) {
    const formattedDate = this.#getFormattedDate(date)
    let checkboxes = ""
    for (let habit of this.habits) {
      checkboxes += `<input 
        type="checkbox" name="${habit}" value="${formattedDate}" 
        ${this.data[habit]?.includes(formattedDate) && "checked"}/>`
    }

    return checkboxes
  }
}

const form = document.querySelector(`#form-habits`)
const nlwSetup = new NLWSetup(form)
// Selecionando o botão dentro do header
const button = document.querySelector(`header button`)

// Function após o click
button.addEventListener(`click`, add)
// Todas as vezes que o formullário for alterado, irá salvar as informações no navegador
form.addEventListener(`change`, save)

function add() {
  // Criando ma nova data, transformando-a em data brasileira e excluindo os números de ano
  const today = new Date().toLocaleDateString(`pt-br`).slice(0, -5)
  // Verificando se o dia já existe
  const dayExists = nlwSetup.dayExists(today)

  // Se o dia já existir, não vai adiciona-lo mais
  if (dayExists === true) {
    alert(`Dia já foi incluso`)
  }
  // Se não existir, adicione-o
  else {
    nlwSetup.addDay(today)
  }
}

// Todas as vezes que o formullário for alterado, irá salvar as informações no navegador
function save() {
  localStorage.setItem(`save habits`, JSON.stringify(nlwSetup.data))
}

const data = JSON.parse(localStorage.getItem(`save habits`)) || {}
nlwSetup.setData(data)
nlwSetup.load()

//Adicão da função (Lista de ordem para execução) que ira gerar a nova tarefa
function novaTarefa() {
  var nT = document.getElementById("tarefa").value
  var data = document.getElementById("data").value
  if (localStorage.id) {
    //Verifica se "id" existe no localStore
    localStorage.setItem("id", Number(localStorage.id) + 1) //Se a chave "id" já existe no localStorage, incrementa o seu valor em 1.
  } else {
    //Se a chave "id" ainda não existe no localStorage, é criado a chave "id" com um valor inicial de "0".
    localStorage.setItem("id", 0)
  }
  localStorage.setItem("tarefa" + localStorage.getItem("id"), nT + " - " + data)
  //Adiciona uma nova tarefa no localStorage com um nome e data específicos e uma chave única que é criada com base em um valor incrementado previamente armazenado no localStorage.
  exibirTarefas()
}

function exibirTarefas() {
  var resultadosDiv = document.getElementById("resultados")
  resultadosDiv.innerHTML = "" // Limpa o conteúdo anterior da div

  // Itera (código irá percorrer todos os itens armazenados no localStorage e realizar uma determinada ação para cada um deles) sobre todas as tarefas armazenadas no localStorage
  for (var i = 0; i <= localStorage.getItem("id"); i++) {
    var tarefa = localStorage.getItem("tarefa" + i)
    if (tarefa) {
      // Cria um elemento de item(para exibir cada tarefa armazenada no localStorage) para cada tarefa e adiciona-o à div "resultados"
      var item = document.createElement("p")
      item.innerText = tarefa

      // Cria um botão "Remover" para a tarefa e adiciona-o ao item
      var botao = document.createElement("button")
      botao.innerText = "Remover"
      botao.addEventListener("click", function () {
        // Obtém o índice da tarefa no localStorage
        var indice = this.parentElement.getAttribute("data-indice")

        // Remove a tarefa do localStorage
        localStorage.removeItem("tarefa" + indice)

        // Remove o item da tarefa da div "resultados"
        this.parentElement.remove()
      })
      item.appendChild(botao)

      // Adiciona um atributo "data-indice" ao item com o índice da tarefa no localStorage
      item.setAttribute("data-indice", i)

      resultadosDiv.appendChild(item)
    }
  }
}
