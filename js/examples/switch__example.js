const switchExample = (selectedExample) => {

  console.log('switchExample', selectedExample)

  const tmp = selectedExample.split('#')
  let numFaces = ''

  if(tmp.length > 1) {

    selectedExample = tmp[0]
    numFaces = tmp[1]
  }

  const scriptSwitch = document.getElementById('scriptSwitch')
  scriptSwitch.parentNode.removeChild(scriptSwitch)

  const path = './js/examples/' + selectedExample + '.js'

  const script = document.createElement('script')
  script.id = 'scriptSwitch'
  script.type = 'module'
  script.async = true
  script.innerHTML = 'import { run } from "' + path + '"; run('+numFaces+')'

  document.body.append(script)

  const codeNode = document.getElementById('__brfv5_code')

  if(codeNode) {

    const txtRequest = new XMLHttpRequest()
    txtRequest.open('GET', path)
    txtRequest.onload = function(e) {

      codeNode.innerHTML = txtRequest.responseText

      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    }

    txtRequest.send();
  }
}

const onChangeExample = () => {

  switchExample(document.getElementById('__brfv5_select').value)
}

onChangeExample()

const setupSelect = () => {

  const selectContainers = document.getElementsByClassName('__brfv5_select_container');

  for(let i = 0; i < selectContainers.length; i++) {

    const selectContainer = selectContainers[i]
    const select = selectContainer.getElementsByTagName('select')[0];

    /* For each element, create a new DIV that will act as the selected item: */

    const selectedItem = document.createElement('div')
    selectedItem.innerHTML = select.options[select.selectedIndex].innerHTML
    selectedItem.className = 'select-selected'
    selectContainer.appendChild(selectedItem)

    /* For each element, create a new DIV that will contain the option list: */

    const optionsContainer = document.createElement('div')
    optionsContainer.className = 'select-items select-hide'

    const optionMap = {}

    for(let j = 0; j < select.options.length; j++) {

      /* For each option in the original select element, create a new DIV that will act as an option item: */

      const option = document.createElement('div')
      option.innerHTML = select.options[j].innerHTML

      if(option.innerHTML === selectedItem.innerHTML) { option.classList.add('same-as-selected') }

      option.addEventListener('click', function(event) {

        /* When an item is clicked, update the original select box, and the selected item: */

        selectedItem.innerHTML = this.innerHTML;
        select.selectedIndex = optionMap[this.innerHTML]

        switchExample(select.value)

        const oldOption = selectContainer.getElementsByClassName('same-as-selected')
        if(oldOption && oldOption[0]) oldOption[0].classList.remove('same-as-selected')

        this.classList.add('same-as-selected')
        selectedItem.click();
      })
      optionMap[option.innerHTML] = j
      optionsContainer.appendChild(option)
    }

    selectContainer.appendChild(optionsContainer)

    selectedItem.onclick = function(event) {

      /* When the select box is clicked, close any other select boxes, and open/close the current select box: */

      event.stopPropagation()

      closeAllSelect(this)

      optionsContainer.classList.toggle("select-hide")
      selectedItem.classList.toggle("select-arrow-active")
    }
  }

  const closeAllSelect = (selectedItem) => {

    /* A function that will close all select boxes in the document, except the current select box: */

    const allOptionsContainers = document.getElementsByClassName("select-items")
    const allSelectedItems     = document.getElementsByClassName("select-selected")
    const tmp = []


    for(let i = 0; i < allSelectedItems.length; i++) {

      if(selectedItem === allSelectedItems[i]) {

        tmp.push(i)

      } else {

        allSelectedItems[i].classList.remove("select-arrow-active")
      }
    }

    for(let i = 0; i < allOptionsContainers.length; i++) {

      if(tmp.indexOf(i)) {

        allOptionsContainers[i].classList.add("select-hide")
      }
    }
  }

  /* If the user clicks anywhere outside the select box, then close all select boxes: */

  document.addEventListener("click", closeAllSelect)
}

setupSelect()
