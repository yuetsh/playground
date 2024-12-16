import "animate.css"
import { create, NFlex } from "naive-ui"
import "normalize.css"
import { createApp } from "vue"
import App from "./App.vue"

const naive = create({
  components: [NFlex],
})

const app = createApp(App)
app.use(naive)
app.mount("#app")
