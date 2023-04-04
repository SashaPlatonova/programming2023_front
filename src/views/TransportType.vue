<template>
<section>
  <div class="logo">
    <h1>Типы транспорта</h1>
  </div>
  <v-row>
    <TransportTypeCardPr
        v-for="typeItem in typeItems"
        :key="typeItem.id"
        :type-item="typeItem"
        class="my-2"
      />
  </v-row>
</section>
</template>
<script>
import TransportTypeCardPr from '../components/TransportTypeCard'
const apiURl = 'http://localhost:8000/api/types/all'
export default {
  components: {
    TransportTypeCardPr
  },
  name: 'TransportType',
  data: () => ({
    typeItems: []
  }),
  methods: {
    async getTypes () {
      await this.axios.get(apiURl, {
        headers: {
          Authorization: 'Token ' + this.$cookies.get('token').toString()
        }
      })
        .then(res => {
          this.typeItems = res.data
          console.log(res.data)
        })
        .catch(err => {
          console.log('error displaying subdivisionItems', err)
        })
    }
  },
  created () {
    this.getTypes()
  }
}
</script>
<style scoped>
  .row {
    width: 75%;
    margin: 0 auto;
  }
  .users {
    width: 450px;
    margin-bottom: 30px;
  }
  .logo {
    margin: 30px auto;
    color: darkorange;
    text-align: center;
  }
</style>
