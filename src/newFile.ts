import { watchEffect } from "vue";
import { storage } from "./utils/storage";
import lessons from "./data/python.json";
import { KEY, step, lesson, status } from "./App.vue";

watchEffect(() => {
const cached = storage.get<Step>(KEY) || { last: 0, current: 0 };
step.current = cached.current;
step.last = cached.last;

lesson.title = lessons[step.current].title;
lesson.content = lessons[step.current].content;

status.success = step.current < step.last;
});
