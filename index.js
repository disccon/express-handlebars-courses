const express = require('express')
const exphbs = require('express-handlebars')
const csrf = require('csurf')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const compression = require('compression')
const homeRoutes = require('./routers/home')
const cardRoutes = require('./routers/card')
const addRoutes = require('./routers/add')
const ordersRoutes = require('./routers/orders')
const coursesRoutes = require('./routers/courses')
const authRoutes = require('./routers/auth')
const profileRoutes = require('./routers/profile')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorMiddleware = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys/index')

const app = express()
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
})
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}))
app.use(fileMiddleware.single('avatar'))

app.use(csrf())
app.use(flash())

app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)


app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)


app.use(errorMiddleware)

const PORT = process.env.PORT || 3000


async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }

  catch (e) {
    console.log(e)
  }
}

start()




