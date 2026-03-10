/**
 * 火柴人动画编辑器 - 快速动作预设定义
 * 
 * 包含所有预设动作的关节坐标配置
 * 按功能分类：手部、手臂、头部、腿部、躯干、特殊动作
 */

export const quickActions = {
  // ========== 手部基础动作 ==========
  leftHandHip: {
    leftElbow: { x: 320, y: 280 },
    leftWrist: { x: 350, y: 310 }
  },
  rightHandHip: {
    rightElbow: { x: 480, y: 280 },
    rightWrist: { x: 450, y: 310 }
  },
  raiseRightHand: {
    rightShoulder: { x: 430, y: 190 },
    rightElbow: { x: 500, y: 180 },
    rightWrist: { x: 540, y: 160 }
  },
  raiseLeftHand: {
    leftShoulder: { x: 370, y: 190 },
    leftElbow: { x: 300, y: 180 },
    leftWrist: { x: 260, y: 160 }
  },
  handsDownCircle: {
    leftShoulder: { x: 360, y: 210 },
    leftElbow: { x: 340, y: 270 },
    leftWrist: { x: 370, y: 320 },
    rightShoulder: { x: 440, y: 210 },
    rightElbow: { x: 460, y: 270 },
    rightWrist: { x: 430, y: 320 }
  },

  // ========== 手臂伸直动作 ==========
  rightArmStraight: {
    rightShoulder: { x: 430, y: 200 },
    rightElbow: { x: 520, y: 200 },
    rightWrist: { x: 580, y: 200 }
  },
  leftArmStraight: {
    leftShoulder: { x: 370, y: 200 },
    leftElbow: { x: 280, y: 200 },
    leftWrist: { x: 220, y: 200 }
  },
  leftArmHorn: {
    leftShoulder: { x: 360, y: 200 },
    leftElbow: { x: 340, y: 170 },
    leftWrist: { x: 360, y: 140 }
  },
  rightArmHorn: {
    rightShoulder: { x: 440, y: 200 },
    rightElbow: { x: 460, y: 170 },
    rightWrist: { x: 440, y: 140 }
  },

  // ========== 头部动作 ==========
  shakeHeadLeft: {
    head: { x: 370, y: 150 }
  },
  shakeHeadRight: {
    head: { x: 430, y: 150 }
  },
  headStraight: {
    head: { x: 400, y: 150 },
    neck: { x: 400, y: 180 }
  },

  // ========== 腿部动作 ==========
  feetTogether: {
    leftKnee: { x: 380, y: 400 },
    leftAnkle: { x: 380, y: 490 },
    rightKnee: { x: 420, y: 400 },
    rightAnkle: { x: 420, y: 490 }
  },
  feetApart: {
    leftKnee: { x: 350, y: 400 },
    leftAnkle: { x: 330, y: 490 },
    rightKnee: { x: 450, y: 400 },
    rightAnkle: { x: 470, y: 490 }
  },
  leftLegBend: {
    leftKnee: { x: 360, y: 420 },
    leftAnkle: { x: 380, y: 480 }
  },
  leftLegStraight: {
    leftKnee: { x: 380, y: 400 },
    leftAnkle: { x: 380, y: 490 }
  },
  rightLegBend: {
    rightKnee: { x: 440, y: 420 },
    rightAnkle: { x: 420, y: 480 }
  },
  rightLegStraight: {
    rightKnee: { x: 420, y: 400 },
    rightAnkle: { x: 420, y: 490 }
  },

  // ========== 躯干/腰部动作 ==========
  bendLeft: {
    head: { x: 360, y: 160 },
    neck: { x: 370, y: 190 },
    chest: { x: 380, y: 240 },
    leftShoulder: { x: 350, y: 210 },
    leftElbow: { x: 320, y: 260 },
    leftWrist: { x: 300, y: 300 },
    rightShoulder: { x: 400, y: 200 },
    rightElbow: { x: 430, y: 250 },
    rightWrist: { x: 450, y: 290 },
    hips: { x: 390, y: 300 }
  },
  bendRight: {
    head: { x: 440, y: 160 },
    neck: { x: 430, y: 190 },
    chest: { x: 420, y: 240 },
    leftShoulder: { x: 400, y: 200 },
    leftElbow: { x: 370, y: 250 },
    leftWrist: { x: 350, y: 290 },
    rightShoulder: { x: 450, y: 210 },
    rightElbow: { x: 480, y: 260 },
    rightWrist: { x: 500, y: 300 },
    hips: { x: 410, y: 300 }
  },
  hipsLeft: {
    hips: { x: 380, y: 300 },
    chest: { x: 410, y: 240 }
  },
  hipsRight: {
    hips: { x: 420, y: 300 },
    chest: { x: 390, y: 240 }
  },

  // ========== 特殊/复合动作 ==========
  running: {
    head: { x: 400, y: 140 },
    neck: { x: 400, y: 170 },
    chest: { x: 410, y: 220 },
    leftShoulder: { x: 380, y: 200 },
    leftElbow: { x: 350, y: 240 },
    leftWrist: { x: 330, y: 280 },
    rightShoulder: { x: 430, y: 190 },
    rightElbow: { x: 460, y: 230 },
    rightWrist: { x: 480, y: 270 },
    leftKnee: { x: 370, y: 410 },
    leftAnkle: { x: 360, y: 470 },
    rightKnee: { x: 440, y: 390 },
    rightAnkle: { x: 450, y: 450 },
    hips: { x: 400, y: 310 }
  }
};

// 动作分类定义（使用中文键名）
export const actionCategories = {
  '手部': ['leftHandHip', 'rightHandHip', 'raiseRightHand', 'raiseLeftHand', 'handsDownCircle'],
  '手臂': ['rightArmStraight', 'leftArmStraight', 'leftArmHorn', 'rightArmHorn'],
  '头部': ['shakeHeadLeft', 'shakeHeadRight', 'headStraight'],
  '腿部': ['feetTogether', 'feetApart', 'leftLegBend', 'leftLegStraight', 'rightLegBend', 'rightLegStraight'],
  '躯干': ['bendLeft', 'bendRight', 'hipsLeft', 'hipsRight'],
  '特殊': ['running']
};

// 获取动作所属分类
export const getActionCategory = (actionKey) => {
  for (let [category, actions] of Object.entries(actionCategories)) {
  if (actions.includes(actionKey)) return category;
  }
  return '手部';
};

// 动作名称映射
export const actionNames = {
  leftHandHip: '左手叉腰',
  rightHandHip: '右手叉腰',
  raiseRightHand: '抬右手',
  raiseLeftHand: '抬左手',
  handsDownCircle: '双手交叠',
  rightArmStraight: '右手伸直',
  leftArmStraight: '左手伸直',
  leftArmHorn: '左手喇叭状',
  rightArmHorn: '右手喇叭状',
  shakeHeadLeft: '向左摇头',
  shakeHeadRight: '向右摇头',
  headStraight: '头伸直（默认）',
  feetTogether: '双脚收齐',
  feetApart: '双脚打开',
  leftLegBend: '左腿弯曲',
  leftLegStraight: '左腿伸直',
  rightLegBend: '右腿弯曲',
  rightLegStraight: '右腿伸直',
  bendLeft: '向左弯腰',
  bendRight: '向右弯腰',
  hipsLeft: '胯骨左倾',
  hipsRight: '胯骨右倾',
  running: '跑步'
};

// 动作表情符号映射
export const actionEmojis = {
  leftHandHip: '🤘',
  rightHandHip: '🤘',
  raiseRightHand: '🙋',
  raiseLeftHand: '🙋',
  handsDownCircle: '💫',
  rightArmStraight: '💪',
  leftArmStraight: '💪',
  leftArmHorn: '📯',
  rightArmHorn: '📯',
  shakeHeadLeft: '😮',
  shakeHeadRight: '😮',
  headStraight: '🧍',
  feetTogether: '👣',
  feetApart: '👣',
  leftLegBend: '🦵',
  leftLegStraight: '🦵',
  rightLegBend: '🦵',
  rightLegStraight: '🦵',
  bendLeft: '🏃',
  bendRight: '🏃',
  hipsLeft: '💃',
  hipsRight: '💃',
  running: '🏃'
};

// 获取动作名称
export const getActionName = (actionKey) => {
  return actionNames[actionKey] || actionKey;
};

// 获取动作表情符号
export const getActionEmoji = (actionKey) => {
  return actionEmojis[actionKey] || '⚡';
};

export default {
  quickActions,
  actionCategories,
  getActionCategory,
  getActionName,
  getActionEmoji
};