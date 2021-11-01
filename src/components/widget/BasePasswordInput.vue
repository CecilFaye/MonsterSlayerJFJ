<template>
  <input type="password" @blur="onBlur" :class="errorClass" />
  <p v-if="isInvalid" :style="errorStyles">
    Password is required!
  </p>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Prop, ref } from 'vue'
import { StyleInterface } from "@/store/types";

interface Props {
  modelValue: string;
  errorStyles: StyleInterface;
}

const BaseTextInput = defineComponent({
  props: {
    modelValue: { required: true } as Prop<string>,
    errorStyles: { required: false } as Prop<StyleInterface>
  },
  emits: {
    'update:modelValue': (value: string) => value !== undefined
  },
  setup(props: Props, context) {
    const isDirty = ref<boolean>(false);
    const isInvalid = computed(() => {
      return props.modelValue === '' && isDirty.value
    })

    const onBlur = (event: Event) => {
      isDirty.value = true;
      context.emit('update:modelValue', (event.target as any).value);
    }

    const errorClass = computed((): string => {
      return isInvalid.value ? 'error' : ''
    })

    return {
      isInvalid,
      onBlur,
      errorClass
    }
  }
})

export default BaseTextInput;
</script>

<style scoped>
input {
  width: 95%;
  padding: 10px;
  font-size: 14px;
  outline: none;
}

.error {
  border: 1px solid darkred;
}
</style>