const PARTICIPANTS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants"
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const STATUS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";

let people = "";
let type_message = "";
let name_input;
function rendezirarChat(){

    const promise = axios.get(MESSAGES_URL);
    // console.log(promise)
    promise.then(tratarSucesso);
}
function tratarSucesso(answer){
    //private_message
    console.log("sucesso")
    const mensagens_atualizadas = answer.data;
    // console.log(mensagens_atualizadas.length)
    // console.log(mensagens_atualizadas[0]);
    // console.log(mensagens_atualizadas[0].type);
    // console.log(mensagens_atualizadas[0].text);

    const lista_de_mensagens = document.querySelector(".content");
    

    lista_de_mensagens.innerHTML = "";
    
    for(let i = 0; i < mensagens_atualizadas.length; i++){

        if(mensagens_atualizadas[i].type === "status"){
            // console.log("eh status")
            lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> ${mensagens_atualizadas[i].text}</p>
                                         </div>`
        }
        else if(mensagens_atualizadas[i].type === "message"){
            // console.log("eh mensagem")
            lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> para <strong>${mensagens_atualizadas[i].to}</strong>: ${mensagens_atualizadas[i].text}</p>
                                         </div>`
        }
        else if(mensagens_atualizadas[i].type === "private_message"){
            if(mensagens_atualizadas[i].from === name_input || mensagens_atualizadas[i].to === name_input){
                lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> para <strong>${mensagens_atualizadas[i].to}</strong>: ${mensagens_atualizadas[i].text}</p>
                                         </div>`
            }
        }
    }

    const box_message = document.querySelector('.content div:last-child');

    box_message.scrollIntoView(true);
}
// rendezirarChat();



function entrar(){
    // console.log("entroouu")
    const button = document.querySelector(".button").classList.toggle("suma");
    const input = document.querySelector(".user-name").classList.toggle("suma");
    const carregando = document.querySelector(".loading").classList.toggle("suma");
    name_input = document.querySelector(".user-name").value;
    const promise = axios.post(PARTICIPANTS_URL, {name: name_input})
    promise.then(entrouComSucesso);
    promise.catch(erroAoEntrar);

}

function entrouComSucesso(resposta){
    console.log("sucesso")
    document.querySelector(".visibility").classList.toggle("suma");
    document.querySelector(".header").classList.toggle("suma");
    document.querySelector(".fixed-send-message").classList.toggle("suma");
    //box_message = document.querySelector("textarea");

    rendezirarChat();
    usersActive();

    setInterval(function(){
        rendezirarChat();
    }, 3000)

    setInterval(function(){
        manterOnline();
    }, 5000)

    setInterval(function(){
        usersActive();
    }, 10000)


}
function erroAoEntrar(error){
    console.log(error.response.status)
    if(error.response.status === 400){
        alert("Nome de usuário já existe")
    }
    console.log("deu ruim", error);
}


function manterOnline(){
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",{name:name_input})

    promise.then(manteveComSucesso);
    promise.catch(manteveComNaoSucesso);
}

function manteveComSucesso(){
    console.log("mais 4 segundos");
}
function manteveComNaoSucesso(error){
    console.log(error);
}


function enviarMensagem(){
    
    let message = document.querySelector("textarea");

    let inforMessage;

    if(people !== "" && type_message === "Reservadamente"){
        inforMessage = {
            from: name_input,
            to: people,
            text: message.value,
            type: "private_message"
        }
    }
    else if(people !== "" && type_message === "Público"){
        inforMessage = {
            from: name_input,
            to: people,
            text: message.value,
            type: "message"
        }
    }
    else if(people === "" && type_message !== ""){
        inforMessage = {
            from: name_input,
            to: "Todos",
            text: message.value,
            type: type_message  
        }
    }
    else{
        inforMessage = {
            from: name_input,
            to: "Todos",
            text: message.value,
            type: "message"     
        }
    }

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", inforMessage);

    message.value = "";
    
    promise.then(enviouComSucesso);
    promise.catch(erroAoEnviar);
}

function enviouComSucesso(){
    console.log("mensagem, enviada");
    
    rendezirarChat();
}
function erroAoEnviar(erro){
    console.log(erro.response.status);
    console.log("erro ao enviar essa mensagem, desconectado");
    window.location.reload()
}


/* Side bar functions*/

function choicePeople(elemento){
    console.log("Escolhi um caba");
    let selecionado = document.querySelector(".peoples .linha.selecionada") 
    
    if(selecionado !== null){
        selecionado = document.querySelector(".peoples .linha.selecionada .check").classList.remove("desaparecido");
            document.querySelector(".peoples .linha.selecionada").classList.remove("selecionada");
    }
    elemento.classList.add("selecionada");
    selecionado = document.querySelector(".peoples .linha.selecionada .check").classList.add("desaparecido") 

    // console.log(elemento.innerText)
    people = elemento.innerText;
}

function choiceVisibily(elemento){
    console.log("Escolhi um status");   
    
    let selecionado = document.querySelector(".visibility .linha.selecionada") 

    console.log(selecionado )
    
    if(selecionado !== null){
        selecionado = document.querySelector(".visibility .linha.selecionada .check").classList.remove("desaparecido");
            document.querySelector(".visibility .linha.selecionada").classList.remove("selecionada");
    }
    elemento.classList.add("selecionada");
    selecionado = document.querySelector(".visibility .linha.selecionada .check").classList.add("desaparecido") 
    console.log(elemento.innerText);
    type_message = elemento.innerText;
}   


function openSideBar(){
    const darkness = document.querySelector(".darkness")
    const sideBar = document.querySelector(".side-bar")
    const visibility = document.querySelector(".visibility")
    darkness.classList.remove("suma");
    sideBar.classList.remove("suma");
    visibility.classList.remove("suma");
}


function usersActive(){
    console.log("ôvo deixar os usuarios online aqui na side, wait")

    const promise = axios.get(PARTICIPANTS_URL);
    promise.then(sucessoAoBuscarUsers);
    promise.catch(falhaAoBuscarUsers);
}

function sucessoAoBuscarUsers(answer){
    console.log("deu");

    let listUsersActives = document.querySelector(".peoples");
    listUsersActives.innerHTML = `<li class="linha" onclick="choicePeople(this)"><ion-icon name="people"></ion-icon>Todos <ion-icon class="check desaparecido" name="checkmark-outline"></ion-icon></li>`;

    console.log(listUsersActives);

    console.log(answer.data)

    for(let i = 0; i < answer.data.length; i++){

        listUsersActives.innerHTML += `<li class="linha" onclick="choicePeople(this)"><ion-icon name="people"></ion-icon>${answer.data[i].name} <ion-icon class="check desaparecido" name="checkmark-outline"></ion-icon></li>`
    }
    
}

function falhaAoBuscarUsers(error){
    console.log("Ops! Ocorreu o um erro no servidor, estamos consertando isso.");
    console.log(eŕror)
}

// usersActive();

function closeSideBar(){
    const sideBar = document.querySelector(".side-bar");
    const header = document.querySelector(".header");
    const darkness = document.querySelector(".darkness")
    darkness.classList.add("suma");
    sideBar.classList.add("suma");
    
    showInforMessage(people, type_message);
}

function showInforMessage(user, type_message){
    const infoVisibility = document.querySelector(".info-visibility");

    infoVisibility.classList.remove("suma");

    // console.log(infoVisibility.innerText);
    if(user !== "" && type_message !== ""){
        infoVisibility.innerText = `Enviando para ${user} (${type_message})`
    }
    else if(user !== "" && type_message === ""){
        infoVisibility.innerText = `Enviando para ${user} (Público)`
    }
    else if(user === "" && type_message !== ""){
        infoVisibility.innerText = `Enviando para Todos (${type_message})`
    }
}

var texto = document.querySelector("textarea");
texto.addEventListener('focus', function() {
    texto.addEventListener('keydown', function (event) {
        if (event.keyCode === 13){
            enviarMensagem();
        }
    });
});