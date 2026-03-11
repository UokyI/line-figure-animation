<template>
  <div class="app">
    <h1>线条小人动画制作器</h1>
    
    <div class="controls">
      <div class="control-group">
        <label>拍子数：</label>
        <select v-model="beats">
          <option value="4">4 拍</option>
          <option value="8">8 拍</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>帧率 (FPS)：</label>
        <input type="number" v-model.number="fps" min="1" max="60" />
      </div>
      
      <div class="control-group">
        <label>当前帧：</label>
        <span>{{ currentFrame + 1 }} / {{ totalFrames }}</span>
      </div>
      
      <div class="control-group">
        <label>显示网格：</label>
        <input type="checkbox" v-model="showGrid" />
      </div>
    </div>

    <div class="canvas-container">
      <canvas 
        ref="canvas" 
        width="800" 
        height="600"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      ></canvas>
    </div>

    <div class="timeline-controls">
      <button @click="firstFrame">|&lt;</button>
      <button @click="prevFrame">&lt;</button>
      <button @click="playAnimation" :disabled="isPlaying">{{ isPlaying ? '播放中...' : '播放' }}</button>
      <button @click="nextFrame">&gt;</button>
      <button @click="lastFrame">&gt;|</button>
      <button @click="addFrame">+ 添加帧</button>
      <button @click="deleteFrame" :disabled="frames.length <= 1">- 删除帧</button>
      <button @click="copyFrame">📋 复制帧</button>
      <button @click="pasteFrame" :disabled="!copiedFrame">📋 粘贴帧</button>
      <button @click="resetPose">🔄 重置姿势</button>
      <button @click="refreshThumbnails">🔃 刷新缩略图</button>
      <button @click="mirrorCurrentFrame" class="mirror-btn">⇆ 镜像</button>
    </div>

    <!-- 快速动作列表 -->
    <div class="quick-actions">
      <h3 class="quick-actions-title">⚡ 快速动作</h3>
      
      <!-- 第一排：手部基础动作 -->
      <div class="action-buttons">
        <button @click="applyQuickAction('leftHandHip')" class="action-btn">
          🤘 左手叉腰
        </button>
        <button @click="applyQuickAction('rightHandHip')" class="action-btn">
          🤘 右手叉腰
        </button>
        <button @click="applyQuickAction('raiseRightHand')" class="action-btn">
          🙋 抬右手
        </button>
        <button @click="applyQuickAction('raiseLeftHand')" class="action-btn">
          🙋 抬左手
        </button>
      </div>
      
      <!-- 第二排：手臂伸直动作 -->
      <div class="action-buttons" style="margin-top: 12px;">
        <button @click="applyQuickAction('rightArmStraight')" class="action-btn">
          💪 右手伸直
        </button>
        <button @click="applyQuickAction('leftArmStraight')" class="action-btn">
          💪 左手伸直
        </button>
        <button @click="applyQuickAction('shakeHeadLeft')" class="action-btn">
          😮 向左摇头
        </button>
        <button @click="applyQuickAction('shakeHeadRight')" class="action-btn">
          😮 向右摇头
        </button>
      </div>
      
      <!-- 第三排：腿部和舞蹈动作 -->
      <div class="action-buttons" style="margin-top: 12px;">
        <button @click="applyQuickAction('feetTogether')" class="action-btn">
          👣 双脚收齐
        </button>
        <button @click="applyQuickAction('feetApart')" class="action-btn">
          👣 双脚打开
        </button>
        <button @click="applyQuickAction('bendLeft')" class="action-btn">
          🏃 向左弯腰
        </button>
        <button @click="applyQuickAction('bendRight')" class="action-btn">
          🏃 向右弯腰
        </button>
        <button @click="applyQuickAction('handsDownCircle')" class="action-btn">
          💫 双手交叠
        </button>
      </div>
      
      <!-- 第四排：新增腿部动作 -->
      <div class="action-buttons" style="margin-top: 12px;">
        <button @click="applyQuickAction('headStraight')" class="action-btn">
          🧍 头伸直（默认）
        </button>
        <button @click="applyQuickAction('leftLegBend')" class="action-btn">
          🦵 左腿弯曲
        </button>
        <button @click="applyQuickAction('leftLegStraight')" class="action-btn">
          🦵 左腿伸直
        </button>
        <button @click="applyQuickAction('rightLegBend')" class="action-btn">
          🦵 右腿弯曲
        </button>
        <button @click="applyQuickAction('rightLegStraight')" class="action-btn">
          🦵 右腿伸直
        </button>
      </div>
      
      <!-- 第五排：跑步和特殊姿势 -->
      <div class="action-buttons" style="margin-top: 12px;">
        <button @click="applyQuickAction('running')" class="action-btn">
          🏃 跑步
        </button>
        <button @click="applyQuickAction('leftArmHorn')" class="action-btn">
          📯 左手喇叭状
        </button>
        <button @click="applyQuickAction('rightArmHorn')" class="action-btn">
          📯 右手喇叭状
        </button>
        <button @click="applyQuickAction('hipsLeft')" class="action-btn">
          💃 胯骨左倾
        </button>
        <button @click="applyQuickAction('hipsRight')" class="action-btn">
          💃 胯骨右倾
        </button>
      </div>

      <!-- 第六排：新增双手交叉覆盖动作 -->
      <div class="action-buttons" style="margin-top: 12px;">
        <button @click="applyQuickAction('handsCrossLeftOver')" class="action-btn">
          🫴 左手覆盖右手
        </button>
        <button @click="applyQuickAction('handsCrossRightOver')" class="action-btn">
          🫴 右手覆盖左手
        </button>
      </div>

      <!-- 自定义快速动作按钮 -->
      <div class="action-buttons" style="margin-top: 12px;">
        <button @click="showCustomActionModal = true" class="action-btn" style="background: linear-gradient(135deg, #ff8a8a 0%, #ff5252 100%);">
          ✨ 保存当前为自定义动作 (Ctrl+B)
        </button>
        <button @click="exportCustomActions" class="action-btn" style="background: linear-gradient(135deg, #a55eea 0%, #764ba2 100%);">
          📁 导出自定义动作
        </button>
        <button @click="triggerImport" class="action-btn" style="background: linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%);">
          📥 导入自定义动作
        </button>
      </div>

      <!-- 显示自定义动作 -->
      <div v-if="Object.keys(customActions).length > 0" class="action-buttons" style="margin-top: 12px; flex-wrap: wrap;">
        <button 
          v-for="(action, name) in customActions" 
          :key="name"
          @click="applyQuickAction(name)"
          class="action-btn"
          style="background: linear-gradient(135deg, #ffa8a8 0%, #ffd8d8 100%); position: relative;"
        >
          🛠️ {{ name }}
          <span 
            @click.stop="deleteCustomAction(name)" 
            style="position: absolute; top: -5px; right: -5px; background: #dc3545; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
            title="删除此自定义动作"
          >
            ×
          </span>
        </button>
      </div>
    </div>

    <!-- 自定义动作模态框 -->
    <div v-if="showCustomActionModal" class="modal-overlay" @click="showCustomActionModal = false">
      <div class="modal-content" @click.stop style="width: 400px; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
        <h3 style="margin: 0 0 20px 0; color: #333; text-align: center;">✨ 保存自定义动作</h3>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">动作名称：</label>
          <input 
            v-model="customActionName" 
            placeholder="例如：我的招牌动作" 
            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px;"
          />
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button 
            @click="showCustomActionModal = false" 
            style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
          >
            取消
          </button>
          <button 
            @click="saveCustomAction" 
            style="padding: 12px 24px; background: linear-gradient(135deg, #28a745 0%, #20c997 100); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
          >
            保存动作
          </button>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入用于导入 -->
    <input 
      type="file" 
      ref="importFileInput" 
      @change="importCustomActions" 
      accept=".json" 
      style="display: none;" 
    />

    <!-- 智能动作序列生成器 -->
    <div class="smart-sequence-generator">
      <h3 class="sequence-title">🎬 智能动作序列生成器</h3>

      <div class="generator-content">
        <div class="selector-section">
          <label class="selector-label">选择关键动作（按顺序点击）：</label>

          <!-- 动作分类标签 -->
          <div class="action-categories">
            <button
              :class="['category-btn', { active: categoryFilter === '全部' }]"
              @click="categoryFilter= '全部'"
            >
              全部
            </button>
            <button
              :class="['category-btn', { active: categoryFilter === '手部' }]"
              @click="categoryFilter= '手部'"
            >
              👋 手部
            </button>
            <button
              :class="['category-btn', { active: categoryFilter === '手臂' }]"
              @click="categoryFilter= '手臂'"
            >
              💪 手臂
            </button>
            <button
              :class="['category-btn', { active: categoryFilter === '头部' }]"
              @click="categoryFilter= '头部'"
            >
              😮 头部
            </button>
            <button
              :class="['category-btn', { active: categoryFilter === '腿部' }]"
              @click="categoryFilter= '腿部'"
            >
              🦵 腿部
            </button>
            <button
              :class="['category-btn', { active: categoryFilter === '躯干' }]"
              @click="categoryFilter= '躯干'"
            >
              💃 躯干
            </button>
            <button
              :class="['category-btn', { active: categoryFilter === '特殊' }]"
              @click="categoryFilter= '特殊'"
            >
              🏃 特殊
            </button>
          </div>

          <div class="action-selector-buttons">
            <button
              v-for="(action, key) in filteredQuickActions"
              :key="key"
              @click="addToSequence(key)"
              class="sequence-action-btn"
              :class="{ selected: sequence.some(s => s.actionKey === key) }"
            title="点击添加到序列"
            >
              {{ getActionEmoji(key) }} {{ getActionName(key) }}
            </button>
          </div>

          <div class="combo-controls">
            <button @click="lockCurrentFrame" class="lock-frame-btn" :disabled="sequence.length === 0">
              🔒 锁定当前帧（下一个动作将创建新帧）
            </button>
            <button @click="clearLastAction" class="undo-btn" :disabled="sequence.length === 0">
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

        <div class="sequence-preview">
          <div class="sequence-list">
            <div v-if="sequence.length === 0" class="empty-sequence">
              👆 请点击上方按钮选择动作
            </div>

            <!-- 显示关键帧组 -->
            <div
              v-for="(frameGroup, groupIndex) in groupedSequence"
              :key="groupIndex"
              class="frame-group"
            >
              <div class="frame-group-header">
                <span class="group-number">关键帧 {{ groupIndex + 1 }}</span>
                <button @click="removeFrameGroup(groupIndex)" class="remove-group-btn">
                  🗑️ 删除此帧
                </button>
              </div>

              <div class="frame-actions">
                <div class="actions-column">
                  <div
                    v-for="(actionKey, actionIndex) in frameGroup"
                    :key="actionIndex"
                    class="action-in-frame"
                  >
                    <span class="action-dot">●</span>
                    <span class="action-name">{{ getActionName(actionKey) }}</span>
                    <button @click="removeActionFromFrame(groupIndex, actionIndex)" class="remove-action-btn">×</button>
                  </div>
                </div>
                
                <!-- 关键帧动作预览 -->
                <div class="preview-column">
                  <FramePreview 
                    :frame-group="frameGroup"
                    :quick-actions="quickActions"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="sequence-controls">
            <div class="control-row">
              <label>拍数：</label>
              <select v-model.number="targetBeats" class="beats-select">
                <option value="2">2 拍</option>
                <option value="4" selected>4 拍</option>
                <option value="8">8 拍</option>
                <option value="16">16 拍</option>
              </select>
              <span class="info-text">（每拍 1 秒，共{{ targetBeats }}秒）</span>
            </div>

            <div class="control-row">
              <label>过渡方式：</label>
              <select v-model="transitionType" class="transition-select">
                <option value="smooth">平滑过渡</option>
                <option value="linear">线性插值</option>
                <option value="ease">缓入缓出</option>
              </select>
            </div>

            <div class="button-row">
              <button @click="generateSequence" class="generate-btn" :disabled="sequence.length < 1">
                ✨ 生成{{ targetBeats }}拍动画
              </button>
              <button @click="clearSequence" class="clear-btn">
                🗑️ 清空序列
              </button>
            </div>

            <div class="advanced-tips">
              <p><strong>💡 使用技巧：</strong></p>
              <ul>
                <li>点击同一个动作多次可以<strong>保持该动作不变</strong></li>
                <li>为关键帧添加多个动作可创建<strong>组合姿势</strong></li>
                <li>例如：先选"双脚分开"，再选"抬右手" = 双脚分开 + 抬右手</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="frames-timeline">
      <div 
        v-for="(frame, index) in frames" 
        :key="index"
        class="frame-thumbnail"
        :class="{ active: index === currentFrame }"
        @click="goToFrame(index)"
      >
        <canvas 
          :ref="el => setThumbnailRef(el, index)"
          width="80" 
          height="60"
        ></canvas>
        <span class="frame-number">{{ index + 1 }}</span>
      </div>
    </div>

    <div class="export-controls">
      <div v-if="!ffmpegLoaded && !webCodecsSupported" class="ffmpeg-status">
        <div>⚠️ FFmpeg 加载中...（首次使用需要时间）</div>
        <div class="ffmpeg-tips">
          <p>💡 提示：</p>
          <ul>
            <li>首次使用需要下载约 25MB 的核心文件</li>
            <li>下载完成后会自动缓存到浏览器</li>
            <li>下次使用时无需重复下载</li>
            <li>如长时间未加载成功，可点击下面按钮重试</li>
          </ul>
        </div>
        <button @click="retryLoadFFmpeg" class="retry-btn">🔄 重试加载 FFmpeg</button>
      </div>
      
      <!-- FFmpeg 已加载 -->
      <div v-if="ffmpegLoaded" class="cache-status">
        <span class="cache-ok">✅ FFmpeg 已缓存（本地）</span>
        <button @click="clearCacheAndReload" class="clear-cache-btn" title="清除缓存并重新下载">🗑️ 清除缓存</button>
      </div>
      
      <div class="export-buttons">
        <button 
          @click="exportVideoWithFFmpeg" 
          :disabled="isExporting || !ffmpegLoaded"
          class="export-ffmpeg-btn"
        >
          {{ isExporting ? '导出中...' : '导出 MP4 (FFmpeg)' }}
        </button>
        
        <button 
          @click="exportVideoWithWebCodecs" 
          :disabled="isExporting || !webCodecsSupported"
          class="export-webcodecs-btn"
          v-if="webCodecsSupported"
        >
          {{ isExporting ? '导出中...' : '导出 MP4 (快速)' }} ⚡
        </button>
      </div>
    </div>

    <div v-if="isExporting" class="progress">
      <p>导出进度：{{ exportProgress }}%</p>
    </div>

    <div class="instructions">
      <h3>💡 使用说明：</h3>
      <ul>
        <li><strong>拖动关节</strong>：鼠标点击并拖动小人上的红色圆点（关节）来调整姿势</li>
        <li><strong>头部关节</strong>：控制头部位置</li>
        <li><strong>身体关节</strong>：控制肩膀、手肘、手腕、臀部、膝盖、脚踝</li>
        <li><strong>添加帧</strong>：调整姿势后点击"+ 添加帧"创建新帧，然后继续调整</li>
        <li><strong>播放</strong>：预览动画效果</li>
        <li><strong>导出</strong>：生成 MP4 视频文件</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch, watchEffect } from 'vue';
import FramePreview from './components/FramePreview.vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const canvas = ref(null);
const ctx = ref(null);
const beats = ref(4);
const fps = ref(12);
const currentFrame = ref(0);
const isPlaying = ref(false);
const isExporting = ref(false);
const exportProgress = ref(0);
const ffmpegLoaded = ref(false);
const webCodecsSupported = ref('VideoEncoder' in window);
const frames = ref([]);
const thumbnailCanvases = ref([]);
const copiedFrame = ref(null);
const showGrid = ref(true);

const selectedJoint = ref(null);
const hoverJoint = ref(null);

// 计算总帧数
const totalFrames = computed(() => frames.value.length);

const defaultPose = {
  head: { x: 400, y: 150 },
  neck: { x: 400, y: 190 },
  chest: { x: 400, y: 240 },
  leftShoulder: { x: 370, y: 200 },
  leftElbow: { x: 340, y: 250 },
  leftWrist: { x: 320, y: 290 },
  rightShoulder: { x: 430, y: 200 },
  rightElbow: { x: 460, y: 250 },
  rightWrist: { x: 480, y: 290 },
  hips: { x: 400, y: 300 },
  leftHip: { x: 380, y: 310 },
  leftKnee: { x: 370, y: 400 },
  leftAnkle: { x: 365, y: 490 },
  rightHip: { x: 420, y: 310 },
  rightKnee: { x: 430, y: 400 },
  rightAnkle: { x: 435, y: 490 }
};

// 预设快速动作配置
const quickActions = {
  // 左手叉腰
  leftHandHip: {
  leftElbow: { x: 320, y: 280 },
  leftWrist: { x: 350, y: 310 }
  },
  // 右手叉腰
  rightHandHip: {
   rightElbow: { x: 480, y: 280 },
   rightWrist: { x: 450, y: 310 }
  },
  // 抬右手
  raiseRightHand: {
   rightShoulder: { x: 430, y: 190 },
   rightElbow: { x: 500, y: 180 },
   rightWrist: { x: 540, y: 160 }
  },
  // 抬左手
  raiseLeftHand: {
  leftShoulder: { x: 370, y: 190 },
  leftElbow: { x: 300, y: 180 },
  leftWrist: { x: 260, y: 160 }
  },
  // 右手伸直（向右平举）
  rightArmStraight: {
   rightShoulder: { x: 430, y: 200 },
   rightElbow: { x: 520, y: 200 },
   rightWrist: { x: 580, y: 200 }
  },
  // 左手伸直（向左平举）
  leftArmStraight: {
  leftShoulder: { x: 370, y: 200 },
  leftElbow: { x: 280, y: 200 },
  leftWrist: { x: 220, y: 200 }
  },
  // 向左摇头（头部转向左侧）
  shakeHeadLeft: {
   head: { x: 370, y: 150 }
  },
  // 向右摇头（头部转向右侧）
  shakeHeadRight: {
   head: { x: 430, y: 150 }
  },
  // 双脚收齐（双腿平行对齐）
  feetTogether: {
  leftKnee: { x: 380, y: 400 },
  leftAnkle: { x: 380, y: 490 },
   rightKnee: { x: 420, y: 400 },
   rightAnkle: { x: 420, y: 490 }
  },
  // 双脚打开
  feetApart: {
  leftKnee: { x: 350, y: 400 },
  leftAnkle: { x: 330, y: 490 },
   rightKnee: { x: 450, y: 400 },
   rightAnkle: { x: 470, y: 490 }
  },
  // 向左弯腰（身体向右弯曲）
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
  // 向右弯腰（身体向左弯曲）
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
  // 双手向下呈圆形交叠（芭蕾舞姿势）
  handsDownCircle: {
  leftShoulder: { x: 360, y: 210 },
  leftElbow: { x: 340, y: 270 },
  leftWrist: { x: 370, y: 320 },
   rightShoulder: { x: 440, y: 210 },
   rightElbow: { x: 460, y: 270 },
   rightWrist: { x: 430, y: 320 }
  },
  // ========== 新增动作 ==========
  // 头伸直（默认正常状态）
  headStraight: {
   head: { x: 400, y: 150 },
   neck: { x: 400, y: 180 }
  },
  // 左腿弯曲
  leftLegBend: {
  leftKnee: { x: 360, y: 420 },
  leftAnkle: { x: 380, y: 480 }
  },
  // 左腿伸直
  leftLegStraight: {
  leftKnee: { x: 380, y: 400 },
  leftAnkle: { x: 380, y: 490 }
  },
  // 右腿弯曲
  rightLegBend: {
   rightKnee: { x: 440, y: 420 },
   rightAnkle: { x: 420, y: 480 }
  },
  // 右腿伸直
  rightLegStraight: {
   rightKnee: { x: 420, y: 400 },
   rightAnkle: { x: 420, y: 490 }
  },
  // 跑步姿势
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
  },
  // 左手臂向上向内呈半圆状（喇叭状）
  leftArmHorn: {
  leftShoulder: { x: 360, y: 200 },
  leftElbow: { x: 340, y: 170 },
  leftWrist: { x: 360, y: 140 }
  },
  // 右手臂向上向内呈半圆状（喇叭状）
  rightArmHorn: {
   rightShoulder: { x: 440, y: 200 },
   rightElbow: { x: 460, y: 170 },
   rightWrist: { x: 440, y: 140 }
  },
  // 胯骨左倾
  hipsLeft: {
   hips: { x: 380, y: 300 },
   chest: { x: 410, y: 240 }
  },
  // 胯骨右倾
  hipsRight: {
   hips: { x: 420, y: 300 },
   chest: { x: 390, y: 240 }
  },
  // 左手覆盖右手
  handsCrossLeftOver: {
    leftShoulder: { x: 360, y: 210 },  // 左肩保持原位
    leftElbow: { x: 340, y: 270 },    // 左肘保持原位
    leftWrist: { x: 430, y: 320 },    // 左腕移到右腕位置（覆盖）
    rightShoulder: { x: 440, y: 210 }, // 右肩保持原位
    rightElbow: { x: 460, y: 270 },   // 右肘保持原位
    rightWrist: { x: 430, y: 320 }    // 右腕保持原位
  },
  // 右手覆盖左手
  handsCrossRightOver: {
    leftShoulder: { x: 360, y: 210 },  // 左肩保持原位
    leftElbow: { x: 340, y: 270 },    // 左肘保持原位
    leftWrist: { x: 370, y: 320 },    // 左腕保持原位
    rightShoulder: { x: 440, y: 210 }, // 右肩保持原位
    rightElbow: { x: 460, y: 270 },   // 右肘保持原位
    rightWrist: { x: 370, y: 320 }    // 右腕移到左腕位置（覆盖）
  }
};

const jointRadius = 10;
const grabDistance = 20;

const ffmpeg = new FFmpeg();

// 本地存储 FFmpeg 核心文件的路径
const LOCAL_FFMPEG_PATH = '/ffmpeg/';
const FFMPEG_CORE_VERSION = '0.12.6';

// 检查本地是否已缓存 FFmpeg 文件
const checkLocalFFmpeg = async () => {
  try {
   const response = await fetch(`${LOCAL_FFMPEG_PATH}ffmpeg-core.js`);
    if (!response.ok) throw new Error('本地 FFmpeg 文件不存在');
    return true;
  } catch (error) {
   console.log('本地 FFmpeg 文件不存在，需要从 CDN 下载');
    return false;
  }
};

// 从 CDN 下载 FFmpeg 核心文件到本地
const downloadFFmpegCore = async () => {
  const cdnSources = [
    'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm',
    'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm'
  ];
  
  for (const baseURL of cdnSources) {
    try {
     console.log(`尝试从 ${baseURL} 下载 FFmpeg 核心文件...`);
      
      // 下载 JS 文件
     const jsResponse = await fetch(`${baseURL}/ffmpeg-core.js`);
     const jsText = await jsResponse.text();
      
      // 下载 WASM 文件（作为 ArrayBuffer）
     const wasmResponse = await fetch(`${baseURL}/ffmpeg-core.wasm`);
     const wasmBuffer = await wasmResponse.arrayBuffer();
      
      // 保存到 public/ffmpeg 目录（需要在构建时处理）
      // 这里我们使用 IndexedDB 来缓存这些文件
      await cacheToIndexedDB('ffmpeg-core.js', jsText);
      await cacheToIndexedDB('ffmpeg-core.wasm', wasmBuffer);
      
     console.log('✅ FFmpeg 核心文件已缓存到 IndexedDB');
      return true;
    } catch (error) {
     console.warn(`从 ${baseURL} 下载失败:`, error.message);
     continue;
    }
  }
  
  throw new Error('所有 CDN 源都下载失败');
};

// 使用 IndexedDB 缓存文件
const cacheToIndexedDB = async (filename, data) => {
  return new Promise((resolve, reject) => {
   const request = indexedDB.open('FFmpegCache', 1);
    
    request.onupgradeneeded = (event) => {
     const db = event.target.result;
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'name' });
      }
    };
    
    request.onsuccess = (event) => {
     const db = event.target.result;
     const transaction = db.transaction(['files'], 'readwrite');
     const store = transaction.objectStore('files');
      
     const putRequest = store.put({ name: filename, data: data });
      
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    
    request.onerror = (event) => reject(request.error);
  });
};

// 从 IndexedDB 读取缓存的文件
const readFromIndexedDB = async (filename) => {
  return new Promise((resolve, reject) => {
   const request = indexedDB.open('FFmpegCache', 1);
    
    request.onupgradeneeded = (event) => {
     const db = event.target.result;
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'name' });
      }
    };
    
    request.onsuccess = (event) => {
     const db = event.target.result;
     const transaction = db.transaction(['files'], 'readonly');
     const store = transaction.objectStore('files');
      
     const getRequest = store.get(filename);
      
      getRequest.onsuccess = () => resolve(getRequest.result?.data);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = (event) => reject(request.error);
  });
};

// 从本地缓存加载 FFmpeg
const loadFFmpegFromCache = async () => {
  try {
   const jsData = await readFromIndexedDB('ffmpeg-core.js');
   const wasmData = await readFromIndexedDB('ffmpeg-core.wasm');
    
    if (!jsData || !wasmData) {
     throw new Error('缓存中未找到 FFmpeg 文件');
    }
    
    // 将 JS 代码转换为 Blob URL
   const jsBlob = new Blob([jsData], { type: 'text/javascript' });
   const jsBlobURL = URL.createObjectURL(jsBlob);
    
    // 将 WASM 数据转换为 Blob URL
   const wasmBlob = new Blob([wasmData], { type: 'application/wasm' });
   const wasmBlobURL = URL.createObjectURL(wasmBlob);
    
    await ffmpeg.load({
     coreURL: jsBlobURL,
      wasmURL: wasmBlobURL
    });
    
   console.log('✅ 从本地缓存加载 FFmpeg 成功！');
    return true;
  } catch (error) {
   console.log('从本地缓存加载失败:', error.message);
    return false;
  }
};

const loadFFmpeg = async () => {
  try {
    // 首先尝试从本地缓存加载
  console.log('🔄 尝试从本地缓存加载 FFmpeg...');
  const loadedFromCache = await loadFFmpegFromCache();
    
   if (loadedFromCache) {
    ffmpegLoaded.value = true;
     return;
    }
    
    // 缓存未命中，需要从 CDN 下载
  console.log('📥 缓存未命中，开始下载 FFmpeg 核心文件...');
    
    // 优先使用国内可访问的 CDN 源
  const cdnSources = [
      // 国内 CDN（优先级高）
      'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm',
      'https://cdnjs.cloudflare.com/ajax/libs/ffmpeg-core/0.12.6',
      'https://unpkg.zhimg.com/@ffmpeg/core@0.12.6/dist/esm', // 知乎镜像
      
      // 国际 CDN（备用）
      'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm',
      'https://cdn.statically.io/npm/@ffmpeg/core@0.12.6/dist/esm' // Statically CDN
    ];
    
  for (const baseURL of cdnSources) {
      try {
      console.log(`尝试从 ${baseURL} 加载 FFmpeg...`);
        
       await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        });
        
      ffmpegLoaded.value = true;
      console.log(`✅ FFmpeg 加载成功！CDN 源：${baseURL}`);
        break;
      } catch (error) {
      console.warn(`从 ${baseURL} 加载失败：`, error.message);
      continue;
      }
    }
    
   if (!ffmpegLoaded.value) {
     throw new Error('所有 CDN 源都加载失败');
    }
  } catch (error) {
  console.error('❌ FFmpeg 加载失败:', error);
  ffmpegLoaded.value = false;
    alert('FFmpeg 加载失败，请检查网络连接。\n\n提示：\n1. 首次使用需要下载约 25MB 的核心文件\n2. 下载完成后会自动缓存到浏览器\n3. 下次使用时无需重复下载\n4. 如果持续失败，请尝试刷新页面或使用代理');
  }
};

onMounted(() => {
  ctx.value = canvas.value.getContext('2d');
  addFrame();
  loadFFmpeg();
  setTimeout(() => updateAllThumbnails(), 100);
});

watch(frames, () => {
  nextTick(() => {
   setTimeout(() => updateAllThumbnails(), 50);
  });
}, { deep: true });

// 监听当前帧变化，更新实时预览
watch(currentFrame, () => {
  nextTick(() => {
    setTimeout(() => updateRealtimePreview(), 10);
  });
});

const createDefaultPose = () => JSON.parse(JSON.stringify(defaultPose));

const setThumbnailRef = (el, index) => {
  if (el) {
   thumbnailCanvases.value[index] = el;
   setTimeout(() => updateThumbnail(index), 50);
  }
};


const updateThumbnail = (index) => {
  if (!thumbnailCanvases.value[index]) return;
  
  const thumbCanvas = thumbnailCanvases.value[index];
  const thumbCtx = thumbCanvas.getContext('2d');
  
  thumbCtx.fillStyle = '#ffffff';
  thumbCtx.fillRect(0, 0, thumbCanvas.width, thumbCanvas.height);
  
  if (frames.value[index] && frames.value[index].pose) {
   const pose = frames.value[index].pose;
   const scaleX = thumbCanvas.width / 800;
   const scaleY = thumbCanvas.height / 600;
   const scale = Math.min(scaleX, scaleY);
   drawStickman(thumbCtx, pose, { scale, jointRadius: 8 });
  }
};

const updateAllThumbnails = () => {
  frames.value.forEach((_, index) => {
   setTimeout(() => updateThumbnail(index), 50 * index);
  });
};

const getMousePos = (e) => {
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

const findNearestJoint = (pos) => {
  const pose = frames.value[currentFrame.value]?.pose;
  if (!pose) return null;
  
  let nearest = null;
  let minDistance = grabDistance;
  
  for (let jointId in pose) {
   const joint = pose[jointId];
   const dx = pos.x - joint.x;
   const dy = pos.y - joint.y;
   const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = jointId;
    }
  }
  
  return nearest;
};

const onMouseDown = (e) => {
  const pos = getMousePos(e);
  const joint = findNearestJoint(pos);
  if (joint) selectedJoint.value = joint;
};

const onMouseMove = (e) => {
  const pos = getMousePos(e);
  
  if (selectedJoint.value) {
   const pose = frames.value[currentFrame.value].pose;
    pose[selectedJoint.value].x = pos.x;
    pose[selectedJoint.value].y = pos.y;
   draw();
   updateThumbnail(currentFrame.value);
  } else {
    hoverJoint.value = findNearestJoint(pos);
   draw();
  }
};

const onMouseUp = () => {
  selectedJoint.value = null;
};

const drawStickman = (context, pose, options = {}) => {
  const { scale = 1, offsetX = 0, offsetY = 0, drawJoints = true, jointRadius = 10, isPreview = false } = options;

  // 对于预览模式，使用固定的线条宽度和关节点大小
  if (isPreview) {
    context.strokeStyle = '#333';
    context.lineWidth = 1; // 固定线条宽度
    context.lineCap = 'round';
    context.lineJoin = 'round';

    const bones = [
      ['head', 'neck'], ['neck', 'chest'], ['neck', 'leftShoulder'], ['neck', 'rightShoulder'],
      ['chest', 'hips'], ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['hips', 'leftHip'], ['hips', 'rightHip'],
      ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle']
    ];

    bones.forEach(([joint1, joint2]) => {
      if (pose[joint1] && pose[joint2]) {
       context.beginPath();
       context.moveTo(pose[joint1].x * scale + offsetX, pose[joint1].y * scale + offsetY);
       context.lineTo(pose[joint2].x * scale + offsetX, pose[joint2].y * scale + offsetY);
       context.stroke();
      }
    });

    if (pose.head) {
     context.fillStyle = '#fff';
     context.strokeStyle = '#333';
     context.lineWidth = 1; // 固定线条宽度
     context.beginPath();
     context.arc(pose.head.x * scale + offsetX, pose.head.y * scale + offsetY, 3, 0, Math.PI * 2); // 固定头部大小
     context.fill();
     context.stroke();
    }

    if (drawJoints) {
     for (let jointId in pose) {
       const joint = pose[jointId];
       context.fillStyle = '#ffffff';
       context.strokeStyle = '#333';
       context.lineWidth = 1; // 固定线条宽度
       context.beginPath();
       context.arc(joint.x * scale + offsetX, joint.y * scale + offsetY, 2, 0, Math.PI * 2); // 固定关节点大小
       context.fill();
       context.stroke();
      }
    }
  } else {
    // 原有的非预览模式绘制逻辑
    context.strokeStyle = '#333';
    context.lineWidth = Math.max(2, 4 * scale);
    context.lineCap = 'round';
    context.lineJoin = 'round';

    const bones = [
      ['head', 'neck'], ['neck', 'chest'], ['neck', 'leftShoulder'], ['neck', 'rightShoulder'],
      ['chest', 'hips'], ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['hips', 'leftHip'], ['hips', 'rightHip'],
      ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle']
    ];

    bones.forEach(([joint1, joint2]) => {
      if (pose[joint1] && pose[joint2]) {
       context.beginPath();
       context.moveTo(pose[joint1].x * scale + offsetX, pose[joint1].y * scale + offsetY);
       context.lineTo(pose[joint2].x * scale + offsetX, pose[joint2].y * scale + offsetY);
       context.stroke();
      }
    });

    if (pose.head) {
     context.fillStyle = '#fff';
     context.strokeStyle = '#333';
     context.lineWidth = Math.max(2, 3 * scale);
     context.beginPath();
     context.arc(pose.head.x * scale + offsetX, pose.head.y * scale + offsetY, 25 * scale, 0, Math.PI * 2);
     context.fill();
     context.stroke();
    }

    if (drawJoints) {
     for (let jointId in pose) {
       const joint = pose[jointId];
       context.fillStyle = '#ffffff';
       context.strokeStyle = '#333';
       context.lineWidth = Math.max(1, 2 * scale);
       context.beginPath();
       context.arc(joint.x * scale + offsetX, joint.y * scale + offsetY, jointRadius * scale, 0, Math.PI * 2);
       context.fill();
       context.stroke();
      }
    }
  }
};

const drawGrid = () => {
  if (!showGrid.value) return;
  ctx.value.strokeStyle = '#e0e0e0';
  ctx.value.lineWidth = 1;
  for (let x = 0; x < canvas.value.width; x += 50) {
   ctx.value.beginPath();
   ctx.value.moveTo(x, 0);
   ctx.value.lineTo(x, canvas.value.height);
   ctx.value.stroke();
  }
  for (let y = 0; y < canvas.value.height; y += 50) {
   ctx.value.beginPath();
   ctx.value.moveTo(0, y);
   ctx.value.lineTo(canvas.value.width, y);
   ctx.value.stroke();
  }
};

const draw = () => {
  ctx.value.fillStyle = '#ffffff';
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
  drawGrid();
  const pose = frames.value[currentFrame.value]?.pose;
  if (pose) {
   drawStickman(ctx.value, pose, { scale: 1, jointRadius: 10, drawJoints: true });
  }
};

const addFrame = () => {
  const newFrame = {
    pose: frames.value.length === 0 ? createDefaultPose() : JSON.parse(JSON.stringify(frames.value[frames.value.length - 1].pose))
  };
  frames.value.push(newFrame);
  currentFrame.value = frames.value.length - 1;
  draw();
  nextTick(() => {
   setTimeout(() => {
     updateThumbnail(currentFrame.value);
     updateAllThumbnails();
    }, 100);
  });
};

const deleteFrame = () => {
  if (frames.value.length > 1) {
    frames.value.splice(currentFrame.value, 1);
    if (currentFrame.value >= frames.value.length) currentFrame.value = frames.value.length - 1;
    goToFrame(currentFrame.value);
  }
};

const copyFrame = () => {
  copiedFrame.value = JSON.parse(JSON.stringify(frames.value[currentFrame.value]));
};

const pasteFrame = () => {
  if (copiedFrame.value) {
    frames.value[currentFrame.value] = JSON.parse(JSON.stringify(copiedFrame.value));
   draw();
   updateThumbnail(currentFrame.value);
  }
};

const resetPose = () => {
  frames.value[currentFrame.value].pose = createDefaultPose();
  draw();
  updateThumbnail(currentFrame.value);
};

// 应用快速动作
const applyQuickAction= (actionName) => {
  const action = quickActions[actionName];
  if (!action) {
  console.error('未找到动作:', actionName);
   return;
  }
  
  // 获取当前帧的姿势
  const currentPose = frames.value[currentFrame.value].pose;
  
  // 应用动作配置，只修改相关关节
  for (let jointId in action) {
  if (currentPose[jointId]) {
     currentPose[jointId].x = action[jointId].x;
     currentPose[jointId].y = action[jointId].y;
    }
  }
  
  // 重绘主画布
  draw();
  
  // 更新当前帧缩略图
  updateThumbnail(currentFrame.value);
  
  console.log(`✅ 应用快速动作：${actionName}`);
};

// ========== 智能动作序列生成器 ==========

// 动作序列状态 - 支持组合动作
const sequence = ref([]); // 数组元素：{ actionKey, category, isNewFrame }
const targetBeats = ref(4);
const transitionType = ref('smooth');
const categoryFilter= ref('全部');

// 监听序列变化，更新预览 - 现在由FramePreview组件自行处理
watch(sequence, async () => {
  // 序列变化时，FramePreview组件会自动更新
}, { deep: true });

// 从 quickActions.js 导入分类定义
import { actionCategories, getActionCategory } from '@/utils/quickActions';

// 根据分类筛选动作
const filteredQuickActions = computed(() => {
  if (categoryFilter.value === '全部') {
  return quickActions;
  }
  
  const filtered = {};
  const categoryActions = actionCategories[categoryFilter.value] || [];
  
  for (let key of categoryActions) {
  if (quickActions[key]) {
    filtered[key] = quickActions[key];
    }
  }
  
  return filtered;
});

// 将序列分组显示（同一帧的多个动作放在一起）
const groupedSequence = computed(() => {
  const groups = [];
  let currentGroup = [];

  sequence.value.forEach((item) => {
    // 跳过虚拟标记（不显示）
   if (item.isMarker) return;

    // 如果是新帧标记或者第一个元素
   if (item.isNewFrame || currentGroup.length === 0) {
     if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [item.actionKey];
    } else {
      // 否则加入当前组
      currentGroup.push(item.actionKey);
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
});


// 添加到序列 - 默认不创建新帧（实现组合）
const addToSequence = (actionKey) => {
  // 检查是否存在虚拟标记（用户点击了"锁定"）
  const hasMarker= sequence.value.some(item => item.isMarker);
  
  // 只有在两种情况下创建新帧：
  // 1. 序列为空（第一个动作）
  // 2. 有虚拟标记（用户明确点击了"锁定当前帧"）
  const shouldCreateNewFrame = sequence.value.length === 0 || hasMarker;
  
  sequence.value.push({ 
    actionKey, 
    category: getActionCategory(actionKey), 
    isNewFrame: shouldCreateNewFrame 
  });
  
  console.log(`✅ 已添加动作到序列：${getActionName(actionKey)} ${shouldCreateNewFrame ? '(新帧)' : '(组合)'}`);
  
  // 如果刚才有虚拟标记并且已经创建了新帧，清除所有标记（因为它们已经完成了使命）
  if (hasMarker && shouldCreateNewFrame) {
   // 过滤掉所有虚拟标记
   sequence.value = sequence.value.filter(item => !item.isMarker);
  console.log('🗑️ 已清除帧边界标记');
  }
};

// 从序列移除单个动作（按扁平索引）
const removeFromSequence = (index) => {
  sequence.value.splice(index, 1);
};

// 从帧中移除某个动作
const removeActionFromFrame = (groupIndex, actionIndex) => {
  let flatIndex = 0;
  for (let i = 0; i <= groupIndex; i++) {
  const groupSize = groupedSequence.value[i].length;
  if (i === groupIndex) {
     sequence.value.splice(flatIndex + actionIndex, 1);
   return;
    }
   flatIndex += groupSize;
  }
};

// 删除整个帧组
const removeFrameGroup = (groupIndex) => {
  let flatIndex = 0;
  for (let i = 0; i < groupIndex; i++) {
   flatIndex += groupedSequence.value[i].length;
  }
  const groupSize = groupedSequence.value[groupIndex].length;
  sequence.value.splice(flatIndex, groupSize);
};

// 清空序列
const clearSequence = () => {
  sequence.value = [];
};

// 锁定当前帧（下一个动作将创建新关键帧）
const lockCurrentFrame = () => {
  if (sequence.value.length === 0) return;
  
  // 添加一个虚拟的帧边界标记（不是真实动作）
  sequence.value.push({ 
    actionKey: null, 
    category: null, 
    isNewFrame: true,
    isMarker: true  // 标记这是一个虚拟的帧边界标记
  });
  
  console.log('🔒 已锁定当前帧，下一个动作将创建新关键帧');
};

// 清除最后一个动作
const clearLastAction = () => {
  if (sequence.value.length === 0) return;
  
  const lastItem = sequence.value[sequence.value.length - 1];
  
  // 如果最后一个是虚拟标记，也一并删除
  if (lastItem.isMarker) {
    console.log('🗑️ 删除帧边界标记');
  } else {
    console.log(`↩️ 已撤销动作：${getActionName(lastItem.actionKey)}`);
  }
  
  sequence.value.pop();
};

// 获取动作名称
const getActionName = (actionKey) => {
  const names = {
    leftHandHip: '左手叉腰',
    rightHandHip: '右手叉腰',
    raiseRightHand: '抬右手',
    raiseLeftHand: '抬左手',
    rightArmStraight: '右手伸直',
    leftArmStraight: '左手伸直',
    shakeHeadLeft: '向左摇头',
    shakeHeadRight: '向右摇头',
    feetTogether: '双脚收齐',
    feetApart: '双脚打开',
    bendLeft: '向左弯腰',
    bendRight: '向右弯腰',
    handsDownCircle: '双手交叠',
    // 新增动作
    headStraight: '头伸直（默认）',
    leftLegBend: '左腿弯曲',
    leftLegStraight: '左腿伸直',
    rightLegBend: '右腿弯曲',
    rightLegStraight: '右腿伸直',
    running: '跑步',
    leftArmHorn: '左手喇叭状',
    rightArmHorn: '右手喇叭状',
    hipsLeft: '胯骨左倾',
    hipsRight: '胯骨右倾',
    handsCrossLeftOver: '左手覆盖右手',
    handsCrossRightOver: '右手覆盖左手'
  };
  return names[actionKey] || actionKey;
};

// 获取动作表情符号
const getActionEmoji = (actionKey) => {
  const emojis = {
    leftHandHip: '🤘',
    rightHandHip: '🤘',
    raiseRightHand: '🙋',
    raiseLeftHand: '🙋',
    rightArmStraight: '💪',
    leftArmStraight: '💪',
    shakeHeadLeft: '😮',
    shakeHeadRight: '😮',
    feetTogether: '👣',
    feetApart: '👣',
    bendLeft: '🏃',
    bendRight: '🏃',
    handsDownCircle: '💫',
    // 新增动作
    headStraight: '🧍',
    leftLegBend: '🦵',
    leftLegStraight: '🦵',
    rightLegBend: '🦵',
    rightLegStraight: '🦵',
    running: '🏃',
    leftArmHorn: '📯',
    rightArmHorn: '📯',
    hipsLeft: '💃',
    hipsRight: '💃',
    handsCrossLeftOver: '🫴',
    handsCrossRightOver: '🫴'
  };
  return emojis[actionKey] || '⚡';
};

// 自定义快速动作功能
const customActions = ref({});
const customActionName = ref('');
const showCustomActionModal = ref(false);

// 加载自定义动作
const loadCustomActions = () => {
  const saved = localStorage.getItem('customActions');
  if (saved) {
    customActions.value = JSON.parse(saved);
  }
};

// 保存自定义动作
const saveCustomAction = () => {
  if (!customActionName.value.trim()) {
    alert('请输入自定义动作名称');
    return;
  }
  
  // 获取当前姿势作为动作
  const currentPose = { ...frames.value[currentFrame.value]?.pose };
  if (!currentPose) {
    alert('当前帧没有有效姿势');
    return;
  }
  
  // 创建动作对象（只包含与默认姿势不同的关节）
  const defaultPose = createDefaultPose();
  const action = {};
  
  for (let jointId in currentPose) {
    if (defaultPose[jointId] && 
        (Math.abs(currentPose[jointId].x - defaultPose[jointId].x) > 0.1 || 
         Math.abs(currentPose[jointId].y - defaultPose[jointId].y) > 0.1)) {
      action[jointId] = { ...currentPose[jointId] };
    }
  }
  
  // 保存自定义动作
  customActions.value[customActionName.value.trim()] = action;
  localStorage.setItem('customActions', JSON.stringify(customActions.value));
  
  // 添加到quickActions中
  quickActions[customActionName.value.trim()] = action;
  
  alert(`自定义动作 "${customActionName.value.trim()}" 已保存`);
  customActionName.value = '';
  showCustomActionModal.value = false;
};

// 导出自定义动作
const exportCustomActions = () => {
  const dataStr = JSON.stringify(customActions.value, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportLink = document.createElement('a');
  exportLink.setAttribute('href', dataUri);
  exportLink.setAttribute('download', 'custom-actions.json');
  document.body.appendChild(exportLink);
  exportLink.click();
  document.body.removeChild(exportLink);
};

// 导入自定义动作
const importCustomActions = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedActions = JSON.parse(e.target.result);
      
      // 合并导入的动作
      Object.assign(customActions.value, importedActions);
      Object.assign(quickActions, importedActions);
      
      // 保存到本地存储
      localStorage.setItem('customActions', JSON.stringify(customActions.value));
      
      alert(`成功导入 ${Object.keys(importedActions).length} 个自定义动作`);
      
      // 清空文件输入
      event.target.value = '';
    } catch (error) {
      alert('导入失败：文件格式不正确');
      console.error(error);
    }
  };
  reader.readAsText(file);
};

// 删除自定义动作
const deleteCustomAction = (name) => {
  if (confirm(`确定要删除自定义动作 "${name}" 吗？`)) {
    // 从自定义动作中删除
    delete customActions.value[name];
    
    // 从quickActions中删除
    delete quickActions[name];
    
    // 保存到本地存储
    localStorage.setItem('customActions', JSON.stringify(customActions.value));
    
    alert(`自定义动作 "${name}" 已删除`);
  }
};

// 初始化时加载自定义动作
loadCustomActions();

// 键盘快捷键处理
const handleKeyDown = (event) => {
  // Ctrl+B - 显示保存自定义动作模态框
  if (event.ctrlKey && event.key.toLowerCase() === 'b') {
    event.preventDefault();
    showCustomActionModal.value = true;
  }
  
  // Ctrl+Q - 保存自定义动作（如果模态框已打开且有名称）
  if (event.ctrlKey && event.key.toLowerCase() === 'q') {
    event.preventDefault();
    if (showCustomActionModal.value && customActionName.value.trim()) {
      saveCustomAction();
    }
  }
  
  // ESC - 关闭模态框
  if (event.key === 'Escape') {
    showCustomActionModal.value = false;
  }
};

// 监听键盘事件
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// 触发文件导入
const triggerImport = () => {
  // 使用原生DOM操作触发文件输入
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.click();
  }
};

// 重新绘制当前帧
const redrawCurrentFrame = () => {
  if (ctx.value) {
    // 清除画布
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    
    // 绘制网格
    drawGrid();
    
    // 绘制当前帧
    const currentPose = frames.value[currentFrame.value]?.pose;
    if (currentPose) {
      drawStickman(ctx.value, currentPose, { scale: 1, jointRadius: 5 });
    }
  }
};

// 一键镜像功能 - 水平翻转当前帧的姿势
const mirrorCurrentFrame = () => {
  const currentPose = frames.value[currentFrame.value]?.pose;
  if (!currentPose) return;

  // 创建镜像后的姿势
  const mirroredPose = {};
  
  // 定义需要镜像的关节对
  const jointPairs = [
    ['leftShoulder', 'rightShoulder'],
    ['leftElbow', 'rightElbow'],
    ['leftWrist', 'rightWrist'],
    ['leftHip', 'rightHip'],
    ['leftKnee', 'rightKnee'],
    ['leftAnkle', 'rightAnkle'],
    ['leftHand', 'rightHand'],
    ['leftFoot', 'rightFoot']
  ];
  
  // 复制原始姿势
  for (let jointId in currentPose) {
    mirroredPose[jointId] = { ...currentPose[jointId] };
  }
  
  // 应用镜像变换 - 水平翻转
  const centerX = 200; // 假设中心线在x=200处（可根据实际画布调整）
  
  // 首先计算所有关节的平均x坐标作为参考中心
  let sumX = 0;
  let count = 0;
  for (let jointId in currentPose) {
    sumX += currentPose[jointId].x;
    count++;
  }
  const actualCenterX = count > 0 ? sumX / count : centerX;
  
  // 交换左右对称关节的位置（如果它们存在）
  for (const [leftJoint, rightJoint] of jointPairs) {
    if (mirroredPose[leftJoint] && mirroredPose[rightJoint]) {
      // 交换左右关节的位置
      const temp = { ...mirroredPose[leftJoint] };
      mirroredPose[leftJoint] = { ...mirroredPose[rightJoint] };
      mirroredPose[rightJoint] = temp;
    }
  }
  
  // 对所有关节进行水平镜像（包括交换后的关节）
  for (let jointId in mirroredPose) {
    // 计算相对于中心的偏移量，然后取反
    const offset = mirroredPose[jointId].x - actualCenterX;
    mirroredPose[jointId].x = actualCenterX - offset;
  }
  
  // 更新当前帧的姿势
  frames.value[currentFrame.value].pose = mirroredPose;
  
  // 重新绘制画布
  nextTick(() => {
    redrawCurrentFrame();
  });
  
  // 刷新缩略图
  refreshThumbnails();
};

// 生成动作序列 - 支持组合动作
const generateSequence = async () => {
  if (groupedSequence.value.length < 2) {
   alert('请至少选择 2 个关键帧来生成动画');
   return;
  }

  const totalFrames = targetBeats.value * fps.value; // 总帧数 = 拍数 × FPS

  console.log(`开始生成 ${targetBeats.value}拍动画，共${totalFrames}帧，关键帧数：${groupedSequence.value.length}`);

  // 保存原始帧数据
  const originalFrames = JSON.parse(JSON.stringify(frames.value));
  const originalCurrentFrame = currentFrame.value;

  // 清除所有帧，从默认姿势开始
  frames.value = [];
  
  try {
   // 计算总的过渡段数（关键帧数-1）
   const totalTransitions = groupedSequence.value.length - 1;
   // 计算每两个关键帧之间的过渡帧数
   const transitionFramesPerSegment = Math.max(1, Math.floor((totalFrames - groupedSequence.value.length) / totalTransitions));
   
   // 预计算所有关键帧的目标姿势
   const keyframePoses = [];
   for (let i = 0; i < groupedSequence.value.length; i++) {
     const frameGroup = groupedSequence.value[i];
     const targetPose = createDefaultPose();
     frameGroup.forEach(actionKey => {
       const action = quickActions[actionKey];
       applyQuickActionToPose(targetPose, action);
     });
     keyframePoses.push(targetPose);
   }
   
   // 从默认姿势开始
   let currentPose = createDefaultPose();
   
   // 为每个关键帧生成过渡
   for (let i = 0; i < groupedSequence.value.length; i++) {
     const targetPose = keyframePoses[i];
     
     if (i === 0) {
       // 第一个关键帧：从默认姿势过渡到第一个关键帧姿势
       for (let j = 0; j <= transitionFramesPerSegment; j++) {
         const progress = j / transitionFramesPerSegment;
         const easedProgress = easeFunction(progress, transitionType.value);
         
         const newPose = interpolatePose(currentPose, targetPose, easedProgress);
         frames.value.push({ pose: newPose });
         
         const newFrameIndex = frames.value.length - 1;
         await nextTick();
         updateThumbnail(newFrameIndex);
       }
     } else {
       // 后续关键帧：从前一个关键帧过渡到当前关键帧
       for (let j = 1; j <= transitionFramesPerSegment; j++) {
         const progress = j / transitionFramesPerSegment;
         const easedProgress = easeFunction(progress, transitionType.value);
         
         const newPose = interpolatePose(currentPose, targetPose, easedProgress);
         frames.value.push({ pose: newPose });
         
         const newFrameIndex = frames.value.length - 1;
         await nextTick();
         updateThumbnail(newFrameIndex);
       }
     }
     
     // 更新当前姿势为当前关键帧的姿势
     currentPose = { ...targetPose };

     // 更新进度提示
     console.log(`✅ 完成关键帧 ${i + 1}/${groupedSequence.value.length}: ${groupedSequence.value[i].map(k => getActionName(k)).join(' + ')}`);
   }

   // 确保总帧数正确 - 用最后一个关键帧的姿势填充剩余帧
   const lastPose = { ...keyframePoses[keyframePoses.length - 1] };
   while (frames.value.length < totalFrames) {
     frames.value.push({ pose: { ...lastPose } });
     const newFrameIndex = frames.value.length - 1;
     await nextTick();
     updateThumbnail(newFrameIndex);
   }

   // 跳转到第一帧
   currentFrame.value = 0;
   draw();

   alert(`✨ 成功生成 ${targetBeats.value}拍动画！共${frames.value.length}帧\n每秒${fps.value}帧，总时长${targetBeats.value}秒`);

  } catch (error) {
   console.error('生成序列失败:', error);
   alert('生成序列时出错，请重试');

   // 恢复原始数据
   frames.value = originalFrames;
   currentFrame.value = originalCurrentFrame;
   draw();
  }
};

// 应用快速动作到指定姿势（不改变当前画布）
const applyQuickActionToPose = (pose, action) => {
  for (let jointId in action) {
  if (pose[jointId]) {
     pose[jointId].x = action[jointId].x;
     pose[jointId].y = action[jointId].y;
    }
  }
};

// 姿势插值函数（支持从一个姿势到另一个姿势）
const interpolatePose = (fromPose, toPose, progress) => {
  const newPose = {};
  
  // 复制起始姿势的所有关节
  for (let jointId in fromPose) {
   newPose[jointId] = { ...fromPose[jointId] };
  }
  
  // 对目标姿势中的关节进行插值
  for (let jointId in toPose) {
  if (newPose[jointId]) {
   const fromJoint = fromPose[jointId];
   const toJoint = toPose[jointId];
     
     newPose[jointId].x = fromJoint.x + (toJoint.x - fromJoint.x) * progress;
     newPose[jointId].y = fromJoint.y + (toJoint.y - fromJoint.y) * progress;
    }
  }
  
  return newPose;
};

// 缓动函数
const easeFunction= (t, type) => {
  switch(type) {
   case 'linear':
     return t;
   case 'ease':
     // 缓入缓出（ease-in-out）
     return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
   case 'smooth':
   default:
     // 平滑过渡（使用余弦插值）
     return (1 - Math.cos(t * Math.PI)) / 2;
  }
};

const goToFrame = (index) => {
  currentFrame.value = index;
  draw();
};

const nextFrame = () => {
  if (currentFrame.value < frames.value.length - 1) goToFrame(currentFrame.value + 1);
};

const prevFrame = () => {
  if (currentFrame.value > 0) goToFrame(currentFrame.value - 1);
};

const firstFrame = () => goToFrame(0);
const lastFrame = () => goToFrame(frames.value.length - 1);

const playAnimation = () => {
  if (isPlaying.value) return;
  isPlaying.value = true;
  let frameIndex = 0;
  const interval = 1000 / fps.value;
  const animate = () => {
    if (!isPlaying.value) return;
    goToFrame(frameIndex);
    frameIndex = (frameIndex + 1) % frames.value.length;
   setTimeout(() => {
      if (isPlaying.value) requestAnimationFrame(animate);
    }, interval);
  };
  animate();
  setTimeout(() => { isPlaying.value = false; }, 5000);
};

const exportVideoWithFFmpeg = async () => {
  if (isExporting.value) return;
  if (!ffmpegLoaded.value) {
    alert('FFmpeg 还未加载完成，请稍候再试！');
   return;
  }
  
  isExporting.value = true;
  exportProgress.value = 0;
  
  try {
  const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 800;
    tempCanvas.height = 600;
  const tempCtx = tempCanvas.getContext('2d');
    
  for (let i = 0; i < frames.value.length; i++) {
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    drawStickman(tempCtx, frames.value[i].pose, { scale: 1, jointRadius: 10, drawJoints: true });
      
    const data = tempCanvas.toDataURL('image/png');
    const base64Data = data.split(',')[1];
     await ffmpeg.writeFile(`frame${i.toString().padStart(4, '0')}.png`, Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)));
      exportProgress.value = Math.round(((i + 1) / frames.value.length) * 50);
     await new Promise(resolve => setTimeout(resolve, 100));
    }
    
   await ffmpeg.exec([
      '-framerate', fps.value.toString(),
      '-i', 'frame%04d.png',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-movflags', '+faststart',
      'output.mp4'
    ]);
    
    exportProgress.value = 90;
  const outputData = await ffmpeg.readFile('output.mp4');
  const blob = outputData.buffer ? new Blob([outputData.buffer], { type: 'video/mp4' }) : new Blob([outputData], { type: 'video/mp4' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
    a.href = url;
    a.download = `animation_${new Date().getTime()}.mp4`;
    a.click();
    URL.revokeObjectURL(url);
    exportProgress.value = 100;
    
  for (let i = 0; i < frames.value.length; i++) {
      try { await ffmpeg.deleteFile(`frame${i.toString().padStart(4, '0')}.png`); } catch (e) {}
    }
    try { await ffmpeg.deleteFile('output.mp4'); } catch (e) {}
  } catch (error) {
  console.error('导出失败:', error);
    alert('导出失败：' + error.message);
  } finally {
    isExporting.value = false;
  setTimeout(() => { exportProgress.value = 0; }, 3000);
  }
};

// 使用 WebCodecs API 快速导出（现代浏览器）
const exportVideoWithWebCodecs = async () => {
  if (isExporting.value) return;
  if (!webCodecsSupported.value) {
    alert('您的浏览器不支持 WebCodecs API，请使用 Chrome 94+、Edge 94+ 或其他现代浏览器');
   return;
  }
  
  isExporting.value = true;
  exportProgress.value = 0;
  
  try {
   // 检查 VideoEncoder 支持
   if (!('VideoEncoder' in window)) {
     throw new Error('浏览器不支持 VideoEncoder');
    }
    
  const width = 800;
  const height = 600;
  const frameRate = fps.value;
    
   // 创建输出文件
  const mp4Writer = new MP4Writer();
  await mp4Writer.init(width, height, frameRate);
    
   // 编码所有帧
  const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
    
  for (let i = 0; i < frames.value.length; i++) {
     // 绘制当前帧
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, width, height);
    drawStickman(tempCtx, frames.value[i].pose, { scale: 1, jointRadius:10, drawJoints: true });
      
     // 转换为 VideoFrame
    const videoFrame = new VideoFrame(tempCanvas, {
       timestamp: (i / frameRate) * 1e6 // 微秒
     });
      
    await mp4Writer.encode(videoFrame);
     videoFrame.close();
      
     exportProgress.value = Math.round(((i + 1) / frames.value.length) * 100);
    }
    
   // 完成编码并下载
  const blob = await mp4Writer.finish();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
    a.href = url;
   a.download = `animation_webcodecs_${new Date().getTime()}.mp4`;
    a.click();
    URL.revokeObjectURL(url);
    
  console.log('✅ WebCodecs 导出成功！');
  } catch (error) {
  console.error('WebCodecs 导出失败:', error);
    alert('WebCodecs 导出失败：' + error.message + '\n\n请尝试使用 FFmpeg 方式导出');
  } finally {
    isExporting.value = false;
  setTimeout(() => { exportProgress.value = 0; }, 3000);
  }
};

// MP4 写入器（简化版）
class MP4Writer {
  constructor() {
   this.chunks = [];
   this.frames = [];
   this.width = 0;
   this.height = 0;
   this.frameRate = 0;
  }
  
  async init(width, height, frameRate) {
   this.width = width;
   this.height = height;
   this.frameRate = frameRate;
    
   // 初始化编码器配置
  const config = {
    codec: 'avc1.42001F', // H.264 Baseline Profile
     width: width,
     height: height,
     bitrate: 2_000_000, // 2 Mbps
     framerate: frameRate
   };
    
   this.config = config;
  }
  
  async encode(frame) {
   // 简单存储帧数据（实际项目中应使用完整的 MP4 封装库）
  const imageData = frame.timestamp;
   this.frames.push({
     timestamp: frame.timestamp,
     duration: (1 / this.frameRate) * 1e6
   });
  }
  
  async finish() {
   // 注意：这是一个简化版本
   // 完整的 MP4 封装非常复杂，建议使用现成的库
   // 这里返回一个提示，说明需要使用完整实现
   
   // 临时方案：使用 Canvas 录制
  return await this.recordCanvas();
  }
  
  async recordCanvas() {
   // 使用 MediaRecorder API 作为备选方案
  const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.width;
    tempCanvas.height = this.height;
  const ctx = tempCanvas.getContext('2d');
  const stream = tempCanvas.captureStream(this.frameRate);
  const recorder= new MediaRecorder(stream, {
     mimeType: 'video/webm;codecs=vp9',
     videoBitsPerSecond: 2_000_000
   });
    
  const chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);
    
  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
     const blob = new Blob(chunks, { type: 'video/webm' });
     resolve(blob);
    };
     
    recorder.onerror = reject;
    recorder.start();
      
     // 快速播放所有帧
    let frameIndex = 0;
    const interval = 1000 / this.frameRate;
     
    const drawFrame = () => {
     if (frameIndex >= frames.value.length) {
       recorder.stop();
       return;
      }
       
     ctx.fillStyle = '#ffffff';
     ctx.fillRect(0, 0, this.width, this.height);
     drawStickman(ctx, frames.value[frameIndex].pose, { 
        scale: 1, 
        jointRadius: 10, 
       drawJoints: true 
      });
       
      frameIndex++;
     setTimeout(drawFrame, interval);
    };
     
    drawFrame();
    });
  }
}

const refreshThumbnails = () => {
  console.log('🔃 手动刷新缩略图');
  updateAllThumbnails();
};

const retryLoadFFmpeg = () => {
  console.log('🔄 手动重试加载 FFmpeg...');
  ffmpegLoaded.value = false;
  loadFFmpeg();
};

// 清除缓存并重新加载
const clearCacheAndReload = async () => {
  if (!confirm('确定要清除 FFmpeg 缓存吗？\n\n清除后需要重新下载核心文件（约 25MB）。')) {
   return;
  }
  
  try {
  const request = indexedDB.deleteDatabase('FFmpegCache');
    
   request.onsuccess = () => {
    console.log('✅ FFmpeg 缓存已清除');
     ffmpegLoaded.value = false;
      loadFFmpeg();
    };
    
   request.onerror = (event) => {
    console.error('清除缓存失败:', event.target.error);
      alert('清除缓存失败，请重试');
    };
  } catch (error) {
  console.error('清除缓存失败:', error);
    alert('清除缓存失败：' + error.message);
  }
};

</script>

<style scoped>@import './styles/app.css';</style>
