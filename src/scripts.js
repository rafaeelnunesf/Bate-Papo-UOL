let userName
let toUser = 'Todos'
let typeMessage = 'message'

function wait() {
    const divWait = document.querySelector('.wait')
    const inputs = document.querySelector('.inputs')
    // Esconder o botao e o input no inicio
    inputs.classList.add('hidden')
    // Mostrar o icone de carregamento
    divWait.classList.remove('hidden')
    setTimeout(userEnter,1000)
}

function userEnter() {
    const inputScreen = document.querySelector('.input-screen')
    userName = document.querySelector('.input-screen input').value

    // Caso o usuário não insira nenhum nome
    if(userName===''){
        alert('insira um nome por favor')
        window.location.reload()
        return
    }
    // Esconde a tela de inicio
    inputScreen.classList.add('hidden')
    EnterRoom()
}

let EnterRoom = () => {
    userName = {
        name: userName
    }
    // usuario entra na sala
    let registerUser = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',userName)

    // Se der erro é porque o usuário já está cadastrado
    registerUser.catch(errorRegister)
    function errorRegister(answer) {
        alert('usuário já cadastrado, tente outro nome por favor')
        window.location.reload()
    }

    GetMessages()
    setInterval(GetMessages,3000)
    setInterval(keepConection,5000,userName)
}

function keepConection(Name) {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status',Name) 
}

function GetMessages(){
    let promiseGetMessages = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promiseGetMessages.then(LoadMessages)
    function LoadMessages(answer){
        let messages = answer.data
        let messagesHTML = document.querySelector(".messages")
        messagesHTML.innerHTML=""
        let array = []

        let statusMessages
        let fromMessages
        let textMessages
        let toMessages
        let timeMessages
        
        for(let i = 0; i < messages.length;i++){
            statusMessages = messages[i].type
            fromMessages = messages[i].from
            textMessages = messages[i].text
            toMessages = messages[i].to
            timeMessages = messages[i].time
            if(statusMessages === 'status'){
                array.push(`
                <div class="status">
                <p>
                <span class="time">(${timeMessages})&nbsp;</span><span class="send-user">${fromMessages}&nbsp;</span>${textMessages}
                </p>
                </div>
                `)
            }else if (statusMessages === 'private_message' && (fromMessages===userName.name || toMessages=== userName.name)){
                array.push(`
                <div class="private-message" data-identifier="message">
                    <p>
                        <span class="time">${timeMessages}</span>&nbsp;<span class="send-user">${fromMessages}&nbsp;</span>reservadamente para&nbsp;<span class="receive-user">${toMessages}</span>:&nbsp;${textMessages}
                    </p>
                </div>
                `)
            }else if(statusMessages === 'message'){                
                array.push(`
                <div class="message" data-identifier="message">
                    <p>
                        <span class="time">${timeMessages}</span>&nbsp;<span class="send-user">${fromMessages}&nbsp;</span>para&nbsp;<span class="receive-user">${toMessages}</span>:&nbsp;${textMessages}
                    </p>
                </div>
                `)
            }
        }
        
        // Escreve  as mensagens no HTML 
        for (let i =0; i< array.length;i++){
            messagesHTML.innerHTML += array[i]
        }

        // 'Scrolla' até a ultima mensagem 
        messagesHTML.children[array.length-1].scrollIntoView();
    }
}

let sendMessage = () =>{
    const text = document.querySelector('.footer input')

    let message = {
        from: userName.name,
        to: toUser,
        text: text.value,
        type: typeMessage
    }
    text.value = ''

    //Se não estiver nada escrito no campo de mensagens não acontece nada
    if (message.text===""){
        return
    }

    let request = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',message)

    request.then(successSendMsg)
    request.catch(errorSendMsg)

    function successSendMsg (answer){
        GetMessages() 
    }
    function errorSendMsg(answer) {
        alert('usuário saiu da sala')
        window.location.reload()  
    }
}

function addTransition(){
    getParticipants()
    setInterval(getParticipants,10000)
    
    // Mudar pra undefined pra não aparecer marcado quando abrir o menu de participantes
    toUser = undefined
    typeMessage = undefined
    // Adicionar a classe hidden pra não aparecer marcado quando abrir o menu de participantes
    const public = document.querySelector('.public').children[2]
    const private = document.querySelector('.private').children[2]
    public.classList.add('hidden')
    private.classList.add('hidden')

    // Adiciona a classe index para o menu de participantes sobrepor as mensagens, header e footer
    let header = document.querySelector('header')
    let footer = document.querySelector('.footer')
    let messages = document.querySelector('.messages') 
    header.classList.add('add-index')
    footer.classList.add('add-index')
    messages.classList.add('add-index-messages')

    // Tira a clase Hidden e adiciona classe transition
    let activeParticipants = document.querySelector('.active-participants')
    let background = document.querySelector('.background')
    let contacts = document.querySelector('.contacts')
    
    activeParticipants.classList.remove('hidden')
    background.classList.remove('hidden')
    contacts.classList.remove('hidden')

    activeParticipants.classList.add('transition')
    background.classList.add('transition')
    contacts.classList.add('transition')

}

function getParticipants() {
    let promiseGetParticipants = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    promiseGetParticipants.then(successGetParticipants)
    function successGetParticipants(answer) {
        let users = document.querySelector('.users')
        let participants = answer.data

        users.innerHTML = ""
        users.innerHTML = `
            <div class="everyone" onclick="chooseContact(this)">
                <ion-icon name="people" class="profile-icon"></ion-icon>
                <p>Todos</p>
                <ion-icon name="checkmark-sharp" class="check hidden"></ion-icon>
            </div>
            `
        for(let i =0; i<participants.length;i++){
            users.innerHTML += `
                <div class="participant" data-identifier="participant" onclick="chooseContact(this)">
                    <ion-icon name="person-circle" class="profile-icon"></ion-icon>
                    <p>${participants[i].name}</p>
                    <ion-icon name="checkmark-sharp" class="check hidden"></ion-icon>
                </div>
                `
        }
    }   
}

function chooseContact(contact) {
    const check = contact.children[2]
    const div = contact.parentNode

    // Caso o usuário selecione Todos, automaticamente seleciona a visibilidade publico
    if(contact===div.children[0]){
        const visibility = document.querySelector('.public')
        check.classList.remove('hidden')
        toUser = contact.children[1].innerHTML
        chooseVisibility(visibility)
        removeTransition()
        return
    }

    // Para o caso de ser o 2 clique no menu de participante
    // Verifica todos os particiopantes e tira o check se existir algum marcado
    for(let i =0; i<div.childElementCount;i++){
        let iconCheck = div.children[i].children[2]
        let condition = iconCheck.classList.contains('hidden')
        if(!condition){
            iconCheck.classList.add('hidden')
        }
    }
    check.classList.remove('hidden')
    toUser = contact.children[1].innerHTML
    
    removeTransition()
}
function chooseVisibility(visibility) {
    const check = visibility.children[2]
    const div = visibility.parentNode

    // Para o caso de ser o 2 clique no menu de participante
    // Verifica todos os visibilidades e tira o check se existir alguma marcada
    for(let i =0; i<div.childElementCount;i++){
        let iconCheck = div.children[i].children[2]
        let condition = iconCheck.classList.contains('hidden')
        if(!condition){
            iconCheck.classList.add('hidden')
        }
    }
    check.classList.remove('hidden')

    if(visibility===div.children[0]){
        typeMessage = 'message'
    }else if(visibility===div.children[1]){
        typeMessage = 'private_message'
    }
    removeTransition()
}
function removeTransition(background) {
    infoMsg()
    console.log(background)
    // Se for clicado no background o cod entende que é pra todos
    if(background !== undefined){
        toUser = 'Todos'
        typeMessage = 'message'
    }

    // Quando o usuário seleciona o participante e a visibilidade
    if(toUser!==undefined && typeMessage!==undefined){

        let header = document.querySelector('header')
        let footer = document.querySelector('.footer')
        let messages = document.querySelector('.messages')
        
        let activeParticipants = document.querySelector('.active-participants')
        let background = document.querySelector('.background')
        let contacts = document.querySelector('.contacts')
        
        activeParticipants.classList.add('hidden')
        background.classList.add('hidden')
        contacts.classList.add('hidden')

        activeParticipants.classList.remove('transition')
        background.classList.remove('transition')
        contacts.classList.remove('transition')

        header.classList.remove('add-index')
        footer.classList.remove('add-index')
        messages.classList.remove('add-index-messags')
    }
}

function infoMsg(){
    const textBoxInfo = document.querySelector('.message-info')
    if(typeMessage==='message'){
        textBoxInfo.innerHTML = `Enviando para&nbsp<span class="to-message">${toUser}</span>&nbsp(Público)`
    }else if(typeMessage==='private_message'){
        textBoxInfo.innerHTML = `Enviando para&nbsp<span class="to-message">${toUser}</span>(Reservadamente)`
    }
}

// Entrar na sala e envio com enter
document.onkeyup=function(e){
    if(e.which !== 13){
    return
    } 
    const element = document.querySelector('.input-screen.hidden')
    
    if(!!element){//se for true
        sendMessage()
    }else{
        wait()
    }
}