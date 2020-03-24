import Vue from 'vue'

/**
 * copy to clipboard
 * @param text
 */

function copyTextToClipboard(text) {
  var textArea = document.createElement('textarea')

  textArea.style.position = 'fixed'
  textArea.style.top = 0
  textArea.style.left = 0
  textArea.style.width = '2em'
  textArea.style.height = '2em'
  textArea.style.padding = 0
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.background = 'transparent'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    // console.log('Copying text command was ' + msg);
  } catch (err) {
    // console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea)
}

Vue.directive('copy-code', {
  componentUpdated: function(el, binding) {
    setTimeout(() => {
      // 格式化代码
      const blocks = el.querySelectorAll('tbody td,pre')
      // 复制到剪切板
      blocks.forEach((block) => {
        block.ondblclick = function() {
          console.log('copied')
          copyTextToClipboard(block.innerText.replace(/^\s+|\s+$/g, ''))
        }
      })
    }, 1)
  }
})
