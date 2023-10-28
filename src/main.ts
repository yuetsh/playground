import { createApp } from "vue"
import { create } from "naive-ui"
import "normalize.css"
import Layout from "./Layout.vue"

const naive = create()

const app = createApp(Layout)
app.use(naive)
app.mount("#app")
