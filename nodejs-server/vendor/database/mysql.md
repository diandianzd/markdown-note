### 安装依赖
```
npm install mysql --save

```


### sql 绑定
```javascript
async function x() {
    try {
       let values = await new DB().command('select * from table where id =?', ['id']).one()
       console.log(values)
    }catch (e) {
       console.log("query error")
    }
}


```

### 查询集合
```javascript
async function x() {
    try {
       let values = await new DB().table('table').select(['name']).where({key: 'value'}).query()
       console.log(values)
    }catch (e) {
       console.log("query error")
    }
}


```

### 添加数据
```javascript
async function x() {
  try {
      let values = await new DB().table('table').insert({key: 'value'})
      console.log(values)
  } catch (e) {
      console.log("insert error")
  }
}
```

### 更新数据
```javascript
async function x() {
  try {
      let values = await new DB().table('table').where({id: 107}).update({name: 'name'})
      console.log(values)
  } catch (e) {
      console.log("update error")
  }
}
```
