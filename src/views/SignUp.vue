<template>
    <section>
    <h1>Sign Up</h1>
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
      v-model="phone"
      label="Номер телефона"
      required
    ></v-text-field>
    <v-text-field
      v-model="full_name"
      label="ФИО"
      required
    ></v-text-field>
    <v-text-field
      v-model="username"
      label="Username"
      required
    ></v-text-field>
  <v-text-field
      v-model="passport"
      label="Паспорт"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      :counter="4"
      type="password"
      label="Password"
      required
    ></v-text-field>
    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="pushUser('http://localhost:8000/auth/users/')"
    >
      Submit
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      Reset
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
  name: 'Signup',
  data: () => ({
    phone: '',
    full_name: '',
    passport: '',
    password: '',
    message: '',
    username: ''
  }),
  methods: {
    async pushUser (url) {
      await this.axios.post(url, {
        full_name: this.full_name,
        passport: this.passport,
        phone: this.phone,
        password: this.password,
        username: this.username,
        message: ''
      })
        .then(response => {
          console.log(response)
          this.message = 'Ok'
          this.$router.push('/signin')
        })
        .catch(error => {
          this.message = 'Password is simple'
          console.log(error)
          this.$cookies.set('token', 'error')
        })
    },
    reset () {
      this.$refs.form.reset()
    }
  }
}
</script>
