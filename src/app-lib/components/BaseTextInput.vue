<template>
	<input v-if="!isPassword" type="text" @blur="onBlur" :class="errorClass" />
	<input v-if="isPassword" type="password" @blur="onBlur" :class="errorClass" />
	<p v-show="isInvalid" :style="errorStyles">
		{{ errorText }}!
	</p>
</template>

<script lang="ts">
import { computed, defineComponent, Prop, ref } from 'vue';
import { StyleInterface } from "@/store/types";

interface Props {
	formInputType: InputType;
	modelValue: string;
	errorStyles: StyleInterface;
	errorLabel: string;
	charLimit: number;
}

export enum InputType {
	text = 'text',
	email = 'email',
	password = 'passowrd'
}

const BaseTextInput = defineComponent({
	props: {
		charLimit: { required: false } as Prop<number>,
		formInputType: { required: true } as Prop<InputType>,
		errorLabel: { required: true } as Prop<string>,
		modelValue: { required: true } as Prop<string>,
		errorStyles: { required: false } as Prop<StyleInterface>
	},
	emits: {
		'update:modelValue': (value: string) => value !== undefined,
		'validationLogger': (value: string) => value
	},
	setup(props: Props, context) {
		const errorText = ref<string>('');
		const isDirty = ref<boolean>(false);
		const isInvalid = computed(() =>  {
			const hasValidValue = isValid(props.modelValue) && isDirty.value ;
			context.emit('validationLogger', hasValidValue ? 'Error' : '');
			return hasValidValue;
		});

		const onBlur = (event: Event) => {
			isDirty.value = true;
			context.emit('update:modelValue', (event.target as any).value);
		};

		const isValid = (value: string): boolean => {
			if (props.formInputType === InputType.email && value.trim() !== '') {
				errorText.value = 'Please enter a valid email address';
				return !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value));
			} else if (!!props.charLimit && (!!value?.length && value?.length < props.charLimit)) {
				errorText.value = `Minimum required ${props.charLimit} characters`;
				return true;
			} else {
				errorText.value = props.errorLabel;
				return value.trim() === '';
			}
		};

		const isPassword = computed((): boolean => {
			return  props.formInputType === InputType.password;
		});

		const errorClass = computed((): string => {
			return isInvalid.value ? 'error' : ''
		});

		return {
			isInvalid,
			isPassword,
			onBlur,
			errorClass,
			errorText
		};
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
		border: 1px solid rgb(255, 65, 65);
		color:rgb(255, 65, 65);
	}
</style>