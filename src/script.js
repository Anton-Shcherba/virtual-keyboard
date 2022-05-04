const wrapper = document.createElement('div');
const title = document.createElement('h1');
const textarea = document.createElement('textarea');
const keyboardElem = document.createElement('div');
const info = document.createElement('p');

wrapper.classList.add('wrapper');
title.textContent = 'RSS Виртуальная клавиатура';
info.innerText = 'Клавиатура создана в операционной системе Windows\nДля переключения языка комбинация: Ctrl + Alt';

wrapper.appendChild(title);
wrapper.appendChild(textarea);
wrapper.appendChild(keyboardElem);
wrapper.appendChild(info);
document.body.appendChild(wrapper);

textarea.onblur = () => textarea.focus();
textarea.focus();
