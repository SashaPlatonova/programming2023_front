<template>
  <v-card
    class="mx-auto"
    min-width="500"
  >
   <img :src="require('../assets/'+typeItem.logo)"
        class="my-3 img"
          contain
          height="200">

    <v-card-title
    @click="$router.push('/cars/' + typeItem.id)
    $router.go()">
      {{ typeItem.type_name }}
    </v-card-title>

    <v-card-subtitle>
      Хар-ки:
      <br>
      Грузоподъемность: {{ typeItem.load_capacity}}
      <br>
      Название: {{ typeItem.type_name}}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn @click="$router.push('/cars/' + typeItem.id)
    $router.go()"
        color="orange lighten-2"
        text
      >
        Посмотреть машины
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
         Высота: {{ typeItem.high_max}} - {{ typeItem.high_max}}
         Ширина: {{ typeItem.min_weight}} - {{ typeItem.max_weight}}
         Длина: {{ typeItem.min_length}} - {{ typeItem.max_length}}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script>
export default {
  name: 'TransportTypeCard',
  data: () => ({
    show: false
  }),
  props: {
    typeItem: Object
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
  .img {
    margin-left: auto;
    display: block;
    margin-right: auto;
  }
</style>
