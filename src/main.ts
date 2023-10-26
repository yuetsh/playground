import { createApp } from "vue"
import "normalize.css"
import App from "./App.vue"
import {
  create,
  NButton,
  NConfigProvider,
  NInput,
  NSpace,
  NCode,
} from "naive-ui"

const naive = create({
  components: [NButton, NConfigProvider, NSpace, NInput, NCode],
})

const app = createApp(App)

app.use(naive)
app.mount("#app")
