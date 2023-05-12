<template>
    <section>
    <div class="logo">
    <h1>Мой аккаунт</h1>
  </div>
        <v-card
  elevation="10"
  class = "mx-auto"
  max-width="50%"
  >
  <v-form
    ref="form"
    :style="{'padding':'20px'}"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="id"
      label="ID"
      required
      disabled
    ></v-text-field>
  <v-text-field
      v-model="registration_num"
      label="registration_num"
      required
      disabled
    ></v-text-field>
    <v-text-field
      v-model="full_name"
      label="Full name"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email"
      required
    ></v-text-field>
     <v-text-field
      v-model="phone"
      label="Phone"
      required
    ></v-text-field>
  <v-text-field
      v-model="username"
      label="Username"
      required
    ></v-text-field>
    <v-text-field
      v-model="passport"
      label="Passport"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      required
    ></v-text-field>
    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="pushUser('http://localhost:8000/api/residents/update/' + id + '/',
       { headers: { Authorization: 'Token ' + $cookies.get('token').toString() } })
       getNewInfo('http://localhost:8000/api/residents/all/')"
    >
      Update
    </v-btn>
    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      Log out
    </v-btn>
    <v-btn
      color="error"
      class="mr-4"
      @click="$router.push('/start/')
    $router.go()"
    >
      To start menu
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
  name: 'Profile',
  data: () => ({
    id: '',
    registration_num: null,
    full_name: '',
    email: '',
    username: '',
    passport: '',
    message: '',
    password: '',
    phone: '',
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
    async pushUser (url) {
      await this.axios.put(url, {
        registration_num: this.registration_num,
        full_name: this.full_name,
        email: this.email,
        username: this.username,
        passport: this.passport,
        message: this.message,
        password: this.password,
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
          this.$router.go()
        })
        .catch(error => {
          this.message = 'Password is simple'
          console.log(error)
          this.$cookies.set('token', 'error')
        })
    },
    async reset () {
      await this.axios.post('http://localhost:8000/auth/token/logout/', {}, {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          console.log(res)
          this.$cookies.set('token', 'error')
          this.$router.push('/start')
          this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getUpdateItems (URl_) {
      await this.axios.get(URl_, { headers: { Authorization: 'Token ' + this.$cookies.get('token').toString() } })
        .then(res => {
          this.id = res.data.id
          this.username = res.data.username
          this.password = res.data.password
          this.registration_num = res.data.registration_num
          this.phone = res.data.phone
          this.getNewInfo('http://localhost:8000/api/residents/all/')
        })
        .catch(err => {
          console.log('error displaying subdivisionItem', err)
        })
    },
    async getNewInfo (URL) {
      await this.axios.get(URL + this.id + '/', { headers: { Authorization: 'Token ' + this.$cookies.get('token').toString() } })
        .then(res => {
          this.full_name = res.data.full_name
          this.passport = res.data.passport
          this.email = res.data.email
          this.registration_num = res.data.registration_num
          this.phone = res.data.phone
        })
        .catch(err => {
          console.log('error displaying subdivisionItem', err)
        })
    }
  },
  created () {
    if (this.$cookies.get('token') === 'error') {
      this.$router.push('/signin')
    }
    const URl_ = 'http://localhost:8000/auth/users/me/'
    this.getUpdateItems(URl_)
    // console.log('id is')
    // console.log(this.id)
    // var URL = 'http://localhost:8000/api/residents/all/'
    // this.getNewInfo(URL)
  }
}
</script>
<style>
.logo {
    margin: 30px auto;
    color: darkorange;
    text-align: center;
  }
</style>
