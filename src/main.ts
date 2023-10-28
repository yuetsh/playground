import { createApp } from "vue"
import {
  create,
  NButton,
  NInput,
  NSpace,
  NCode,
  NCard,
  NIcon,
  NDropdown,
  NConfigProvider,
  NLayout,
  NLayoutContent,
} from "naive-ui"
import "normalize.css"
import App from "./App.vue"

const naive = create({
  components: [
    NButton,
    NInput,
    NSpace,
    NCode,
    NCard,
    NIcon,
    NDropdown,
    NConfigProvider,
    NLayout,
    NLayoutContent,
  ],
})

const app = createApp(App)
app.use(naive)
app.mount("#app")
