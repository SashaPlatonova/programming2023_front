<template>
  <section>
  <div class="main_cont">
    <div class="logo">
    <h1>Введите параметры груза</h1>
  </div>
    <v-container
      class="bg-surface-variant mb-6 cont"
    >
    <v-row
        no-gutters
        justify='space-between'
        style="height: 50px;"
      >
        <v-col>
          <p> Высота</p>
          <number-input v-model="height" :min="1" :max="13.6" :step="0.1" inline controls></number-input>
        </v-col>
        <v-col>
          <p>Длина</p>
          <number-input v-model="length" :min="1" :max="13.6" :step="0.1" inline controls></number-input>
        </v-col>
      <v-col>
        <p style="height: 10px"></p>
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
      </v-col>
    </v-row>
    </v-container>
    <v-container
      class="bg-surface-variant mb-6 cont"
    >
    <v-row
        no-gutters
        style="height: 50px;"
      >
        <v-col>
          <p> Ширина</p>
          <number-input v-model="width" :min="1" :max="13.6" :step="0.1" inline controls></number-input>
        </v-col>
        <v-col>
          <p>Вес</p>
          <number-input v-model="weight" :min="1" :step="1" :max="20" inline controls></number-input>
        </v-col>
      <v-col>
        <p style="height: 10px"></p>
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
          <v-text-field class="menu_date"
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
      </v-col>
    </v-row>
    </v-container>
     <div class="calendar">
      <br>
      <v-btn text color="primary" @click="search('http://localhost:8000/api/transport/filter/params')">Найти</v-btn>
    </div>
    <div class="column">
  <v-row class="row">
    <CarCardCounter
    v-for="car in carItems"
        :key="car.id"
        :car-item="car"
        :date-begin="timeToInt()"
        class="card"
    />
  </v-row>
    </div>
  </div>
  </section>
</template>

<script>
import CarCardCounter from '../components/CarCardCounter'

export default {
  components: { CarCardCounter },
  name: 'Counter',
  data: () => ({
    value: 1,
    weight: 0,
    height: 0,
    width: 0,
    length: 0,
    menu: false,
    menu2: false,
    date_begin: new Date().toISOString().substr(0, 10),
    time_begin: new Date().toISOString().substr(11, 5),
    carItems: []
  }),
  methods: {
    async getOrders (apiURL) {
      await this.axios.get(apiURL, {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          this.orderItems = res.data
          for (let i = 0; i < this.orderItems.length; i++) {
            this.orderItems[i].time_start = this.timeConverter(this.orderItems[i].time_start)
            this.orderItems[i].time_end = this.timeConverter(this.orderItems[i].time_end)
          }
          console.log(res.data)
          this.time_begin = null
          this.time_end = null
          this.date_begin = null
          this.date_end = null
        })
        .catch(err => {
          console.log('error displaying subdivisionItems', err)
        })
    },
    // eslint-disable-next-line camelcase
    timeConverter (UNIX_timestamp) {
      // eslint-disable-next-line camelcase
      const a = new Date(UNIX_timestamp * 1000)
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
    async search (apiURl) {
      await this.axios.post(apiURl, {
        date_begin: this.date_begin,
        time_begin: this.time_begin,
        length: this.length,
        weight: this.weight,
        width: this.width,
        height: this.height
      },
      {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          this.carItems = res.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    timeToInt () {
      console.log(this.date_begin + 'T' + this.time_begin + ':00')
      console.log(Date.parse(this.date_begin + 'T' + this.time_begin + ':00'))
      return Date.parse(this.date_begin + 'T' + this.time_begin + ':00') / 1000
    }
  }
}
</script>

<style scoped>
.main_cont{
  margin: auto;
  width: 80%;
  justify-content: space-around;
}
.logo {
    margin: 30px auto;
    color: darkorange;
    text-align: center;
  }
.cont{
  max-width: 700px;
}
.calendar{
  text-align: center;
}
.menu_date{
  padding-top: 10px;
}
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
</style>
