<template>
<section>
  <div class="logo">
    <h1>Список машин</h1>
  </div>
  <div class="column">
  <v-row class="row">
    <CarCard
        v-for="carItem in carItems"
        :key="carItem.id"
        :car-item="carItem"
        class="card"
      />
  </v-row>
  <div class="calendar">
    <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date_begin"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date_begin"
            label="Дата начала"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date_begin" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date_begin)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    <v-menu
        ref="menu_1"
        v-model="menu1"
        :close-on-content-click="false"
        :return-value.sync="date_end"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date_end"
            label="Дата окончания"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date_end" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu1 = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu_1.save(date_end)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    <v-menu
        ref="menu_2"
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="time_begin"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="time_begin"
            label="Время начала"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="menu2"
          v-model="time_begin"
          full-width
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu_2.save(time_begin)">OK</v-btn>
        </v-time-picker>
      </v-menu>
    <v-menu
        ref="menu_3"
        v-model="menu3"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="time_end"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="time_end"
            label="Время окончания"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="menu3"
          v-model="time_end"
          full-width
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu3 = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu_3.save(time_end)">OK</v-btn>
        </v-time-picker>
      </v-menu>
    <div class="check">
     <label class="toggler-wrapper style-20">
          <input type="checkbox" v-model="checked">
          <div class="toggler-slider">
            <div class="toggler-knob"></div>
          </div>
        </label>
    </div>
    <br>
    <v-btn text color="primary" @click="filter()">Фильтровать</v-btn>
    <v-btn text color="primary" @click="getCars('http://localhost:8000/api/transport/all?type='+$route.params.id)">Сбросить фильтр</v-btn>
</div>
  </div>
  <div class="button_add" v-if="checkAdmin()">
  <v-btn v-if="$cookies.get('token')!=='error'"
          color="success"
          class="mt-4 button_add_item"
          block
          max-width="300"
          @click="$router.push('/carsCreate/' + type_id)
    $router.go()"
        >
          Добавить машину
        </v-btn>
    </div>
</section>
</template>
<script>
import CarCard from '../components/CarCard'

export default {
  components: {
    CarCard
  },
  name: 'Cars',
  data: () => ({
    carItems: [],
    type_id: null,
    checked: false,
    menu: false,
    menu1: false,
    menu2: false,
    menu3: false,
    date_begin: new Date().toISOString().substr(0, 10),
    date_end: new Date().toISOString().substr(0, 10),
    time_begin: null,
    time_end: null,
    computed: {
      id () {
        console.log('id', this.$route.params.id)
        return this.$route.params.id
      }
    }
  }),
  methods: {
    async getCars (apiURL) {
      await this.axios.get(apiURL, {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          this.carItems = res.data
          console.log(res.data)
          this.date_begin = null
          this.date_end = null
          this.time_begin = null
          this.time_end = null
        })
        .catch(err => {
          console.log('error displaying subdivisionItems', err)
        })
      this.type_id = this.$route.params.id
    },
    async filter () {
      const freeURL = 'http://localhost:8000/api/transport/filter/free'
      const busyURL = 'http://localhost:8000/api/transport/filter/busy'
      let apiURl
      if (this.checked) {
        apiURl = freeURL
      } else {
        apiURl = busyURL
      }
      await this.axios.post(apiURl, {
        date_begin: this.date_begin,
        date_end: this.date_end,
        time_begin: this.time_begin,
        time_end: this.time_end,
        type: this.$route.params.id
      },
      {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          this.carItems = res.data
          // for (let i = 0; i < this.carItems.length; i++) {
          //   this.carItems[i].time_start = this.timeConverter(this.orderItems[i].time_start)
          //   this.carItems[i].time_end = this.timeConverter(this.orderItems[i].time_end)
          // }
          console.log(res)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    checkAdmin () {
      if (this.$cookies.get('isAdmin') === 'true') {
        return true
      }
      return false
    }
  },
  created () {
    const apiURl = 'http://localhost:8000/api/transport/all?type=' + this.$route.params.id
    this.getCars(apiURl)
  }
}
</script>
<style scoped>
   .column{
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 90%;
  }
  .row {
    width: 80%;
    margin: 0 auto;
  }
  .card {
    width: 450px;
    margin-bottom: 30px;
  }
  .logo {
    margin: 30px auto;
    color: darkorange;
    text-align: center;
  }
  .button_add{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    max-width: 300px;
  }
  .toggler-wrapper input[type="checkbox"] {
  display: none;
}

.toggler-wrapper input[type="checkbox"]:checked+.toggler-slider {
  background-color: #44cc66;
}

.toggler-wrapper .toggler-slider {
  background-color: #ccc;
  /*position: absolute;*/
  border-radius: 100px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-transition: all 300ms ease;
  transition: all 300ms ease;
}

.toggler-wrapper .toggler-knob {
  position: absolute;
  -webkit-transition: all 300ms ease;
  transition: all 300ms ease;
}
  .toggler-wrapper.style-20 {
  width: 200px;
  text-align: center;
}

.toggler-wrapper.style-20 input[type="checkbox"]:checked+.toggler-slider .toggler-knob {
  /*background-image: url(../img/check-fill.svg);*/
}

.toggler-wrapper.style-20 input[type="checkbox"]:checked+.toggler-slider .toggler-knob:before {
  opacity: 0.4;
}

.toggler-wrapper.style-20 input[type="checkbox"]:checked+.toggler-slider .toggler-knob:after {
  opacity: 1;
}

.toggler-wrapper.style-20 .toggler-slider {
  background-color: #eb4f37;
}

.toggler-wrapper.style-20 .toggler-knob {
  position: relative;
  height: 100%;
  /*background-image: url(../img/close-fill.svg);*/
  background-repeat: no-repeat;
  background-position: center;
  width: 80px;
  display: inline-block;
  left: -2px;
}

.toggler-wrapper.style-20 .toggler-knob:before {
  content: 'Заняты';
  position: absolute;
  top: 50%;
  left: -20px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 75%;
  text-transform: uppercase;
  font-weight: 500;
  color: white;
}

.toggler-wrapper.style-20 .toggler-knob:after {
  content: 'Свободны';
  position: absolute;
  top: 50%;
  right: -23px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 75%;
  text-transform: uppercase;
  font-weight: 500;
  color: white;
  opacity: 0.4;
}

.check{
  width: 200px;
  height: 50px;
}
.calendar{
  margin-left: 20px;
}
.button_add{
  margin-bottom: 20px;
}
</style>
