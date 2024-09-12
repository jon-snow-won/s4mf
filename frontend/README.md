# Федеративное приложение для ЦМП, ЦДП

### Installation

```bash
npm install

cp .env-dmp.sample .env-dmp
cp .env-dtp.sample .env-dtp

cp .npmrc.sample .npmrc
```

Далее, необходимо корректно заполнить файлы .env и .npmrc.
Как заполнить .env файл – можно узнать у вашего тимлида.
Как заполнить .npmrc файл – можно узнать по этой [ссылке](https://wiki.element-lab.ru/pages/viewpage.action?pageId=55776802).

### Run: Development

ЦМП:
```bash
npm run start:dmp
```

ЦДП:
```bash
npm run start:dtp
```

### Run: Production

```bash
npm run build
```
### Deploy

/deploy/*.values.yaml

- manifest.json
- env.js
- nginx.conf
- runtime env

### Open
```bash
http://localhost:3009
```
