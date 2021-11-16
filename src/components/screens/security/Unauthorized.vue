<template>
  <div class="not-authorized">
    <h1>YOU ARE NOT AUTHORIZED</h1>
    <router-link to="/login">Go back to login</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const Unauthorized = defineComponent({
})

export default Unauthorized;
</script>

<style scoped>
.not-authorized {
  text-align: center;
}
</style>
