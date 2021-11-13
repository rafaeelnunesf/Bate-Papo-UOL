
let userName

// Essa função entra na sala
let EnterRoom = () => {
    userName = prompt('qual é o seu lindo nome?')
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
    setTimeout(GetMessages,3000)
    // setInterval(GetMessages,3000)
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
                <div class="status msg${i}">
                    <p>
                        <span class="time">(${timeMessages})&nbsp;</span><span class="send-user">${fromMessages}&nbsp;</span>${textMessages}
                    </p>
                </div>
                `)
            }else if (statusMessages === 'private_message'){
                array.push(`
                <div class="private-message msg${i}">
                    <p>
                        <span class="time">(${timeMessages})&nbsp;</span><span class="send-user">${fromMessages}&nbsp;</span>reservadamente para&nbsp;<span class="receive-user">${toMessages}</span><p>:&nbsp;</p>${textMessages}
                    </p>
                </div>
                `)
            }else if(statusMessages === 'message'){                
                array.push(`
                <div class="message msg${i}">
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
    const text = document.querySelector('input')
    let message = {
        from: userName.name,
        to: "Todos",
        text: text.value,
        type: "message"
    }
    text.value = ''
    let requisicao = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',message)

    requisicao.then(ok)
    requisicao.catch(deuruim)

    function ok (answer){
        GetMessages() 
    }
    function deuruim(answer) {
        alert('usuário saiu da sala')
        window.location.reload()  
    }

}


EnterRoom();
keepConection(userName);







