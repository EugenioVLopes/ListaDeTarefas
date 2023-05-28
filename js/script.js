var NLWSetup = class NLWSetup {
  data = {}
  habits = []
  days = new Set()
  constructor(form) {
    this.form = form
    this.daysContainer = this.form.querySelector(".days")
    this.form.addEventListener("change", () => this.#update())
    this.createHabits()
    this.load()
  }
  load() {
    const hasData = Object.keys(this.data).length > 0
    if (!hasData) return

    this.#registerDays()
    this.renderLayout()
  }

  #registerDays() {
    Object.keys(this.data).forEach((key) => {
      this.data[key].forEach((date) => {
        this.days.add(date)
      })
    })
  }
  renderLayout() {
    this.daysContainer.innerHTML = ""
    for (let date of this.#getSortedDays()) {
      const [month, day] = date.split("-")
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
