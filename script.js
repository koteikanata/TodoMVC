let ID = 0;
let items = [];

const input = document.querySelector(".input-todo");
const buttonCompleteAll = document.querySelector(".complete-all");
const list = document.querySelector(".list-todos");
const amountItems = document.querySelector(".number");
const footerLine = document.querySelector('.footer-line');
const buttonAll = document.querySelector('.button-all');
const buttonActive = document.querySelector('.button-active');
const buttonCompleted = document.querySelector('.button-completed');

buttonCompleteAll?.addEventListener('click', completeAll);
buttonAll?.addEventListener('click', showAll);
buttonActive?.addEventListener('click', showOnlyActive);
buttonCompleted?.addEventListener('click', showOnlyCompleted);

list?.addEventListener('change', (e) => {
    checkNeededButtonClearAll();
    saveItemsToStorage();
});

input?.addEventListener('keydown', e => {
    appendToDo(e);
});

setItems();

function setItems() {
    if (readItemsInStorage() !== undefined) {
        // @ts-ignore
        items = readItemsInStorage()
        ID = items.length - 1;
        items.forEach(item => renderItem(item));
        checkNeededButtonClearAll();
    }
}

function appendToDo(e) {
    if (!(e.key === "Enter")) {
        return;
    }

    let value = checkInputContent(e.target.value);
    if (!value) {
        return;
    }
    addItem(value);

    e.target.value = "";
    amountItemsUpdate();
}

function addItem(value) {
    let newItem = {};
    newItem.id = ID++;
    newItem.text = value;
    newItem.status = false;
    items.push(newItem);
    renderItem(newItem);
}

function getItemById(id) {
    return items.find(obj => obj.id === id) // возвращает объект по id
}

function checkInputContent(value) {
    if (value.trim() === '') { return false; };
    if (value.trim())
        return value.trim();
}

function renderItem(el) {
    let li = document.createElement('li');
    li.setAttribute("id", el.id.toString());
    li.className = "checkbox";
    list?.appendChild(li);

    li.innerHTML = fillLablel(el);

    createListenerAppendCheckbox(el);
    createListenerRemoveCheckbox(el);
    createListenerToChange(el);
    checkingOnCheckUp(el);
    saveItemsToStorage();
}

function createListenerAppendCheckbox(el) {
    let checkbox = document.getElementById(el.id);
    checkbox?.addEventListener('change', () => {

        appendItem(el)
        amountItemsUpdate();
    });
}

function checkNeededButtonClearAll() {
    let checkComplete = checkCompleted();
    // console.log(checkComplete, b)

    if (checkComplete && document.getElementById('button-clear') === null) {
        console.log('have completed and no button clear')
        appendClearAllButton();
    }
    else if (!checkComplete && !(document.getElementById('button-clear') === null)) {
        removeObjectById("button-clear");
    }
}

function createListenerRemoveCheckbox(el) {
    let removeThis = document.getElementById(el.id)?.querySelector('.remove-todo');

    removeThis?.addEventListener('click', function handleClick() {
        // console.log(el.id, 'remove')
        removeItem(el.id);
        removeObjectById(el.id);
    });
}

function appendItem(el) {
    if (el.status === true) {
        el.status = false;
    }
    else if (el.status === false) {
        el.status = true;
    }
}

function fillLablel(el) {
    return `<input type="checkbox" class="input-checkbox" id="${el.id}-input"/>
    <span class="indicator" id="${el.id}-span"></span>
    <div class="checkbox-text" id="${el.id}-div">${el.text}</div>
    <button class="remove-todo">╳</button>`
}

function createListenerToChange(el) {
    let liBlock = document.getElementById(el.id);

    liBlock?.addEventListener('dblclick', function replaceDivToInput() {
        let div = document.getElementById(el.id + '-div');
        let input = document.createElement('input');
        input.type = 'text';
        // @ts-ignore
        input.value = div?.textContent;

        div?.replaceWith(input);
        input.focus();

        ['blur', 'keydown'].forEach(function (e) {
            input.addEventListener(e, (e) => {

                // @ts-ignore
                console.log(e.key, 'key this')
                // @ts-ignore
                if (!(e.key === "Enter" || e.key === undefined)) { return; }
                let newDiv = document.createElement("div");
                newDiv.classList.add('checkbox-text');
                newDiv.setAttribute('id', el.id + '-div');
                newDiv.innerHTML = input.value;
                setTextItem(el.id, input.value);
                input.replaceWith(newDiv);
            });
        });
    });


}

function setTextItem(id, text) {
    let item = getItemById(id);
    item.text = text;
}

function checkingOnCheckUp(el) {
    let item = document.getElementById(el.id + '-input');
    if (el.status === true) {
        // @ts-ignore
        item.checked = true;
    }
    else if (el.status === false) {
        // @ts-ignore
        item.checked = false;
    }
}

function amountItemsUpdate() {
    let itemsLeft = 0;

    if (amountItems === null) { return; }
    items.forEach(obj => {
        if (obj.status === false) {
            itemsLeft++;
        }
    });
    amountItems.innerHTML = itemsLeft.toString();
}

function removeObjectById(id) {
    let el = document.getElementById(id.toString());

    while (el?.firstChild) {
        // @ts-ignore
        el.removeChild(el?.lastChild);
    }
    el?.remove();
}

function removeItem(id) {
    let obj = getItemById(id);
    // console.log(obj, 'getitembyid')
    if (obj) {
        let index = items.indexOf(obj);
        items.splice(index, 1);
    }
    amountItemsUpdate();
    saveItemsToStorage();
}

function clearAllCompleted() {
    console.log('work clear all')
    let lis = list?.querySelectorAll('li');

    // @ts-ignore
    for (let i = 0; i < lis.length; i++) {
        // @ts-ignore
        let id = parseInt(lis[i].getAttribute('id'), 10);
        let obj = getItemById(id);

        if (obj.status === true) {
            // @ts-ignore
            removeObjectById(id);
            removeItem(id);
        }

    }
    saveItemsToStorage();
    document.querySelector(".button-clear")?.remove();
    console.log(items, 'newitems')
}

function completeAll() {
    console.log('work conplete all')
    let hasUnchecked = false;

    for (let i = 0; i < items.length; i++) {
        let obj = items[i]

        if (obj.status === false) {
            obj.status = true;
            let checkboxInput = document.getElementById(obj.id + '-input');
            // @ts-ignore
            checkboxInput.checked = true;
            hasUnchecked = true;
        }
    }
    if (!hasUnchecked) {
        for (let i = 0; i < items.length; i++) {
            let obj = items[i]
            obj.status = false;
            let checkboxInput = document.getElementById(obj.id + '-input');
            // @ts-ignore
            checkboxInput.checked = false;
        }
    }

    amountItemsUpdate();
    saveItemsToStorage();
    checkNeededButtonClearAll();
}

function checkCompleted() { // возвращает true, если есть чекнутые
    let hasChecked = false;
    items.forEach(obj => {
        if (obj.status === true) {
            hasChecked = true;
        }
    })
    return hasChecked;
}

function appendClearAllButton() {
    let clearButton = document.createElement('button');
    clearButton.className = 'button-clear';
    clearButton.id = 'button-clear';
    clearButton.innerHTML = "clear completed";

    footerLine?.appendChild(clearButton);
    clearButton?.addEventListener('click', clearAllCompleted)
}

function showAll() {
    items.forEach(obj => {
        if (!document.getElementById(obj.id)) {
            renderItem(obj)
        }
    })
}

function showOnlyActive() {
    items.forEach(obj => {
        if (!document.getElementById(obj.id) && obj.status === false) {
            renderItem(obj)
        } else if (obj.status === true) {
            removeObjectById(obj.id)
        }
    })
}

function showOnlyCompleted() {
    items.forEach(obj => {
        if (!document.getElementById(obj.id) && obj.status === true) {
            renderItem(obj)
        } else if (obj.status === false) {
            removeObjectById(obj.id)
        }
    })
}

function saveItemsToStorage() {
    localStorage.setItem('items', JSON.stringify(items));
}

function readItemsInStorage() {
    let itemsJSON = localStorage.getItem('items');
    if (itemsJSON === null) {
        return undefined;
    }
    try {
        return JSON.parse(itemsJSON);
    } catch (e) {
        localStorage.removeItem('items');
        return undefined;
    }
}



