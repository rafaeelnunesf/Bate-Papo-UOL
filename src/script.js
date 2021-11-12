let getPromiseMessages = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
getPromiseMessages.then(loadMessages);


function loadMessages(answer){
    const messagesHTML = document.querySelector(".messages")
    messagesHTML.scrollIntoView();
    let messages = answer.data;

    console.log(messages)

    let statusMessages
    let fromMessages
    let textMessages
    let toMessages
    let timeMessages

    for (let i = 0; i < messages.length; i++) {
        statusMessages = messages[i].type
        fromMessages = messages[i].from
        textMessages = messages[i].text
        toMessages = messages[i].to
        timeMessages = messages[i].time

        if(statusMessages === 'status'){
            messagesHTML.innerHTML += `
            <div class="status">
                <p class="time">(${timeMessages})&nbsp;</p>
                <p class="send-user">${fromMessages}&nbsp;</p>${textMessages}
            </div>
            `
            window.scrollTo(0,1000)
        }else if (statusMessages === 'private_message'){
            messagesHTML.innerHTML += `
            <div class="private-message">
                <p class="time">(${timeMessages})&nbsp;</p>
                <p class="send-user">${fromMessages}&nbsp;</p>reservadamente para&nbsp;
                <p class="receive-user">${toMessages}</p><p>:&nbsp;</p>${textMessages}
            </div>
            `
            window.scrollTo(0,1000)
        }else if(statusMessages === 'message'){
            messagesHTML.innerHTML += `
            <div class="status">
                <p class="time">(${timeMessages})&nbsp;</p>
                <p class="send-user">${fromMessages}&nbsp;</p>${textMessages}
            </div>
            `
            window.scrollTo(0,1000)
        }
        
    }
}

/* function searchMessages(answer) {
    let messages = answer.data
    console.log(messages.length);
} */









let x = setInterval(loadMessages,3000)