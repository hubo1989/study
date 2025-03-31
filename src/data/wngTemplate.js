export const wngTemplateData = {
  tasks: [
    // 基础系统类
    {
      id: '1',
      category: '作业完成',
      name: '完成当天所有作业',
      points: 5,
      description: '当天所有作业完成，包括书面作业和其他指定学习任务',
      frequency: 'daily'
    },
    {
      id: '2',
      category: '作业完成',
      name: '自主完成作业无需督促',
      points: 10,
      description: '自觉完成当天作业，不需要家长提醒和督促',
      frequency: 'daily'
    },
    {
      id: '3',
      category: '作业质量',
      name: '认真书写，字迹工整',
      points: 5,
      description: '作业中字迹清晰，书写认真，格式正确',
      frequency: 'daily'
    },
    {
      id: '4',
      category: '专注学习',
      name: '专心学习30分钟',
      points: 5,
      description: '连续专注学习30分钟，无分心行为',
      frequency: 'daily'
    },
    {
      id: '5',
      category: '专注学习',
      name: '困难题目坚持尝试',
      points: 8,
      description: '遇到困难题目不轻易放弃，尝试独立解决',
      frequency: 'daily'
    },
    
    // 课外学习
    {
      id: '6',
      category: '课外阅读',
      name: '阅读30分钟',
      points: 5,
      description: '课外阅读30分钟，可累计计算',
      frequency: 'daily'
    },
    {
      id: '7',
      category: '课外阅读',
      name: '完成一本课外书',
      points: 20,
      description: '完成一本适合年龄的课外书的阅读',
      frequency: 'as_needed'
    },
    {
      id: '8',
      category: '额外学习',
      name: '完成额外练习题',
      points: 10,
      description: '完成非必须的额外练习题',
      frequency: 'as_needed'
    },
    
    // 体育活动
    {
      id: '9',
      category: '体育锻炼',
      name: '户外活动30分钟',
      points: 5,
      description: '户外运动或活动30分钟',
      frequency: 'daily'
    },
    
    // 行为表现
    {
      id: '10',
      category: '行为规范',
      name: '按时作息',
      points: 5,
      description: '按照规定时间起床、睡觉',
      frequency: 'daily'
    },
    {
      id: '11',
      category: '行为规范',
      name: '礼貌待人',
      points: 3,
      description: '使用礼貌用语，尊重他人',
      frequency: 'daily'
    },
    
    // 特殊成就
    {
      id: '12',
      category: '考试成绩',
      name: '考试成绩优秀',
      points: 50,
      description: '考试成绩达到优秀标准',
      frequency: 'as_needed'
    },
    {
      id: '13',
      category: '特殊项目',
      name: '参与学校活动',
      points: 15,
      description: '积极参与学校组织的各类活动',
      frequency: 'as_needed'
    },
    {
      id: '14',
      category: '创新思考',
      name: '提出创新解决方案',
      points: 20,
      description: '对问题提出有创意的解决方案',
      frequency: 'as_needed'
    }
  ],
  
  rewards: [
    // 电子设备时间
    {
      id: '1',
      category: '电子游戏',
      name: '30分钟电子游戏时间',
      cost: 50,
      description: '可以玩30分钟指定电子游戏'
    },
    {
      id: '2',
      category: '电子游戏',
      name: '60分钟电子游戏时间',
      cost: 90,
      description: '可以玩60分钟指定电子游戏'
    },
    
    // 特殊活动
    {
      id: '3',
      category: '特殊活动',
      name: '选择一部电影观看',
      cost: 100,
      description: '可以选择一部适合年龄的电影观看'
    },
    {
      id: '4',
      category: '特殊活动',
      name: '户外游乐场',
      cost: 200,
      description: '去户外游乐场玩耍'
    },
    
    // 实物奖励
    {
      id: '5',
      category: '实物奖励',
      name: '小玩具或文具',
      cost: 300,
      description: '可以获得一个小玩具或喜欢的文具'
    },
    {
      id: '6',
      category: '实物奖励',
      name: '新书一本',
      cost: 400,
      description: '可以获得一本想要的新书'
    },
    
    // 特权
    {
      id: '7',
      category: '特权',
      name: '一天免做家务',
      cost: 150,
      description: '一天内免做指定家务'
    },
    {
      id: '8',
      category: '特权',
      name: '选择周末活动',
      cost: 250,
      description: '可以选择一项周末家庭活动'
    }
  ]
}; 