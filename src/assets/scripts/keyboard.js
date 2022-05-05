import KEYS from './keys.js';

export default class Keyboard {
  constructor(keyboardElem, textareaElem) {
    this.keyboardElem = keyboardElem;
    this.textareaElem = textareaElem;
    this.isCaps = false;
    this.isDown = false;
    this.layout = localStorage.getItem('language') === 'ru' ? 'ru' : 'en';
    this.keys = [];
  }

  keyboardGen() {
    this.keyboardElem.classList.add('keyboard');
    KEYS.forEach((key) => {
      const keyButton = document.createElement('button');
      keyButton.setAttribute('id', key.code);
      keyButton.setAttribute('type', 'button');

      keyButton.setAttribute('character-en', key.character.en);
      keyButton.setAttribute('character-ru', key.character.ru);
      keyButton.setAttribute('contents-en', key.contents.en);
      keyButton.setAttribute('contents-ru', key.contents.ru);
      keyButton.setAttribute('shift-en', key.shift.en);
      keyButton.setAttribute('shift-ru', key.shift.ru);

      keyButton.classList.add('key', key.code);
      keyButton.textContent = this.layout === 'en' ? key.contents.en : key.contents.ru;
      this.keyboardElem.appendChild(keyButton);
      this.keys.push(keyButton);
    });
  }

  insertText(text, param) {
    let cursorStart = this.textareaElem.selectionStart;
    let cursorEnd = this.textareaElem.selectionEnd;
    if (this.textareaElem.selectionStart === this.textareaElem.selectionEnd) {
      if (param === 'Delete') cursorEnd += 1;
      else if (param === 'Backspace') cursorStart = Math.max(0, cursorStart - 1);
    }

    if (param === 'Delete' || param === 'Backspace') {
      this.textareaElem.setRangeText('', cursorStart, cursorEnd);
    } else this.textareaElem.setRangeText(text);

    this.textareaElem.selectionStart = cursorStart + text.length;
    this.textareaElem.selectionEnd = this.textareaElem.selectionStart;
  }

  shiftText(noCapsKey) {
    this.keys.forEach((forKey) => {
      const key = forKey;
      if (noCapsKey || key.getAttribute('character-en') === 'letter') {
        const temp = key.getAttribute('contents-en');
        key.setAttribute('contents-en', key.getAttribute('shift-en'));
        key.setAttribute('shift-en', temp);
      }
      if (noCapsKey || key.getAttribute('character-ru') === 'letter') {
        const temp = key.getAttribute('contents-ru');
        key.setAttribute('contents-ru', key.getAttribute('shift-ru'));
        key.setAttribute('shift-ru', temp);
      }
      key.innerText = this.layout === 'en'
        ? key.getAttribute('contents-en')
        : key.getAttribute('contents-ru');
    });
  }

  addListeners() {
    document.addEventListener('keydown', (keyEvent) => {
      const key = document.getElementById(keyEvent.code);
      if (key) {
        key.classList.add('pressed');
        keyEvent.preventDefault();
        const characterEn = key.getAttribute('character-en');
        if (
          (keyEvent.code === 'ShiftLeft' || keyEvent.code === 'ShiftRight')
          && !keyEvent.repeat
        ) this.shiftText(true);
        else if (keyEvent.code === 'CapsLock' && !keyEvent.repeat) {
          this.shiftText(false);
          if (this.isCaps) key.classList.remove('pressed');
          this.isCaps = !this.isCaps;
        } else if (keyEvent.ctrlKey && keyEvent.altKey) {
          this.layout = this.layout === 'ru' ? 'en' : 'ru';
          localStorage.setItem('language', this.layout);
          this.keys.forEach((forKey) => {
            if (this.layout === 'en') {
              const keyFromKeys = forKey;
              keyFromKeys.innerText = forKey.getAttribute('contents-en');
            } else if (this.layout === 'ru') {
              const keyFromKeys = forKey;
              keyFromKeys.innerText = forKey.getAttribute('contents-ru');
            }
          });
        } else if (keyEvent.code === 'Backspace') this.insertText('', 'Backspace');
        else if (keyEvent.code === 'Delete') this.insertText('', 'Delete');
        else if (keyEvent.code === 'Enter') this.insertText('\n');
        else if (keyEvent.code === 'Tab') this.insertText('    ');
        else if (characterEn !== 'func') this.insertText(key.textContent);
      }
    });

    document.addEventListener('keyup', (keyEvent) => {
      const key = document.getElementById(keyEvent.code);
      if (key) {
        if (keyEvent.code !== 'CapsLock') key.classList.remove('pressed');
        if (keyEvent.code === 'ShiftLeft' || keyEvent.code === 'ShiftRight') this.shiftText(true);
      }
    });

    this.keyboardElem.addEventListener('mousedown', (event) => {
      const eventKeyDown = new KeyboardEvent('keydown', {
        code: event.target.id,
      });
      document.dispatchEvent(eventKeyDown);
      this.isDown = true;
    });

    this.keyboardElem.addEventListener('mouseup', (event) => {
      const eventKeyUp = new KeyboardEvent('keyup', { code: event.target.id });
      document.dispatchEvent(eventKeyUp);
      this.isDown = false;
    });

    this.keyboardElem.addEventListener('mouseout', (event) => {
      if (this.isDown) {
        const eventKeyUp = new KeyboardEvent('keyup', {
          code: event.target.id,
        });
        document.dispatchEvent(eventKeyUp);
      }
    });
  }
}
