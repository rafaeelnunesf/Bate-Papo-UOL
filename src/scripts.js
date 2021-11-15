let userName

function userEnter() {
    const inputScreen = document.querySelector('.input-screen')
    if(inputScreen.classList.contains('hidden')){
        inputScreen.classList.remove('hidden')
    }
    userName = document.querySelector('.input-screen input').value
    inputScreen.classList.add('hidden')
    EnterRoom()
}
function addTransition(){
    let header = document.querySelector('header')
    let footer = document.querySelector('.footer')
    let messages = document.querySelector('.messages')
    
    let activeParticipants = document.querySelector('.active-participants')
    let background = document.querySelector('.background')
    let contacts = document.querySelector('.contacts')
    
    activeParticipants.classList.remove('hidden')
    background.classList.remove('hidden')
    contacts.classList.remove('hidden')

    activeParticipants.classList.add('transition')
    background.classList.add('transition')
    contacts.classList.add('transition')

    /* messages.classList.add('hidden') */
    header.classList.add('add-index')
    footer.classList.add('add-index')
    messages.classList.add('add-index-messages')
    console.log('sto clicando');
  }
// Essa função entra na sala
let EnterRoom = () => {
    userName = {
        name: userName
    }

    let registerUser = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',userName)
    registerUser.catch(errorRegister)
    function errorRegister(answer) {
        alert('usuário já cadastrado, tente outro nome por favor')
        window.location.reload()
    }
    GetMessages()
    setInterval(GetMessages,3000)
}


//Essa função mantém o usuário conectado
function keepConection(userName) {
    let axiosUserInRoom = (userName) => axios.post('https://mock-api.driven.com.br/api/v4/uol/status',userName)
    setInterval(axiosUserInRoom,5000,userName)
}

// Essa função carrega as mensagens
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
            }else if (statusMessages === 'private_message'){
                array.push(`
                <div class="private-message">
                    <p>
                        <span class="time">(${timeMessages})&nbsp;</span><span class="send-user">${fromMessages}&nbsp;</span>reservadamente para&nbsp;<span class="receive-user">${toMessages}</span><p>:&nbsp;</p>${textMessages}
                    </p>
                </div>
                `)
            }else if(statusMessages === 'message'){                
                array.push(`
                <div class="message data-identifier="message"">
                    <p>
                    <span class="time">(${timeMessages})</span>&nbsp;<span class="send-user">${fromMessages}&nbsp;</span>para&nbsp;<span class="receive-user">Todos</span>:&nbsp;${textMessages}
                    </p>
                </div>
                `)
            }
        }
        
        for (let i =0; i< array.length;i++){
            messagesHTML.innerHTML += array[i]
        }
        messagesHTML.children[99].scrollIntoView();
    }
}

let sendMessage = () =>{
    const text = document.querySelector('.footer input')
    let message = {
        from: userName.name,
        to: "Todos",
        text: text.value,
        type: "message"
    }
    text.value = ''
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

let promiseGetParticipants = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
promiseGetParticipants.then(GetParticipants)
function GetParticipants(answer) {
    let participants = answer.data
    console.log(participants);
}

// EnterRoom();
keepConection(userName);







