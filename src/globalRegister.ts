/* eslint-disable @typescript-eslint/no-explicit-any */
import { App } from "vue"
import BaseRowContent from "@/app-lib/components/BaseRowContent.vue"
import BaseTextInput from "@/app-lib/components/BaseTextInput.vue"

export const registerComponents = (app: App): void => {
	app.component('base-row-content', BaseRowContent);
	app.component('base-text-input', BaseTextInput);
}
