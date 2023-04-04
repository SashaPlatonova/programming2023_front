<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >

    <img :src="require('../assets/'+carItem.type.logo)"
        class="my-3 img"
          contain
          height="200">

    <v-card-title>

      Название: {{ carItem.model_name}}
      <br>
    </v-card-title>

    <v-card-subtitle>
      Стоимость: {{ carItem.rent_cost }} руб/час

    </v-card-subtitle>
    <v-card-actions>
      <v-btn
        color="orange lighten-2"
        text
      >
        Explore
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
         Тип: {{carItem.type.type_name}}
         Высота: {{ carItem.high}}
         Ширина: {{ carItem.width}}
         Длина: {{ carItem.length}}
        </v-card-text>
        <v-btn color="success" @click="$router.push('/orderCreate/' + carItem.id +'/' + dateBegin)">Забронировать</v-btn>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script>

export default {
  name: 'CarCardCounter',
  data: () => ({
    show: false
  }),
  props: {
    carItem: Object,
    dateBegin: Number
  },
  methods: {
    async deleteCar (apiURl) {
      await this.axios.delete(apiURl,
        {
          headers: {
            Authorization: 'Token ' + this.$cookies.get('token').toString()
          }
        })
        .then(function (response) {
          console.log(response)
          // this.$router.push('/cars/' + this.carItem.type.id)
          // this.$router.go(0)
          location.reload()
        })
        .catch(function (error) {
          console.log(error)
        })
      location.reload()
    }
  }
}
</script>

<style scoped>
  .img {
    margin-left: auto;
    display: block;
    margin-right: auto;
  }
  a {
   margin: 16px;
   display:  inline-block;
   text-decoration: none;
   font-weight: 900;
   color: #000;
   padding: 5px;
   border-radius: 10px;
  }
  a:hover{
   background: orange;
   color: #fff;
  }
  .delete_button{
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    margin-top: 10px;
  }

</style>
