const addBoardButton = document.querySelector('.addBtn');
const boardsRoute = '/get-boards';
const statusesRoute = '/get-statuses';
const cardsRoute = '/get-cards';
const newBoardRoute = '/new-board';
const newCardRoute = '/new-card';
const deleteCardUrl = '/delete-card';
const updateCardUrl = '/update-card-name';
const updateBoardNameRoute = '/update-board-name'
const updateStatusCard = '/update-status'
const inputNewBoard = document.getElementById('input-board');
const saveButton = document.querySelector('.saveBtn');
const modal = document.querySelector('.modal');
const container = document.querySelector('#board-container');



addBoardButton.addEventListener('click', ()=>{
    modal.classList.toggle('visible')
})

saveButton.addEventListener('click', ()=>{
    submit_entry(inputNewBoard.value, newBoardRoute)
    modal.classList.toggle('visible')
    main()
})



//GET
async function apiGet(boardsEndpoint) {
    let data = await fetch(`${boardsEndpoint}`)
    let jsonData = await data.json()
    return jsonData
}

//POST
async function submit_entry(elementName, url) {
    let submitData = {
        'name': `${elementName}`
    };
    let response = await fetch(`${url}/${elementName}`, {
        method: "POST",
        mode: "cors",
        cache: "default",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        redirect: "follow",
        body: JSON.stringify(submitData)
    })
    let result = await response.json()
    main()
    console.log(result)
}


//POST
async function update_entry(elementName, url) {
    let submitData = {
        'name': elementName
    };
    let response = await fetch(`${url}`, {
        method: "POST",
        mode: "cors",
        cache: "default",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        redirect: "follow",
        body: JSON.stringify(submitData)
    })
    let result = await response.json()
    console.log(result)
}


async function getBoards(callback) {
        let jsonData = await apiGet(boardsRoute)
        callback(jsonData)
}


function showBoards(boards) {
    for (let board of boards) {
        let section = document.createElement('section')
            section.classList.add('board', 'accordion')
            section.setAttribute('id', `board${board.id}`)
            section.setAttribute('data-id',`${board.id}`)
            section.setAttribute('board', `${board.id}`)
            section.classList.add('card-header')
        let boardHeader = document.createElement('div')
            boardHeader.classList.add('board-header')
            boardHeader.setAttribute(`id`, `header${board.id}`)
        let title = document.createElement('span')
            title.classList.add('board-title')
            title.innerHTML = `${board.title}`
            title.contentEditable = true;
            title.addEventListener('keydown',event => {
                let oldTitle = title.innerText
                if (event.key === 'Escape') {
                    title.innerHTML = oldTitle
                }
                if (event.key === 'Enter') {
                    event.preventDefault()
                    let object = {'name': title.textContent, 'id': board.id}
                    update_entry(object,updateBoardNameRoute)
                    title.style.caretColor = "red"
            }})
            let addButton = document.createElement('button')
            addButton.classList.add('board-add', 'btn', 'btn-outline-secondary')
            addButton.setAttribute("board-id", `${board.id}`)
            addButton.addEventListener('click', () => {
                let btnBoardAtt = addButton.getAttribute("board-id")
                submit_entry(`${btnBoardAtt}`, newCardRoute)
            })
            addButton.innerHTML = `Add Card`
        let dropDwnButton = document.createElement('button')
            dropDwnButton.classList.add('board-toggle', "btn", 'btn-link')
            dropDwnButton.setAttribute("data-toggle", 'collapse')
            dropDwnButton.setAttribute("data-target", `#collapse${board.id}`)
            dropDwnButton.setAttribute('aria-expanded',"true")
            dropDwnButton.setAttribute('type',"button")
            dropDwnButton.setAttribute( 'aria-controls',`collapse${board.id}`)
            dropDwnButton.innerHTML = '<i class="fas fa-chevron-down"></i>'
        boardHeader.appendChild(title)
        boardHeader.appendChild(addButton)
        boardHeader.appendChild(dropDwnButton)
        section.appendChild(boardHeader)
        container.appendChild(section)
        }
    }


async function getStatuses(callback) {
        let jsonData = await apiGet(statusesRoute)
        callback(jsonData)
}


function showStatuses(statuses) {
    // shows boards appending them to #boards div
    // it adds necessary event listeners also
    let sections = document.querySelectorAll('.board')
    for (let section of sections) {
        let boardColumnHolder = document.createElement('div')
        boardColumnHolder.classList.add("board-columns", 'collapse', 'show')
        let boardId = section.getAttribute('data-id')
        boardColumnHolder.setAttribute('id', `collapse${boardId}`)
        boardColumnHolder.setAttribute('aria-labelledby',`header${boardId}`)
        boardColumnHolder.setAttribute('data-parent', `#board${boardId}`)
        for (let status of statuses) {
            let boardColumn = document.createElement('div')
                boardColumn.classList.add('board-column')
            let boardColTitle = document.createElement('div')
                boardColTitle.classList.add("board-column-title")
                boardColTitle.innerHTML = `${status.title}`
            let boardColContent = document.createElement('div')
                boardColContent.classList.add("board-column-content")
                boardColContent.setAttribute('status-id', `${status.id}`)
                boardColContent.setAttribute('id', `board${boardId}`)
                boardColContent.setAttribute('board-id', `${boardId}`)
                boardColContent.setAttribute('aria-labelledby',`${boardId}`)
                boardColContent.setAttribute('data-parent', `#board${boardId}`)
                boardColContent.classList.add('dropzone')
                boardColContent.addEventListener('dragover',dragOver)
            boardColumn.appendChild(boardColTitle)
            boardColumn.appendChild(boardColContent)
            boardColumnHolder.appendChild(boardColumn)
        }
        section.appendChild(boardColumnHolder)
    }
}


async function getCards(callback) {
        let jsonData = await apiGet(cardsRoute)
        callback(jsonData)
}



function showCards(cards) {
    let boardColContents = document.querySelectorAll('.board-column-content')
    for (let boardColContent of boardColContents) {
        let boardId = boardColContent.getAttribute('board-id')
        let statusId = boardColContent.getAttribute('status-id')
        for (let card of cards) {
            if (card.boards_id == +boardId && card.statuses_id == +statusId) {
                let task = document.createElement('div')
                task.classList.add("card", 'dropzone')
                task.setAttribute('id', `${card.id}`)
                task.setAttribute('status-id', `${statusId}`)
                task.setAttribute('board-id', `${boardId}`)
                task.setAttribute('card-order', `${card.ordered}`)
                task.setAttribute('draggable',"true")
                task.addEventListener('dragstart', dragStart)
                task.addEventListener('dragend', dragEnd)
                let buttonRemove = document.createElement('div')
                buttonRemove.setAttribute('status-id', `${statusId}`)
                buttonRemove.setAttribute('board-id', `${boardId}`)
                buttonRemove.setAttribute('card-order', `${card.ordered}`)
                buttonRemove.classList.add('card-remove')
                buttonRemove.addEventListener('click', () => {
                    let statusId = buttonRemove.getAttribute('status-id')
                    let boardId = buttonRemove.getAttribute('board-id')
                    let cardOrder = buttonRemove.getAttribute('card-order')
                    let object = `{${boardId},${statusId},${cardOrder}}`
                    submit_entry(object,deleteCardUrl)
                })
                buttonRemove.innerHTML = '<i class="fas fa-trash-alt"></i>'
                let cardTitle = document.createElement('div')
                cardTitle.classList.add('card-title')
                cardTitle.innerHTML = `${card.title}`
                cardTitle.contentEditable = true;
                cardTitle.addEventListener('keydown',event => {
                if (event.key === 'Enter') {
                    event.preventDefault()
                    let object = {'cardName': cardTitle.textContent,'boardId': boardId, 'statusId': statusId, 'cardOrdered': card.ordered}
                    update_entry(object,updateCardUrl)
                    cardTitle.style.caretColor = "transparent"
            }})
                task.appendChild(cardTitle)
                task.appendChild(buttonRemove)
                boardColContent.appendChild(task)
            }
        }
    }
}


////Drag & Drop

let elementOnTheMove = null
let targetElement = null


function dragStart(e) {
    if (e.target.classList.contains('card')) {
    elementOnTheMove = e.target
}}


function dragOver(e) {
    if (e.target.classList.contains('card') || e.target.classList.contains('dropzone')){
         targetElement = e.target
    }
        e.preventDefault();
    }


function dragEnd(e) {
    console.log('dragend')
    if (elementOnTheMove == null || targetElement == null){
        console.log('la null'); return;}
    elementOnTheMove.parentNode.removeChild(elementOnTheMove)
    if (targetElement.classList.contains('dropzone')) {
        // if () daca fac drop pe card atunci aloci cardul pe parent!!!
        console.log('dropzone')
        targetElement.prepend(elementOnTheMove)
        let boardId = targetElement.getAttribute('board-id')
        let statusId = targetElement.getAttribute('status-id')
        let cardOrder = targetElement.getAttribute('order-id')
        let boardIdOld = elementOnTheMove.getAttribute('board-id')
        let statusIdOld = elementOnTheMove.getAttribute('status-id')
        let cardOrderOld = elementOnTheMove.getAttribute('order-id')
        let cardId = elementOnTheMove.getAttribute('id')
        if (cardOrder === null) {cardOrder = '0' }
        if (cardOrderOld === null) {cardOrderOld = '0'}
        let object = {
            'board_id': boardId,
            'status_id': statusId,
            'card_order': cardOrder,
            'boardIdOld': boardIdOld,
            'statusIdOld': statusIdOld,
            'cardOrderOld': cardOrderOld,
            'cardId': cardId}
        console.log(object)
        if (boardId === boardIdOld) {update_entry(object, updateStatusCard)}
    } else {targetElement.parentNode.appendChild(elementOnTheMove)}

    elementOnTheMove = null
    targetElement = null
}

// boards, statuses and cards initialisation//

async function init() {
    await getBoards(showBoards)
    await getStatuses(showStatuses)
    await getCards(showCards)
}




function main(){
    container.innerHTML = ''
    init()
};

main()


