const express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser');

const app = express();
const port = 3000

app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/WebTech', {

}).then(() => {
    console.log('Connection to MongoDB successful!')
  },
  error => {
    console.log('Error: ' + error)
  }
)

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  name: String,
  password: String,
  isAdmin: Boolean
})
const isValidHexColor = (value) => /^([0-9a-fA-F]{3}){1,2}$/.test(value);
const paintSchema = new Schema({
  color: {
    type: String,
    required: true,
    validate: {
      validator: isValidHexColor,
      message: 'Invalid color!'
    }
  },
  stock: {
    type: Number,
    min: 0
  },
  unitPrice: {
    type: Number,
    min: 0
  },
})

const salesSchema = new Schema({
  costumer: String,
  paint: String,
  amount: {
    type: Number,
    min: 1
  },
  isShipped: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model("User", userSchema);
const Paint = mongoose.model("Paint", paintSchema);
const Sales = mongoose.model("Sales", salesSchema);
run()
async function run() {
  try {
    let paramUsr = req.params.user
    let paramPwd = req.params.pwd
    const user1 = new User({name: "user", password: "user", isAdmin: false})
    const user2 = new User({name: "admin", password: "admin", isAdmin: true})
    await user1.save()
    await user2.save()
  } catch (e) {
    console.log(e.message)
  }
}
app.get('/getOrders', (req, res) => {
  getOrders()
  async function getOrders() {
    try {
      const salesList = await Sales.find()
      res.send([salesList])
    } catch (e) {
      console.log(e.message)
    }
  }
})
app.get('/getPaintList', (req, res) => {
  getPaintList()
  async function getPaintList() {
    try {
      const paintList = await Paint.find()
      res.send([paintList])
    } catch (e) {
      console.log(e.message)
    }
  }
})
app.get('/shipPaint/:user-:pwd-:id', (req, res) => {
  shipPaint()
  async function shipPaint() {
    try {
      let paramUsr = req.params.user
      let paramPwd = req.params.pwd
      let authVar = await auth(paramUsr, paramPwd)
      if (authVar[0] && authVar[1]) {
        let paramID = req.params.id
        const existingSale = await Sales.findById(paramID)
        if (existingSale != null) {
          existingSale.isShipped = true;
          await existingSale.save()
          res.send(["Order shipped!"])
        } else {
          res.send(["Sale doesn't exist!"])
        }
      } else {
        res.send("Error")
      }
    } catch (e) {
      res.send([e.message])
    }
  }
})
app.get('/buyPaint/:user-:pwd-:color-:amount', (req, res) => {
  buyPaint()
  async function buyPaint() {
    try {
      let paramUsr = req.params.user
      let paramPwd = req.params.pwd
      let authVar = await auth(paramUsr, paramPwd)
      if (authVar[0]) {
        let paramColor = req.params.color
        let paramAmount = req.params.amount
        let paramUser = req.params.user
        const existingPaint = await Paint.findOne({color: paramColor})
        if (existingPaint != null) {
          existingPaint.stock = existingPaint.stock - paramAmount
          await existingPaint.save()
          const newSale = new Sales({costumer: paramUser, paint: paramColor, amount: paramAmount, isSipped: false})
          await newSale.save()
          res.send(["Paint successfully purchased!"])
        } else {
          res.send(["The paint doesn't exist!"])
        }
      } else {
        res.send("Error")
      }
    } catch (e) {
      res.send([e.message])
    }
  }
})

app.get('/addPaint/:user-:pwd-:color-:amount-:price', (req, res) => {
  addPaint()
  async function addPaint() {
    try {
      let paramUsr = req.params.user
      let paramPwd = req.params.pwd
      let authVar = await auth(paramUsr, paramPwd)
      if (authVar[0] && authVar[1]) {
        let paramColor = req.params.color
        let paramAmount = req.params.amount
        let paramPrice = req.params.price
        const existingPaint = await Paint.findOne({color: paramColor})
        if (existingPaint != null) {
          existingPaint.stock = Number(existingPaint.stock) + Number(paramAmount)
          existingPaint.unitPrice = paramPrice
          await existingPaint.save()
          res.send(["Existing paint updated!"])
        } else {
          const paint = new Paint({color: paramColor, stock: paramAmount, unitPrice: paramPrice})
          await paint.save()
          res.send(["New paint added!"])
        }
      } else {
        res.send("Error")
      }
    } catch (e) {
      res.send([e.message])
    }
  }
})
app.get('/loginCheck/:user-:pwd', (req, res) => {
  lCheck()
  async function lCheck() {
    try {
      let paramUsr = req.params.user
      let paramPwd = req.params.pwd
      let authVar = await auth(paramUsr, paramPwd)
      res.send([authVar])
    } catch (e) {
      console.log(e.message)
    }
  }
})

async function auth(paramUsr, paramPwd) {
  try {
  const user = await User.findOne({name: paramUsr})
  if (user == null) {
    return(false, false)
  }
    let isPasswordCorrect = false;
    let isAdmin = false;
    if (paramPwd === user.password){
      isPasswordCorrect = true;
    }
    if (user.isAdmin){
      isAdmin = true;
    }
    //console.log("Auth: " + isPasswordCorrect, isAdmin)
    return[isPasswordCorrect, isAdmin]
} catch (e) {
  console.log(e.message)
}
}
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

