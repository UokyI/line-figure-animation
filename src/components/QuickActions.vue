<template>
  <div class="quick-actions">
    <h3 class="quick-actions-title">⚡ 快速动作</h3>
    
    <!-- 第一排：手部基础动作 -->
    <div class="action-buttons">
      <button @click="applyAction('leftHandHip')" class="action-btn">
        🤘 左手叉腰
      </button>
      <button @click="applyAction('rightHandHip')" class="action-btn">
        🤘 右手叉腰
      </button>
      <button @click="applyAction('raiseRightHand')" class="action-btn">
        🙋 抬右手
      </button>
      <button @click="applyAction('raiseLeftHand')" class="action-btn">
        🙋 抬左手
      </button>
    </div>
    
    <!-- 第二排：手臂伸直动作 -->
    <div class="action-buttons" style="margin-top: 12px;">
      <button @click="applyAction('rightArmStraight')" class="action-btn">
        💪 右手伸直
      </button>
      <button @click="applyAction('leftArmStraight')" class="action-btn">
        💪 左手伸直
      </button>
      <button @click="applyAction('shakeHeadLeft')" class="action-btn">
        😮 向左摇头
      </button>
      <button @click="applyAction('shakeHeadRight')" class="action-btn">
        😮 向右摇头
      </button>
    </div>
    
    <!-- 第三排：腿部和舞蹈动作 -->
    <div class="action-buttons" style="margin-top: 12px;">
      <button @click="applyAction('feetTogether')" class="action-btn">
        👣 双脚收齐
      </button>
      <button @click="applyAction('feetApart')" class="action-btn">
        👣 双脚打开
      </button>
      <button @click="applyAction('bendLeft')" class="action-btn">
        🏃 向左弯腰
      </button>
      <button @click="applyAction('bendRight')" class="action-btn">
        🏃 向右弯腰
      </button>
      <button @click="applyAction('handsDownCircle')" class="action-btn">
        💫 双手交叠
      </button>
    </div>
    
    <!-- 第四排：新增腿部动作 -->
    <div class="action-buttons" style="margin-top: 12px;">
      <button @click="applyAction('headStraight')" class="action-btn">
        🧍 头伸直（默认）
      </button>
      <button @click="applyAction('leftLegBend')" class="action-btn">
        🦵 左腿弯曲
      </button>
      <button @click="applyAction('leftLegStraight')" class="action-btn">
        🦵 左腿伸直
      </button>
      <button @click="applyAction('rightLegBend')" class="action-btn">
        🦵 右腿弯曲
      </button>
      <button @click="applyAction('rightLegStraight')" class="action-btn">
        🦵 右腿伸直
      </button>
    </div>
    
    <!-- 第五排：跑步和特殊姿势 -->
    <div class="action-buttons" style="margin-top: 12px;">
      <button @click="applyAction('running')" class="action-btn">
        🏃 跑步
      </button>
      <button @click="applyAction('leftArmHorn')" class="action-btn">
        📯 左手喇叭状
      </button>
      <button @click="applyAction('rightArmHorn')" class="action-btn">
        📯 右手喇叭状
      </button>
      <button @click="applyAction('hipsLeft')" class="action-btn">
        💃 胯骨左倾
      </button>
      <button @click="applyAction('hipsRight')" class="action-btn">
        💃 胯骨右倾
      </button>
    </div>
  </div>
</template>

<script setup>
import { quickActions } from '@/utils/quickActions';

// 定义事件
const emit = defineEmits(['apply-action']);

// 应用快速动作
const applyAction = (actionKey) => {
  const action= quickActions[actionKey];
  if (action) {
   emit('apply-action', actionKey, action);
  }
};
</script>

<style scoped>
.quick-actions {
  margin-bottom: 20px;
}

.quick-actions-title {
  font-size:16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border:none;
  border-radius: 6px;
  font-size:13px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-btn:active {
  transform: translateY(0);
}
</style>