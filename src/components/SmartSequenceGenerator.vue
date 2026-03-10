<template>
  <div class="smart-sequence-generator">
    <h3 class="sequence-title">🎬 智能动作序列生成器</h3>
    
    <div class="generator-content">
      <div class="selector-section">
        <label class="selector-label">选择关键动作（按顺序点击）：</label>
        
        <!-- 动作分类标签 -->
        <div class="action-categories">
          <button 
            :class="['category-btn', { active: filter === '全部' }]"
            @click="$emit('update:filter', '全部')"
          >
            全部
          </button>
          <button 
            :class="['category-btn', { active: filter === '手部' }]"
            @click="$emit('update:filter', '手部')"
          >
            👋 手部
          </button>
          <button 
            :class="['category-btn', { active: filter === '手臂' }]"
            @click="$emit('update:filter', '手臂')"
          >
            💪 手臂
          </button>
          <button 
            :class="['category-btn', { active: filter === '头部' }]"
            @click="$emit('update:filter', '头部')"
          >
            😮 头部
          </button>
          <button 
            :class="['category-btn', { active: filter === '腿部' }]"
            @click="$emit('update:filter', '腿部')"
          >
            🦵 腿部
          </button>
          <button 
            :class="['category-btn', { active: filter === '躯干' }]"
            @click="$emit('update:filter', '躯干')"
          >
            💃 躯干
          </button>
          <button 
            :class="['category-btn', { active: filter === '特殊' }]"
            @click="$emit('update:filter', '特殊')"
          >
            🏃 特殊
          </button>
        </div>
        
        <div class="action-selector-buttons">
          <button 
            v-for="(action, key) in filteredActions" 
            :key="key"
            @click="$emit('add-to-sequence', key)"
            class="sequence-action-btn"
          >
            {{ getEmoji(key) }} {{ getName(key) }}
          </button>
        </div>
        
        <div class="combo-controls">
          <button @click="$emit('lock-frame')" class="lock-frame-btn" :disabled="sequenceLength === 0">
            🔒 锁定当前帧（下一个动作将创建新帧）
          </button>
          <button @click="$emit('undo')" class="undo-btn" :disabled="sequenceLength === 0">
            ↩️ 撤销上一步
          </button>
        </div>
        
        <div class="combo-hint">
          💡 <strong>组合技巧：</strong><br>
          • 连续点击的动作会自动组合到同一帧<br>
          • 点击"🔒 锁定当前帧"后，下一个动作会创建新关键帧<br>
          • 例如：点击"双脚分开" → "抬右手" = 组合姿势
        </div>
      </div>
      
      <div class="preview-section">
        <label class="selector-label">已选动作序列：</label>
        
        <div class="sequence-list" v-if="groupedSequence.length > 0">
          <div 
            v-for="(group, groupIndex) in groupedSequence" 
            :key="groupIndex"
            class="frame-group"
          >
            <div class="frame-group-header">
              <span class="group-number">关键帧 {{ groupIndex + 1 }}</span>
              <button @click="$emit('remove-frame', groupIndex)" class="remove-group-btn">
                🗑️
              </button>
            </div>
            
            <div class="frame-actions">
              <div 
                v-for="(actionKey, actionIndex) in group" 
                :key="actionIndex"
                class="action-in-frame"
              >
                <span class="action-dot">●</span>
                <span class="action-name">{{ getName(actionKey) }}</span>
                <button 
                  @click="$emit('remove-action', { groupIndex, actionIndex })" 
                  class="remove-action-btn"
                  title="删除此动作"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="empty-sequence" v-else>
          <p>还没有选择动作</p>
          <p style="font-size:12px; color: #666; margin-top: 8px;">
            点击左侧的动作按钮添加到序列
          </p>
        </div>
        
        <div class="settings-section">
          <div class="setting-item">
            <label class="setting-label">拍数：</label>
            <select v-model="beats" class="setting-select">
              <option value="2">2 拍（2 秒）</option>
              <option value="4" selected>4 拍（4 秒）⭐</option>
              <option value="8">8 拍（8 秒）</option>
              <option value="16">16 拍（16 秒）</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">过渡方式：</label>
            <select v-model="transition" class="setting-select">
              <option value="smooth" selected>平滑过渡 ⭐</option>
              <option value="linear">线性插值</option>
              <option value="ease">缓入缓出</option>
            </select>
          </div>
          
          <div class="generate-buttons">
            <button @click="$emit('generate')" class="generate-btn" :disabled="groupedSequence.length < 2">
              ✨ 生成 {{ beats }}拍动画
            </button>
            <button @click="$emit('clear')" class="clear-btn">
              🗑️ 清空
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  actionCategories, 
  getActionName, 
  getActionEmoji,
  quickActions 
} from '@/utils/quickActions';

const props = defineProps({
  filter: {
  type: String,
   default: '全部'
  },
  sequence: {
  type: Array,
   default: () => []
  },
  beats: {
  type: Number,
   default: 4
  },
  transition: {
  type: String,
   default: 'smooth'
  }
});

const emit = defineEmits([
  'update:filter',
  'add-to-sequence',
  'lock-frame',
  'undo',
  'remove-action',
  'remove-frame',
  'generate',
  'clear'
]);

// 计算属性：筛选后的动作
const filteredActions = computed(() => {
  if (props.filter === '全部') {
  return quickActions;
  }
  
  const filtered = {};
  const categoryActions = actionCategories[props.filter] || [];
  
  for (let key of categoryActions) {
  if (quickActions[key]) {
    filtered[key] = quickActions[key];
    }
  }
  
  return filtered;
});

// 分组显示序列
const groupedSequence = computed(() => {
  const groups = [];
  let currentGroup = [];
  
  props.sequence.forEach((item) => {
  if (item.isMarker) return; // 跳过虚拟标记
    
  if (item.isNewFrame || currentGroup.length === 0) {
    if (currentGroup.length > 0) {
       groups.push(currentGroup);
     }
     currentGroup = [item.actionKey];
    } else {
     currentGroup.push(item.actionKey);
    }
  });
  
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  
  return groups;
});

const sequenceLength = computed(() => props.sequence.length);

// 辅助函数
const getName = (actionKey) => getActionName(actionKey);
const getEmoji = (actionKey) => getActionEmoji(actionKey);
</script>

<style scoped>
/* 样式将在后续添加 */
</style>