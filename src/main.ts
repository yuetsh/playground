import { createApp } from "vue"
import { create, NSpace } from "naive-ui"
import "normalize.css"
import App from "./App.vue"

const naive = create({
  components: [NSpace],
})

const app = createApp(App)
app.use(naive)
app.mount("#app")
