<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >

    <img :src="require('../assets/document.png')"
        class="my-3 img"
          contain
          height="200">

    <v-card-title>

      Название: {{ orderItem.order_name}}
      <br>
    </v-card-title>

    <v-card-subtitle>
      Заказчик: {{ orderItem.user_id.full_name }}
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
         Модель машины: {{ orderItem.transport_id.model_name }}
          <br>
         Время: {{ orderItem.time_start }} - {{ orderItem.time_end }}
        </v-card-text>
      </div>
      <v-btn v-if="checkDate" color="error">Отменить заказ</v-btn>
    </v-expand-transition>
  </v-card>
</template>
<script>

export default {
  name: 'OrderCard',
  data: () => ({
    show: false
  }),
  props: {
    orderItem: Object
  },
  methods: {
    checkDate () {
      return (new Date().getDate() > this.orderItem.time_end)
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
