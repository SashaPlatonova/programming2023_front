<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <Slide class="menu_sl">
          <v-btn class="menu_list_cl" @click="$router.back()">Назад</v-btn>
          <v-btn class="menu_list_cl" @click="$router.push('/start')">Главная</v-btn>
          <v-btn class="menu_list_cl" @click="$router.push('/profile/')">Аккаунт</v-btn>
          <v-btn class="menu_list_cl" @click="$router.push('/signin')">Выйти</v-btn>
        </Slide>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Programming 2023</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { Slide } from 'vue-burger-menu'
export default {
  name: 'App',
  components: {
    Slide // Register your component
  },
  data: () => ({
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me 2' }
    ]
  })
}
</script>
<style>
.menu_sl{
  height: max-content;
}
.bm-menu{
  height: min-content;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #1976d2;
}
.bm-burger-button {
  top: 10px
}
.line-style{
  background-color: white;
}
.bm-item-list{
  background-color: #1976d2;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  margin-top: 20px;
}
.theme--dark.v-btn.v-btn--has-bg{
  background-color: #1976d2;
}
.menu_list_cl{
  margin-bottom: 20px;
  padding: 10px;
}

</style>
