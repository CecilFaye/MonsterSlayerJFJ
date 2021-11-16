<template>
  <div class="not-found">
    <h1>PATH DOES NOT EXIST</h1>
    <router-link to="/">Go back to home</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const NotFound = defineComponent({
})

export default NotFound;
</script>

<style scoped>
.not-found {
  text-align: center;
}
</style>
