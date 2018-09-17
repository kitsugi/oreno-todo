Todo Sample App
===============
**Version:** 0.2.0

### /todos
---
##### ***GET***
**Summary:** todoリスト取得

**Description:** クエリに一致するtodo情報を更新日時の降順で一覧取得します。

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| q | query | 検索キーワード | No | string |
| status | query | ステータス | No | string |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | successful operation | [ [TodoModel](#todomodel) ] |

##### ***POST***
**Summary:** todo情報登録

**Description:** 新しいtodo情報を登録します。

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| entry | body | todo entry parameter | No | [TodoEntry](#todoentry) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | successful operation | [TodoModel](#todomodel) |
| 400 | Bad request | [Error](#error) |

### /todos/{id}
---
##### ***GET***
**Summary:** todo情報取得

**Description:** 指定したidに一致するtodo情報を取得します。

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | todo id | Yes | string |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | successful operation | [TodoModel](#todomodel) |
| 404 | A todo with the specified ID was not found. | [Error](#error) |

##### ***PUT***
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
| 200 | successful operation | [TodoModel](#todomodel) |
| 400 | Bad request | [Error](#error) |
| 404 | A todo with the specified ID was not found. | [Error](#error) |

##### ***DELETE***
**Summary:** todo情報削除

**Description:** 指定したidに一致するtodo情報を削除します。

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | todo id | Yes | string |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 204 | successful operation |  |
| 404 | A todo with the specified ID was not found. | [Error](#error) |

### /swagger
---
### Models
---

### TodoEntry  

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| title | string | タイトル | No |
| content | string | 内容 | No |
| done | boolean | 完了フラグ | No |

### TodoModel  

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| _id | string | todo id | Yes |
| title | string | タイトル | Yes |
| content | string | 内容 | No |
| done | boolean | 完了フラグ | Yes |
| createdAt | dateTime | 作成日時 | Yes |
| updatedAt | dateTime | 更新日時 | Yes |

### Error  

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | integer |  | Yes |
| message | string |  | Yes |
