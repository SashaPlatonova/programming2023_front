<template>
<section>
    <div class="logo">
    <h1>Создать заявку</h1>
  </div>
        <v-card
  elevation="10"
  class = "mx-auto"
  max-width="50%"
  >
   <div>
     <p>{{carInfo}}</p>
   </div>
  <v-form autocomplete="off"
    ref="form"
    :style="{'padding':'20px'}"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="time_start"
      label="Дата и время"
      required
    ></v-text-field>
    <v-text-field
      v-model="full_name"
      label="Full name"
      required
    ></v-text-field>
    <v-text-field
      v-model="username"
      label="Username"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email"
      autocomplete="off"
      required
    ></v-text-field>
     <v-text-field
      v-model="phone"
      label="Phone"
      required
    ></v-text-field>
    <v-text-field
      v-model="passport"
      label="Passport"
      required
    ></v-text-field>
    <v-text-field v-if="this.start_pass === '-'"
      v-model="us_password"
      label="Придумайте пароль"
      autocomplete="off"
      type="password"
    ></v-text-field>
    <v-btn v-if="but"
      color="success"
      class="mr-4"
      @click="send_order"
    >
      Подтвертить
    </v-btn>
    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      Сбросить
    </v-btn>
  </v-form>
          <v-card-text text-color="error">
      {{ message }}
  </v-card-text>
        </v-card>
    </section>
</template>

<script>
export default {
  name: 'OrderCreate',
  data: () => ({
    carInfo: '',
    carId: 0,
    id: 0,
    full_name: '',
    email: '',
    passport: '',
    us_password: '',
    but: true,
    start_pass: '-',
    phone: '',
    transport_id: 0,
    time_start: 0,
    time_end: 0,
    message: '',
    username: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    first_nRules: [
      v => !!v || 'It is required',
      v => (v && v.length <= 40) || 'It must be less than 40 characters'
    ]
  }),
  methods: {
    send_order () {
      if (this.id === 0) {
        this.pushUser()
      } else {
        this.updateUser('http://localhost:8000/api/residents/update/' + this.id + '/')
        if (this.message === '') {
          this.pushOrder()
        }
      }
    },
    async pushUser () {
      await this.axios.post('http://localhost:8000/auth/users/', {
        full_name: this.full_name,
        passport: this.passport,
        password: this.us_password,
        phone: this.phone,
        username: this.username,
        email: this.email
      })
        .then(response => {
          console.log(response)
          this.id = response.data.id
          this.pushOrder()
        })
        .catch(error => {
          this.message = error
          console.log(error)
          this.$cookies.set('token', 'error')
        })
    },
    async pushOrder () {
      await this.axios.post('http://localhost:8000/api/order/create', {
        order_name: 'Заказ машины:' + this.carId + ' Польз. ' + this.id,
        user_id: this.id,
        transport_id: this.carId,
        time_start: this.$route.params.date,
        time_end: Number(this.$route.params.date) + Number(60 * 60 * 3)
      },
      {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          console.log(res)
          this.message = 'Заказ успешно создан'
          this.but = false
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    async getCars (apiURL) {
      await this.axios.get(apiURL, {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          this.carItems = res.data
          this.carId = res.data.id
          this.carInfo = res.data.model_name + ' ' + res.data.rent_cost
        })
        .catch(err => {
          console.log('error displaying subdivisionItems', err)
        })
    },
    async getUpdateItems (URl_) {
      await this.axios.get(URl_, { headers: { Authorization: 'Token ' + this.$cookies.get('token').toString() } })
        .then(res => {
          this.id = res.data.id
          this.start_pass = res.data.password
          this.phone = res.data.phone
          this.username = res.data.username
          if (this.id !== 0) {
            this.getNewInfo('http://localhost:8000/api/residents/all/')
          }
        })
        .catch(err => {
          console.log('error displaying subdivisionItem', err)
          this.password = ''
        })
    },
    async getNewInfo (URL) {
      await this.axios.get(URL + this.id + '/', { headers: { Authorization: 'Token ' + this.$cookies.get('token').toString() } })
        .then(res => {
          this.full_name = res.data.full_name
          this.passport = res.data.passport
          this.email = res.data.email
          this.phone = res.data.phone
        })
        .catch(err => {
          console.log('error displaying subdivisionItem', err)
        })
    },
    // eslint-disable-next-line camelcase
    timeConverter (UNIX_timestamp) {
      // eslint-disable-next-line camelcase
      const a = new Date(Number(UNIX_timestamp * 1000))
      console.log(Number(UNIX_timestamp))
      console.log(a)
      const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      const year = a.getFullYear()
      const month = months[a.getMonth()]
      const date = a.getDate()
      const hour = a.getHours()
      let min = a.getMinutes()
      if (min < 10) {
        min = min + '0'
      }
      const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min
      return time
    },
    async updateUser (url) {
      await this.axios.put(url, {
        full_name: this.full_name,
        email: this.email,
        passport: this.passport,
        username: this.username,
        password: this.us_password,
        phone: this.phone
      },
      {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(response => {
          console.log(response)
          this.message = 'Ok'
          return true
        })
        .catch(error => {
          this.message = 'Password is simple'
          console.log(error)
          this.$cookies.set('token', 'error')
          return false
        })
    }
  },
  created () {
    const apiURl = 'http://localhost:8000/api/transport/all/' + this.$route.params.car + '/'
    this.getCars(apiURl)
    this.time_start = this.timeConverter(this.$route.params.date)
    this.time_end = this.timeConverter(Number(this.$route.params.date) + Number(60 * 60 * 3))
    const URl_ = 'http://localhost:8000/auth/users/me/'
    this.getUpdateItems(URl_)
  }
}
</script>

<style scoped>

</style>
