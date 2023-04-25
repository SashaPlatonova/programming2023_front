<template>
<section>
  <div class="logo">
    <h1>Список бронирований</h1>
  </div>
  <div class="column">
  <v-row class="row">
    <div v-if="orderItems.length===0" class="warning">
      <p>У вас пока нет заказов</p>
    </div>
    <OrderCard
        v-for="orderItem in currentList"
        :key="orderItem.id"
        :order-item="orderItem"
        class="card"
      />
  </v-row>
  <div class="calendar" v-if="checkAdmin()">
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

    <br>
    <v-btn text color="primary" @click="filter('http://localhost:8000/api/order/filter/busy')">Фильтровать</v-btn>
    <v-btn text color="primary" @click="getOrders('http://localhost:8000/api/order/all')">Сбросить фильтр</v-btn>
</div>
    <div class="pers_filter" v-if="!checkAdmin()">
      <div class="check">
     <label class="toggler-wrapper style-20">
          <input type="checkbox" v-model="free">
          <div class="toggler-slider">
            <div class="toggler-knob"></div>
          </div>
        </label>
    </div>
      <v-btn text color="primary" @click="getOrders('http://localhost:8000/api/order/all?user=' + $route.params.id)">Сбросить фильтр</v-btn>
    </div>
    </div>
</section>
</template>
<script>
import OrderCard from '../components/OrderCard'

export default {
  components: {
    OrderCard
  },
  name: 'Orders',
  data: () => ({
    orderItems: [],
    checked: false,
    menu: false,
    menu1: false,
    menu2: false,
    menu3: false,
    date_begin: new Date().toISOString().substr(0, 10),
    date_end: new Date().toISOString().substr(0, 10),
    time_begin: null,
    time_end: null,
    picker: null,
    time: null,
    free: false,
    currentList: [],
    computed: {
      id () {
        console.log('id', this.$route.params.id)
        return this.$route.params.id
      },
      dateRangeText () {
        return this.dates.join(' ~ ')
      }
    }
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
          this.currentList = this.orderItems
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
      this.type_id = this.$route.params.id
    },
    checkAdmin () {
      if (this.$cookies.get('isAdmin') === 'true') {
        return true
      }
      return false
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
    async filter (apiURl) {
      await this.axios.post(apiURl, {
        date_begin: this.date_begin,
        date_end: this.date_end,
        time_begin: this.time_begin,
        time_end: this.time_end
      },
      {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          this.orderItems = res.data
          this.currentList = res.data
          for (let i = 0; i < this.orderItems.length; i++) {
            this.orderItems[i].time_start = this.timeConverter(this.orderItems[i].time_start)
            this.orderItems[i].time_end = this.timeConverter(this.orderItems[i].time_end)
          }
          console.log(res)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  created () {
    let apiURl = 'http://localhost:8000/api/order/all?user=' + this.$route.params.id
    if (this.checkAdmin()) {
      apiURl = 'http://localhost:8000/api/order/all'
    }
    console.log(this.$cookies.get('isAdmin'))
    this.getOrders(apiURl)
  },
  watch: {
    free (newFree) {
      if (newFree) {
        this.currentList = this.orderItems.filter(o => o.status.includes('Исполнен'))
        console.log('true')
      } else {
        this.currentList = this.orderItems.filter(o => o.status.includes('Не исполнен'))
        console.log('false')
      }
    }
  },
  computed: {
    sortedArray () {
      let sortedOrders = this.orderItems
      sortedOrders = sortedOrders.sort((a, b) => {
        return a.time_start - b.time_start
      })
      return sortedOrders
    }
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
  .time{
    width: 100px;
  }
  .toggler-wrapper {
  display: block;
  width: 45px;
  height: 25px;
  cursor: pointer;
  position: relative;
}

.toggler-wrapper input[type="checkbox"] {
  display: none;
}

.toggler-wrapper input[type="checkbox"]:checked+.toggler-slider {
  background-color: #44cc66;
}

.toggler-wrapper .toggler-slider {
  background-color: #ccc;
  position: absolute;
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
  width: 300px;
  text-align: center;
}
  .toggler-wrapper.style-21 {
  width: 300px;
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
  width: 130px;
  display: inline-block;
  left: -2px;
}

.toggler-wrapper.style-21 input[type="checkbox"]:checked+.toggler-slider .toggler-knob {
  /*background-image: url(../img/check-fill.svg);*/
}

.toggler-wrapper.style-21 input[type="checkbox"]:checked+.toggler-slider .toggler-knob:before {
  opacity: 0.4;
}

.toggler-wrapper.style-21 input[type="checkbox"]:checked+.toggler-slider .toggler-knob:after {
  opacity: 1;
}

.toggler-wrapper.style-21 .toggler-slider {
  background-color: #eb4f37;
}

.toggler-wrapper.style-21 .toggler-knob {
  position: relative;
  height: 100%;
  /*background-image: url(../img/close-fill.svg);*/
  background-repeat: no-repeat;
  background-position: center;
  width: 130px;
  display: inline-block;
  left: -2px;
}

.toggler-wrapper.style-20 .toggler-knob:before {
  content: 'Невыполнены';
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
  content: 'Выполнены';
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
.toggler-wrapper.style-21 .toggler-knob:before {
  content: 'Новые';
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

.toggler-wrapper.style-21 .toggler-knob:after {
  content: 'Старые';
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
.warning{
  margin: 30px 50%;
  text-align: center;
  font-size: 20px;
  background-color: white;
  color: white;
  min-width: max-content;
  padding: 20px;
}
</style>
