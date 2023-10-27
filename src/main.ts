import { createApp } from "vue"
import "normalize.css"
import "./index.css"
import App from "./App.vue"
import {
  create,
  NButton,
  NConfigProvider,
  NInput,
  NSpace,
  NCode,
  NCard,
  NLayout,
  NLayoutContent,
} from "naive-ui"

const naive = create({
  components: [
    NButton,
    NConfigProvider,
    NSpace,
    NInput,
    NCode,
    NCard,
    NLayout,
    NLayoutContent,
  ],
})

const app = createApp(App)

app.use(naive)
app.mount("#app")
