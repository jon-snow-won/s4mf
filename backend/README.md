## Description

## Технологический стек
- [NestJS](https://docs.nestjs.com/)
- [JavaScript](https://developer.mozilla.org/ru/docs/Web/JavaScript)
- [TypeScript](https://www.typescriptlang.org/)
- [MikroORM](https://mikro-orm.io/)

## Install
`npm`:
```bash
$ npm install
```

## Run

```bash
# local
$ npm run start

# local dev
$ npm run start:dev

# режим прода
$ npm run start:prod
```

Для запуска микросервисе в k8s используется unified pipeline(upl), описанный в [.gitlab-ci.yml](.gitlab-ci.yml). Upl выполняет сборку по инструкции [Dockerfile](Dockerfile).

Микросервис поддерживает настройку через переменные окружения:
| Название переменной | Описание | Пример заполнения |
|-|-|-|
| APP_PORT | Порт запуска | 8888 |
| APP_GLOBAL_PREFIX | Глобальный префикс для приложения | / |
| APP_LOG_LEVEL | Уровень логирования | debug |
| NODE_ENV | Режим работы приложения | development |
| KUBE_CONFIG_BASE64 | Base64 строка с конфигурацией для работы с k8s | <Base64 строка> |
| SUPERUSER_LIST | Список суперюзеров приложения, через запятую | test@example.ru,test2@example.com |
| USER_DATA_LIFESPAN_IN_SECONDS | Время жизни данных пользователя между обновлениями. В секундах, по умолчанию - 5 минут | 300 |
|-|-|-|
| DB_HOST | Хост БД | localhost |
| DB_PORT | Порт БД | 5432 |
| DB_NAME | Имя БД | el-aggregate-bff |
| DB_USER | Пользователь БД | postgres |
| DB_PASS | Пароль пользователя БД | password |
|-|-|-|
| S3_HOST | Хост S3 | localhost |
| S3_PORT | Порт S3 | 9000 |
| S3_HEALTH_PATH | Путь для health-check'а S3 | /minio/health/live |
| S3_ACCESS_KEY_ID | Идентификатор ключа доступа к S3 | key |
| S3_SECRET_ACCESS_KEY | Ключ доступа к S3 | access-key |
| S3_BUCKET_NAME | Имя баккета | bucket-name |
| S3_BUCKET_NAME_CLIENT | Имя клиента | bucket-client |


## Тесты

```bash
# Юнит тесты
$ npm run test

# e2e тесты
$ npm run test:e2e

# Тесты с покрытием
$ npm run test:cov
```
