<template>
	<teleport to="body">
		<div class="modal-container-overlay" v-if="show" >
			<div class="modal-container" :style="`background-image:url(${(screenImage)});`">
				<div class="modal-form">
					<img class="imgClose" :src="`${closeIcon}`" @click="onModalClose">
					<br>
					<baseRowContent>
						<template v-slot:header>
							<label class="modal-label">Username </label>
						</template>
						<base-text-input
							v-model="userName"
							@validationLogger="logValidationError($event, 'username')"
							:charLimit = 5
							:formInputType = "InputType.text"
							:errorLabel="'Invalid UserName'"
							:errorStyles="errorStyles"
						/>
					</baseRowContent>
					<baseRowContent>
						<template v-slot:header>
								<label class="modal-label"> Password </label>
						</template>
						<base-text-input
							v-model="password"
							@validationLogger="logValidationError($event, 'password')"
							:charLimit = 5
							:formInputType = "InputType.password"
							:errorLabel="'Invalid Password'"
							:errorStyles="errorStyles"
						/>
					</baseRowContent>
				</div>
				<div class="home-screen-options" :disabled="loginNotAllowed">
					<div class="home-screen-option" @click="login()">
						LOGIN
					</div>
				</div>
				<div class="home-screen-options">
					<button class="modal-signUp">Don't have an account? Sign up here. </button>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script lang="ts">
	import { defineComponent, Prop, computed, ref } from "vue";
	import { IAccountResponse, IValidationError, StyleInterface } from "@/store/types";
	import { useStore } from "vuex";
	import baseTextInput, { InputType } from "@/app-lib/components/BaseTextInput.vue";
	import baseRowContent from "@/app-lib/components/BaseRowContent.vue"
	import useMonsterSlayerService from "@/services/MonsterSlayerFactory.vue";
	import { useRouter } from "vue-router";

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const validations: IValidationError[] = [];

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const home = require('@/assets/background/login-bg.png')
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const closeIcon = require('@/assets/background/close-icon.png');

	const Login = defineComponent({
		props: {
		show: { required: true } as Prop<boolean>
		},
		components: {
			baseTextInput,
			baseRowContent
		},
		emits: {
			closeModal: null
		},
		data()
		{
			return {
				screenImage: home,
				closeIcon
			}
		},
		setup(props, context) {
			const service = useMonsterSlayerService();
			const router = useRouter();
			const store = useStore();
			const withErrors = ref<boolean>(false);
			const onModalClose = () => { context.emit('closeModal') };
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


			const login = () => {
				// Need to add timeout - the click event is just too fast
				setTimeout(() => {
					service.loginRequest(userName.value, password.value)
					.then((account: IAccountResponse) => {
						if (account && !!account.accountId) {
							alert('Login Success!');
							router.push(`/game/${account.accountId}`);
						} else {
							alert('Invalid Username or Password!');
						}

					})
					.catch(err => {
						alert('Login Failed!');
						console.log(err);
					});
				});
			};

			const errorStyles = computed((): StyleInterface => {
				return {
					'color' : 'darkred',
					'font-size' : '12px',
					'margin-top' : '5px',
					'font-weight' : 'bold'
				}
			});

			const loginNotAllowed = computed(() => {
				return userName.value.trim() === '' ||
				password.value.trim() === ''
			});

			const userName = ref<string>('');
			const password = ref<string>('');

			return {
				onModalClose,
				logValidationError,
				InputType,
				userName,
				password,
				login,
				errorStyles,
				loginNotAllowed
			}
		}
	})
	export default Login;
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
	margin-top: 80px;
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
	top: 200px;
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
</style>

