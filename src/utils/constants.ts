export const KEY_STEP = "step"
export const KEY_FINISHED = "finished"
export const USER = "user"
export const RE = /^\$+$/gi

const MOCKS = [`学生的主要问题在于对循环结构的理解不够清晰，具体表现在以下方面：
1. 循环次数不明确：学生可能没有正确设置循环的终止条件，导致无法确定循环体执行的次数。这常见于：
- 未正确初始化循环变量
- 循环条件表达式错误
- 循环变量更新不当

2. 执行流程理解困难：学生对代码的逐行执行过程缺乏可视化认知，表现为：
- 不理解循环条件何时被评估
- 不清楚循环变量的变化规律
- 对break/continue的作用模糊

建议通过以下方法改进：
1. 用调试工具单步跟踪循环
2. 从小规模循环开始练习
3. 添加详细的打印语句

这些理解缺陷会导致程序出现逻辑错误、无限循环或意外终止，需要通过具体案例的逐行分析来建立正确的循环执行模型。`]

export const mock = MOCKS[Math.floor(Math.random() * MOCKS.length)]
