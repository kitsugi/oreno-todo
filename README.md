Todo Sample App
===============
**Version:** 1.0.0

## アプリケーション構成

```
├── api
│   ├── controllers
│   │   └── todos.js
│   ├── daos
│   │   ├── index.js
│   │   └── todos-nedb-dao.js
│   ├── models
│   │   ├── error.js
│   │   └── todo.js
│   └── swagger
│       └── swagger.yaml
├── app.js
├── config
│   └── default.yaml
├── docs
│   ├── api-doc.html
│   └── api-doc.md
├── node_modules
│       略
├── package-lock.json
├── package.json
└── test
     └── api
         └── client
             ├── todos-test.js
             └── todos-{id}-test.js
```

## モジュール構成

### アプリケーション

| モジュール名 | バージョン | 補足 |
|----|---:|----|
| [express](https://expressjs.com) | 4.16.3 | Webアプリケーションフレームワーク |
| [swagger-express-mw](https://github.com/apigee-127/swagger-express) | 0.1.0 | SwaggerとExpress連携 |
| [morgan](https://github.com/expressjs/morgan) | 1.9.1 | ロギング |
| [morgan-body](https://github.com/sirrodgepodge/morgan-body) | 2.4.5 | リクエストとレスポンスのBodyログ出力(morgan拡張) |
| [body-parser](https://github.com/expressjs/body-parser) | 1.18.3 | リクエストとレスポンスのBody解析 |
| [fs-extra](https://github.com/jprichardson/node-fs-extra) | 7.0.0 | ファイル操作 |
| [config](https://github.com/lorenwest/node-config) | 2.0.1 | 設定ファイル読み込み |
| [nedb](https://github.com/louischatriot/nedb) | 1.8.0 | NoSQLデータベース |

### テスト

| モジュール名 | バージョン | 補足 |
|----|---:|----|
| [mocha](https://github.com/mochajs/mocha) | 2.5.3 | テストフレームワーク |
| [chai](https://github.com/chaijs/chai) | 3.5.0 | テストアサーション |
| [z-schema](https://github.com/zaggino/z-schema) | 3.23.0 | スキーマ検証 |
| [supertest](https://github.com/visionmedia/supertest) | 1.2.0 | HTTPリクエスト |


## 操作
### Swagger Editor起動
```sh
$ swagger project edit
```

### テスト実行
```sh
$ swagger project test
```

### ドキュメント表示
> http://localhost:8080/docs


## /todos

### ***GET***
**Summary:** todo情報検索

**Description:** クエリに一致するtodo情報を一覧取得します。(更新日時の降順)

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| q | query | 検索キーワード | No | string |
| status | query | ステータス | No | string |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ [TodoModel](#todomodel) ] |

### ***POST***
**Summary:** todo情報登録

**Description:** 新しいtodo情報を登録します。

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| entry | body | 入力パラメータ | No | [TodoEntry](#todoentry) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | CREATED | [TodoModel](#todomodel) |
| 400 | BAD REQUEST | [Error](#error) |

## /todos/{id}

### ***GET***
**Summary:** todo情報取得

**Description:** 指定したidに一致するtodo情報を取得します。

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | todo id | Yes | string |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [TodoModel](#todomodel) |
| 404 | NOT FOUND | [Error](#error) |

### ***PUT***
**Summary:** todo情報更新

**Description:** 指定したidに一致するtodo情報を更新します。

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | todo id | Yes | string |
| entry | body | todo entry parameter | Yes | [TodoEntry](#todoentry) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [TodoModel](#todomodel) |
| 404 | NOT FOUND | [Error](#error) |

### ***DELETE***
**Summary:** todo情報削除

**Description:** 指定したidに一致するtodo情報を削除します。

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | todo id | Yes | string |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 204 | NO CONTENT |  |
| 404 | NOT FOUND | [Error](#error) |

## モデル

### TodoEntry  

| 項目名 | 型 | 説明 | 必須 |
| ---- | ---- | ----------- | -------- |
| title | string | タイトル | No |
| content | string | 内容 | No |
| done | boolean | 完了フラグ | No |

### TodoModel  

| 項目名 | 型 | 説明 | 必須 |
| ---- | ---- | ----------- | -------- |
| _id | string | todo id | Yes |
| title | string | タイトル | Yes |
| content | string | 内容 | No |
| done | boolean | 完了フラグ | Yes |
| createdAt | dateTime | 作成日時 | Yes |
| updatedAt | dateTime | 更新日時 | Yes |

### Error  

| 項目名 | 型 | 説明 | 必須 |
| ---- | ---- | ----------- | -------- |
| code | string | コード | Yes |
| message | string | メッセージ | Yes |