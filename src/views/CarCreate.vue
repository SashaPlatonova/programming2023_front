<template>
<v-sheet width="300" class="mx-auto">

    <v-form ref="form">
      <v-text-field
        v-model="model_name"
        :counter="10"
        label="Name"
        required
      ></v-text-field>
      <v-text-field
        v-model="type"
        label="Type"
        required
      ></v-text-field>
      <v-text-field
        v-model="rent_cost"
        label="Стоимость"
        required
      ></v-text-field>
      <v-select
        v-model="length"
        :items="lengthArr"
        label="Длина"
        required
      ></v-select>
      <v-select
        v-model="weight"
        :items="weightArr"
        label="Ширина"
        required
      ></v-select>
      <v-select
        v-model="high"
        :items="highArr"
        label="Высота"
        required
      ></v-select>
<!--     <h1><span v-if="message_success !== ''">, {{ message_success }}</span></h1>-->
       <v-text-field v-if="message_success !== ''"
        v-model="message_success"
        disabled
      ></v-text-field>
      <div class="d-flex flex-column">
        <v-btn
          color="success"
          class="mt-4"
          block
          @click="pushCar('http://localhost:8000/api/transport/create')"
        >
          Создать
        </v-btn>

        <v-btn
          color="error"
          class="mt-4"
          block
          @click="reset"
        >
          Сбросить
        </v-btn>
        <v-btn
          color="warning"
          class="mt-4"
          block
          @click="$router.push('/cars/' + typeItem.id)"
        >
          Вернуться к списку транспорта
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script>
const URLTYPE = 'http://localhost:8000/api/types/all/'
const URlRES = 'http://localhost:8000/api/transport/all?type='
export default {
  name: 'CarCreate',
  data: () => ({
    model_name: '',
    type: 1,
    rent_cost: null,
    length: null,
    weight: null,
    high: null,
    typeItem: Object,
    lengthArr: [],
    weightArr: [],
    highArr: [],
    message_success: '',
    computed: {
      id () {
        console.log('id', this.$route.params.id)
        return this.$route.params.id
      }
    }
  }),
  methods: {
    async pushCar (apiURl) {
      await this.axios.post(apiURl, {
        model_name: this.model_name,
        type: parseInt(this.type),
        rent_cost: parseInt(this.rent_cost),
        length: this.length,
        weight: this.weight,
        high: this.high
      },
      {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          console.log(res)
          if (res.status === 201) {
            this.message_success = 'Машина добавлена успешно'
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    reset () {
      this.$refs.form.reset()
    },
    async getResident () {
      await this.axios.get(URlRES)
        .then(res => {
          this.residents = res.data
          console.log(this.resident_id)
        })
        .catch(err => {
          console.log('error displaying residentItems', err)
        })
    },
    async getType () {
      await this.axios.get(URLTYPE + this.$route.params.id + '/')
        .then(res => {
          this.typeItem = res.data
          console.log(this.typeItem.id)
        })
        .catch(err => {
          console.log('error displaying typeItems', err)
        })
      this.setArray()
    },
    setArray () {
      const rounded = function (number) {
        return +number.toFixed(2)
      }
      for (let i = this.typeItem.min_length; i <= this.typeItem.max_length; i = i + 0.1) {
        console.log(i)
        if (this.typeItem.min_length === 0) {
          this.lengthArr.push(this.typeItem.max_length)
          this.length = this.typeItem.max_length
          break
        }
        this.lengthArr.push(rounded(i))
      }
      for (let i = this.typeItem.min_weight; i <= this.typeItem.max_weight; i = i + 0.1) {
        if (this.typeItem.min_weight === 0) {
          this.weightArr.push(this.typeItem.max_weight)
          this.weight = this.typeItem.max_weight
          break
        }
        this.weightArr.push(rounded(i))
      }
      for (let i = this.typeItem.high_min; i <= this.typeItem.high_max; i = i + 0.1) {
        if (this.typeItem.high_min === 0) {
          this.highArr.push(this.typeItem.high_max)
          this.high = this.typeItem.high_max
          break
        }
        this.highArr.push(rounded(i))
      }
    }
  },
  created () {
    this.getType()
    this.type = this.$route.params.id
    // this.setArray()
  }
}
</script>

<style scoped>

</style>
