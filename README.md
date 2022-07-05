# Discord JS ürün satış botu

## Kullanmadan önce

### `config.json` dosyasındaki değişkenler

- `token` botunuzun token'ını,
- `owners` üst düzey yetkili kullanıcıların id'leri,
- `guild` sunucunuzun id'si,
- `channel` sipariş onayı mesajının atılacağı kanalın id'si
- `category` sipariş kanallarının bulunduğu kategorinin id'si
- `customerService` müşteri hizmetleri rolünün id'si
- `firebase` [Firebase Console](console.firebase.com)'dan alınan config

```json
{
  "firebase": {
    "apiKey": "",
    "authDomain": "",
    "databaseURL": "",
    "projectId": "",
    "storageBucket": "",
    "messagingSenderId": "",
    "appId": "",
    "measurementId": ""
  },
  "token": "",
  "owners": ["", ""],
  "guild": "",
  "channel": "",
  "category": "",
  "customerService": ""
}
```

Sonrasında ise terminalinize şunları yazın:

```cmd
npm install
npm start
```

#

### İletişim

- [The xgârd!](https://discord.com/users/789173991171817524)
- [Toânky](https://discord.com/users/464429065340977152)
