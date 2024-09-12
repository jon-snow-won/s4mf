# ПОДКЛЮЧЕНИЕ ЧЕРЕЗ SockJS для файла websocket-test.html

Для подключения через SockJS необходимо в файле websocket-test.html заменить код начинающийся с комментария `ПОДКЛЮЧЕНИЕ ЧЕРЕЗ stompJS, минуя SockJS`, на следующий:

```html
<!--
    ПОДКЛЮЧЕНИЕ ЧЕРЕЗ SockJS
    В браузере будет ошибка CORS Policy.
    CORS Policy можно легко отключить.
    На маке делается так:
    1. Закрыть Chrome
    2. В терминале (путь до директории не важен):
    open -a "Google Chrome" --args --disable-web-security --user-data-dir="~/any-folder-name"
  -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.4.0/sockjs.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
    <script type="text/javascript">
      const socket = new SockJS("http://192.168.100.72:8880/ws");
      const client = Stomp.over(socket);
      client.connect({}, onConnected, onError);

      function onConnected() {
        console.log("connected");
        const realm = 'federal-app';
        const login = 'dictionary-admin';
        const source = 'dictionaryservice,testservice'; // все модули - пустая строка
        client.subscribe('/notifications/' + realm + '/' + login + '/' + source + '/unread-count', onMessageReceived);
      }

      function onMessageReceived(response) {
        console.log(response);
      }

      function onError(error) {
        console.error('Error with websocket', error);
      }
    </script>
```