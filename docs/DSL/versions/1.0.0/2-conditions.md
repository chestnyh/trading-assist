# Conditions

List of conditions: 
 - **__eq** - equals. Checks if a value is equal to another value. Takes two parameters: `value` (path to the value to check) and `equalTo` (value to compare against). Returns true if values are strictly equal (===).
 ```json
 { 
   "__eq": { 
      "key": "age",
      "value": 30
   } 
 }
 ```
 - **__neq** - not equal
 ```json
 { 
   "__neq": { 
      "key": "score", 
      "value": 80
   } 
 }
 ```
 - **__gt** - greater than
 ```json
 {
   "__gt": {
      "key": "price",
      "value": 4000
   }
 }
 ```
 - **__gte** - greater than or equal
 ```json
 {
   "__gte": {
      "key": "volume",
      "value": 100 000 000
   }
 }
 ```
 - **__lt** - less than
 ```json
 {
   "__lt":{
      "key": "some.key"
   }
 }
 ```
 - **__lte** - less then or equal
 ```json
 {
   "__lt":{
      "key": "some.key"
   }
 }
 ```

 List of logical connectors: 
 - **__and** - logical and.
 ```json
 {
   "__and": [
      // array of conditions
   ]
 }
 ```
 - **__or** - logical or.
 ```json
 {
   "__or": {
      // array of conditions
   }
 }
 ```

Some combinations: 

```json
{
   "description": "condition (binance.BTCUSDT.price >= 90000 && (user.balance.USDT > 100 || user.orders.open.length < 12))"
   "__and": [
      {
         "__gte": {
            "key": "binance.BTCUSDT.price",
            "value": 90000
         }
      }
      {
         "__or": [
            {
               "__gt": {
                  "key": "user.balance.USDT",
                  "value": 100
               }
            },
            {
               "__lt" : {
                  "length": "user.orders.open",
                  "value": 12
               }
            }
         ]
      }
   ]
}
```

