<template>
	<teleport to="body">
		<div class="modal-container-overlay" v-if="show" >
			<div class="modal-container" :style="`background-image:url(${(screenImage)});`">
				<div class="modal-form">
					<img class="imgClose" :src="`${closeIcon}`" @click="onSignUpClose">
					<br>
					<baseRowContent>
						<template v-slot:header>
							<label class="modal-label">Name</label>
						</template>
						<base-text-input v-model="fullName"
							@validationLogger="logValidationError($event, 'fullName')"
							:formInputType = "InputType.text"
							:errorLabel="'Name is required'"
							:errorStyles="errorStyles" />
					</baseRowContent>
					<baseRowContent>
						<template v-slot:header>
							<label class="modal-label">Email </label>
						</template>
						<base-text-input v-model="email"
							@validationLogger="logValidationError($event, 'email')"
							:formInputType = "InputType.email"
							:errorLabel="'Email is required'"
							:errorStyles="errorStyles" />
					</baseRowContent>
					<baseRowContent>
						<template v-slot:header>
							<label class="modal-label">Username </label>
						</template>
						<base-text-input v-model="userName"
							@validationLogger="logValidationError($event, 'username')"
							:charLimit = 6
							:formInputType = "InputType.text"
							:errorLabel="'Username is required'"
							:errorStyles="errorStyles" />
					</baseRowContent>
					<baseRowContent>
						<template v-slot:header>
							<label class="modal-label"> Password </label>
						</template>
						<base-text-input  v-model="password" type="password"
							@validationLogger="logValidationError($event, 'password')"
							:charLimit = 6
							:formInputType = "InputType.password"
							:errorLabel="'Password Required'"
							:errorStyles="errorStyles" />
					</baseRowContent>
					<baseRowContent>
						<template v-slot:header>
							<label class="modal-label"> Character Name </label>
						</template>
						<base-text-input v-model="characterName"
							@validationLogger="logValidationError($event, 'charname')"
							:charLimit = 6
							:formInputType = "InputType.text"
							:errorLabel="'Character Name is required'"
							:errorStyles="errorStyles" />
					</baseRowContent>
					<baseRowContent>
						<template v-slot:header>
							<label class="modal-label" for="type"> Character Class </label>
						</template>
						<select id="type" v-model="characterClass" name="characterTypes">
							<option v-for="(type, index) in characterTypes" :key="`type-${index}`">{{type}}</option>
						</select>
					</baseRowContent>
				</div>
				<div class="home-screen-options">
					<div class="home-screen-option"
						@click="signUpRequest()"
						:class="disabledSignUp"
						:disabled="signUpNotAllowed">
						Sign up
					</div>
				</div>
				<div class="home-screen-options">
					<button class="modal-signUp"  @click="showSignUpModal = true">Already have an account? Login here. </button>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script lang="ts">
	import { defineComponent, Prop, computed, ref, watch } from "vue";
	import { CharacterTypes, IAccount, StyleInterface } from "@/store/types";
	import baseTextInput, { InputType } from "../widget/BaseTextInput.vue";
	import baseRowContent from "../widget/BaseRowContent.vue"
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
	import { useStore } from "vuex";
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const home = require('../../assets/background/login-bg.png')
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const closeIcon = require('../../assets/background/close-icon.png');

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const validations: IValidationError[] = [];

	interface IValidationError {
		error: string;
		name: string;
	}

	const SignUp = defineComponent({
		props: {
			show: { required: true } as Prop<boolean>
		},
		components: {
			baseTextInput,
			baseRowContent
		},
		emits: {
			closeSignUpModal: null
		},
		data() {
			return {
				screenImage: home,
				closeIcon
			}
		},
		setup(props, context) {
			const store = useStore();
			const service = useMonsterSlayerService();
			const onSignUpClose = () => { context.emit('closeSignUpModal') };
			const signUpRequest = () => {
				if (!signUpNotAllowed.value) {
					service.signUp({
						fullName: fullName.value,
						email: email.value,
						username: userName.value,
						password: password.value,
						characterName: characterName.value,
						classType: CharacterTypes[characterClass.value]
					} as IAccount)
					.then((response) => {
						if (response) {
							alert('Registration Successful!');
							alert(`Signup ID: ${response.accountId}`);
							onSignUpClose()
						} else {
							alert('Registration Failed!');
						}
					});
				}
			};

			const characterTypes = computed(() => {
				return store.state.game.characterTypes;
			});

			const signUpNotAllowed = computed(() => {
				return fullName.value.trim() === '' ||
				email.value.trim() === '' ||
				userName.value.trim() === '' ||
				password.value.trim() === '' ||
				characterName.value.trim() === '' ||
				withErrors.value
			});

			const errorStyles = computed((): StyleInterface => {
				return {
					'color' : 'darkred',
					'font-size' : '12px',
					'margin-top' : '5px',
					'font-weight' : 'bold'
				}
			});

			const disabledSignUp = computed((): string => {
				return signUpNotAllowed.value ? 'disabled' : ''
			});

			const withErrors = ref<boolean>(false);
			const fullName = ref<string>('');
			const email = ref<string>('');
			const userName = ref<string>('');
			const password = ref<string>('');
			const characterName = ref<string>('');
			const characterClass = ref<string>('Saber');

			const logValidationError = (val: string, name: string) => {
				const errorLog: IValidationError = validations.find(_ => _.name === name);
				if (val) {
					if (!errorLog) {
						validations.push({ error: val, name: name });
					} else {
						errorLog.error = val;
					}
				} else if (errorLog) {
					const index = validations.indexOf(errorLog);
					if (index >= 0) {
						validations.splice(index, 1);
					}
				}
				// Need to add timeout - the click event is just too fast
				setTimeout(() => {
					withErrors.value = !!validations?.length
				});
			};

			return {
				onSignUpClose,
				signUpRequest,
				logValidationError,
				InputType,
				signUpNotAllowed,
				disabledSignUp,
				characterTypes,
				userName,
				password,
				fullName,
				email,
				characterName,
				characterClass,
				errorStyles
			};
		}
	})
	export default SignUp;
</script>
<style scoped>
	.modal-container-overlay {
		position: fixed;
		display: block; /* Hidden by default */
		width: 100%; /* Full width (cover the whole page) */
		height: 100%; /* Full height (cover the whole page) */
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.5); /* Black background with opacity */
		z-index: 5; /* Specify a stack order in case you're using a different order for other elements */
		overflow: auto;
		color: #E4E1CB;
	}

	.modal-header
	{
		font-family: "AxieFont";
		font-size: 40px;
		color: #6fd9d7;
		text-shadow: 3px 0 0 #183640, 0 -3px 0 #183640, 0 3px 0 #183640, -3px 0 0 #183640;
	}

	.modal-label
	{
		font-size: 15px;
		color: white;
		font-weight: bold;
	}

	.modal-signUp
	{
		font-size: 15px;
		color: white;
		text-align: center;
		margin-top: 40px;
		background-color: transparent;
		background-repeat: no-repeat;
		border: none;
		cursor: pointer;
		overflow: hidden;
		outline: none;
	}

	.imgClose
	{
		height: 30px;
		position: absolute;
		left: 92%;
		top: 0%;
		cursor: pointer;
	}

	.home-screen-options {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.home-screen-option {
		border: 2px solid #FFFF;
		color: #FFFF;
		padding: 10px;
		font-size: 20px;
		font-weight: 800;
		margin:20px;
		width: 100%;
		text-align: center;
		cursor: pointer;
	}

	.modal-container {
		width: 450px;
		background-color: white;
		padding: 25px;
		color: black;
		position: absolute;
		left: calc(calc(100vw - 500px) / 2);
		top: 150px;
	}

	.modal-actions {
		width: 100%;
		text-align: right;;
	}

	.modal-actions button {
		background-color: transparent;
		border: none;
		font-size: 14px;
		color: rgb(100, 100, 255);
		cursor: pointer;
		margin-left: 10px;
	}

	.modal-actions button:hover {
		color: blue;
	}

	.modal-form {
		margin: 20px 0;
	}

	.modal-form > * {
		margin: 10px 0;
	}

	.modal-form input {
		width: 95%;
		padding: 10px;
		font-size: 14px;
		outline: none;
	}

	.error-message {
		color: red;
	}

	select {
		width: 100%;
		padding: 10px;
		font-size: 14px;
		outline: none;
		cursor: pointer;
	}

	.disabled {
		color: gray;
		border-color: gray;
		cursor:inherit;
	}
</style>

