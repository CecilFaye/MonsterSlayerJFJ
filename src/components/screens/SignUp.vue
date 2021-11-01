<template>
  <teleport to="body">
    <div class="modal-container-overlay" v-if="show" >
      <div class="modal-container" :style="`background-image:url(${(screenImage)});`">
        <div class="modal-form">
            <img class="imgClose" :src="`${closeIcon}`" @click="onSignUpClose">
            <br>
          <baseRowContent>
            <template v-slot:header>
              <label class="modal-label">Fullname </label>
            </template>
            <base-text-input v-model="fullName" 
              :errorStyles="errorStyles" />
          </baseRowContent>
          <baseRowContent>
            <template v-slot:header>
              <label class="modal-label">Email </label>
            </template>
            <base-text-input v-model="eMail" 
              :errorStyles="errorStyles" />
          </baseRowContent>
          <baseRowContent>
            <template v-slot:header>
              <label class="modal-label">Username </label>
            </template>
            <base-text-input v-model="UserName" 
              :errorStyles="errorStyles" />
          </baseRowContent>
          <baseRowContent>
            <template v-slot:header>
               <label class="modal-label"> Password </label>
            </template>
            <base-password-input v-model="password" type="password"
              :errorStyles="errorStyles" />
          </baseRowContent>
          <baseRowContent>
            <template v-slot:header>
               <label class="modal-label"> Character Name </label>
            </template>
            <base-text-input v-model="CharacterName"
              :errorStyles="errorStyles" />
          </baseRowContent>    
          <baseRowContent>
            <template v-slot:header>
               <label class="modal-label"> Character Class </label>
            </template>
            <base-text-input v-model="CharacterClass"
              :errorStyles="errorStyles" />
          </baseRowContent>
        </div>
        <div class="home-screen-options">
		<div class="home-screen-option" @click="changeScreen('gameScreen')">
			Sign up
		</div> 
    </div>
    <div class="home-screen-options">
      <button class="modal-signUp">Already have an account? Login here. </button>
    </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
    import { defineComponent, Prop, computed, ref } from "vue";
    import { StyleInterface } from "@/store/types";
    import { mapMutations } from "vuex";
    import baseTextInput from "../widget/BaseTextInput.vue";
    import basePasswordInput from "../widget/BasePasswordInput.vue";
    import baseRowContent from "../widget/BaseRowContent.vue"
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const home = require('../../assets/background/login-bg.png')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
	const closeIcon = require('../../assets/background/close-icon.png');

    const SingUp = defineComponent({
    props: {
    show: { 
        required: true } as Prop<boolean>
    },
	components: {
        baseTextInput,
        baseRowContent,
        basePasswordInput
        },
    emits: {
      closeSignUpModal: null
    },
    data()
    {
      return {
          screenImage: home,
          closeIcon
          }
    },
    methods: {
			...mapMutations({
				changeScreen: 'game/changeScreen'
			})
		},
    setup(props, context) {
      const onSignUpClose = () => {
        context.emit('closeSignUpModal');
    }

    const errorStyles = computed((): StyleInterface => {
      return {
        'color' : 'darkred',
        'font-size' : '12px',
        'margin-top' : '5px',
        'font-weight' : 'bold'
      }
    })

    const fullName = ref<string>(null);
    const email = ref<string>(null);
    const userName = ref<string>(null);
    const password = ref<string>(null);
    const characterName = ref<string>(null);
    const characterClass = ref<string>(null);

    return {
      onSignUpClose,
      userName,
      password,
      fullName,
      email,
      characterName,
      characterClass,
      errorStyles
    }
  }
    })

export default SingUp;
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
}
	.home-screen-options {
		cursor: pointer;
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
</style>

