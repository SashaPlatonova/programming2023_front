<template>
  <div class="wrapper">
 <div class="card">
  <div class="face face1">
   <div class="content">
    <img :src="require('../assets/truck_logo.svg')"
        class="my-3 img"
          contain
          height="200">
    <h3>Транспорт</h3>
   </div>
  </div>
  <div class="face face2">
   <div class="content">
    <p @click="$router.push('/types')
    $router.go()">Посмотреть инфорацию о досутпном транспорте</p>

    <a href="http://localhost:8080/types">Click me</a>
   </div>
  </div>
 </div>
 <div class="card">
  <div class="face face1">
   <div class="content">
   <img :src="require('../assets/doc.svg')"
        class="my-3 img"
          contain
          height="200">
    <h3>Заявки на перевозку</h3>
   </div>
  </div>
  <div class="face face2">
   <div class="content">
    <p>Посмотреть бронирования</p>
    <a @click="$router.push('/orders/')
        $router.go()">Click me</a>
   </div>
  </div>
 </div>
     <div class="card">
  <div class="face face1">
   <div class="content">
    <img :src="require('../assets/money.svg')"
        class="my-3 img"
          contain
          height="200">
    <h3>Подобрать машину</h3>
   </div>
  </div>
  <div class="face face2">
   <div class="content">
    <p>Нажмите, чтобы подобрать машину</p>
    <a @click="$router.push('/filter/')
        $router.go()">Click me</a>
   </div>
  </div>
 </div>
<div v-if="id!==''" class="card">
  <div class="face face1">
   <div class="content">
    <img :src="require('../assets/user.svg')"
        class="my-3 img"
          contain
          height="200">
    <h3>Мой аккаунт</h3>
   </div>
  </div>
  <div class="face face2">
   <div class="content">
    <ul>
      <br>
      <li>Reg. num: {{this.registration_num}}</li>
      <li>Username: {{this.username}}</li>
      <li>Email: {{this.email}}</li>
      <li>Phone: {{this.phone}}</li>
      <li>Full name: {{this.full_name}}</li>
    </ul>
     <a class="update_data" href="http://localhost:8080/profile/">Изменить</a>
   </div>
  </div>
 </div>
    <div v-else class="card">
  <div class="face face1">
   <div class="content">
    <img :src="require('../assets/user.svg')"
        class="my-3 img"
          contain
          height="200">
    <h3>Мой аккаунт</h3>
   </div>
  </div>
  <div class="face face2">
   <div class="content">
     <v-btn class="mr-4" color="success" @click="$router.push('http://localhost:8080/signin/')">SignIn</v-btn>
     <v-btn class="mr-4" @click="$router.push('http://localhost:8080/signin/')">SignUp</v-btn>
   </div>
  </div>
 </div>
</div>
</template>

<script>

export default {
  data: () => ({
    show: false,
    id: '',
    registration_num: '',
    full_name: '',
    email: '',
    phone: '',
    is_superuser: false,
    username: '',
    passport: '',
    message: '',
    password: ''
  }),
  name: 'Start',
  methods: {
    async getUpdateItems (URl_) {
      await this.axios.get(URl_, { headers: { Authorization: 'Token ' + this.$cookies.get('token').toString() } })
        .then(res => {
          this.id = res.data.id
          this.registration_num = res.data.registration_num
          this.username = res.data.username
          this.password = res.data.password
          this.getUserInfo('http://localhost:8000/api/residents/all/' + this.id + '/')
        })
        .catch(err => {
          console.log('error displaying subdivisionItem', err)
        })
    },
    async getUserInfo (URl_) {
      await this.axios.get(URl_, { headers: { Authorization: 'Token ' + this.$cookies.get('token').toString() } })
        .then(res => {
          this.id = res.data.id
          this.registration_num = res.data.registration_num
          this.full_name = res.data.full_name
          this.passport = res.data.passport
          this.email = res.data.email
          this.phone = res.data.phone
          this.is_superuser = res.data.is_superuser
          this.username = res.data.username
          this.password = res.data.password
        })
        .catch(err => {
          console.log('error displaying subdivisionItem', err)
        })
    }
  },
  created () {
    if (this.$cookies.get('token') !== 'error') {
      const URl_ = 'http://localhost:8000/auth/users/me/'
      this.getUpdateItems(URl_)
    }
  }
}
</script>

<style scoped>
  * {
    margin: 0 auto;
  }
  body{
 margin: 0 auto;
 padding: 0;
 min-height: 100vh;
 background: #333;
 display: flex;
 justify-content: center;
 align-items: center;
 font-family: consolas;
}

.wrapper{
 width: 1200px;
 position: relative;
 display: flex;
 flex-wrap: wrap;
 justify-content: space-around;
}

.wrapper .card{
 position: relative;
 cursor: pointer;
  margin-left: 30px;
}

.wrapper .card .face{
 width: 500px;
 height: 300px;
 transition: 0.5s;
}

.wrapper .card .face.face1{
 position: relative;
 background: #333;
 display: flex;
 justify-content: center;
 align-items: center;
 z-index: 1;
 transform: translateY(100px);
}

.wrapper .card:hover .face.face1{
 background: darkorange;
 transform: translateY(0);
}

.wrapper .card .face.face1 .content{
 opacity: 0.2;
 transition: 0.5s;
}

.wrapper .card:hover .face.face1 .content{
 opacity: 1;
}

.wrapper .card .face.face1 .content img{
 max-width: 100px;
}

.wrapper .card .face.face1 .content h3{
 margin: 10px 0 0;
 padding: 0;
 color: #fff;
 text-align: center;
 font-size: 1.5em;
}

.wrapper .card .face.face2{
 position: relative;
 background: #fff;
 display: flex;
 justify-content: center;
 align-items: center;
 padding: 20px;
 box-sizing: border-box;
 box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
 transform: translateY(-100px);
}

.wrapper .card:hover .face.face2{
 transform: translateY(0);
}

.wrapper .card .face.face2 .content p{
 margin: 0;
 padding: 0;
}

.wrapper .card .face.face2 .content a{
 margin: 15px 0 0;
 display:  inline-block;
 text-decoration: none;
 font-weight: 900;
 color: #333;
 padding: 5px;
 border: 1px solid #333;
}

.wrapper .card .face.face2 .content a:hover{
 background: #333;
 color: #fff;
}

.update_data{
  text-align: end;
}
.new_acc{
  margin-right: 20px;
  justify-content: space-around;
}
</style>
