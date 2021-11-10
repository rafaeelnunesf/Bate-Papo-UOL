let getPromiseMessages = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');



getPromiseMessages.then(searchMessages);




function searchMessages(answer) {
    
    let messages = answer.data


    console.log(messages);
}