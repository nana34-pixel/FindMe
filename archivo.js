// Mostrar contraseña

const togglePassword = document.querySelector('.toggle-password');

if(togglePassword){

  togglePassword.addEventListener('click',()=>{

    const password = document.getElementById('password');

    if(password.type === 'password'){

      password.type = 'text';

    }else{

      password.type = 'password';

    }

  });

}

// Favoritos

document.querySelectorAll('.favorite-btn').forEach(btn=>{

  btn.addEventListener('click',()=>{

    btn.classList.toggle('active-favorite');

  });

});

// Chat dinámico

const chatInput = document.querySelector('.chat-input input');

const sendButton = document.querySelector('.chat-input button');

if(sendButton){

  sendButton.addEventListener('click',()=>{

    if(chatInput.value.trim() !== ''){

      const message = document.createElement('div');

      message.classList.add('message','sent');

      message.innerText = chatInput.value;

      document.querySelector('.messages').appendChild(message);

      chatInput.value='';

    }

  });

}
