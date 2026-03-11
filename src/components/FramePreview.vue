<template>
  <div class="frame-preview-container">
    <canvas 
      ref="previewCanvasRef"
      width="100" 
      height="120"
      class="frame-preview-canvas"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

// 接收动作序列作为props
const props = defineProps({
  frameGroup: {
    type: Array,
    required: true
  },
  quickActions: {
    type: Object,
    required: true
  }
});

const previewCanvasRef = ref(null);

// 默认姿势
const createDefaultPose = () => ({
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
});

// 应用动作到姿势
const applyQuickActionToPose = (pose, action) => {
  for (let jointId in action) {
    if (pose[jointId]) {
      pose[jointId].x = action[jointId].x;
      pose[jointId].y = action[jointId].y;
    }
  }
};

// 绘制小人
const drawStickman = (context, pose, options = {}) => {
  const { scale = 1, offsetX = 0, offsetY = 0, drawJoints = true, jointRadius = 10, isPreview = true } = options;

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
  }
};

// 更新预览
const updatePreview = () => {
  if (!previewCanvasRef.value) return;
  
  const canvas = previewCanvasRef.value;
  const ctx = canvas.getContext('2d');
  
  // 清空画布
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 创建默认姿势
  const pose = createDefaultPose();
  
  // 应用当前关键帧组中的所有动作
  if (props.frameGroup && props.frameGroup.length > 0) {
    props.frameGroup.forEach(actionKey => {
      const action = props.quickActions[actionKey];
      if (action) {
        applyQuickActionToPose(pose, action);
      }
    });
    
    // 绘制小人 - 使用适合预览的缩放和偏移
    // 计算缩放比例，使图形尽可能大但仍适应canvas
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    // 使用更大的比例，接近最大可能的缩放
    const scale = Math.min(scaleX, scaleY) * 2.5;
    
    // 计算偏移量，使图形居中
    const offsetX = (canvas.width - 800 * scale) / 2;
    const offsetY = (canvas.height - 600 * scale) / 2;
    
    drawStickman(ctx, pose, { 
      scale: scale, 
      offsetX: offsetX, 
      offsetY: offsetY,
      isPreview: true
    });
  } else {
    // 如果没有动作，绘制默认姿势
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    const scale = Math.min(scaleX, scaleY) * 2.5; // 使用一致的缩放比例
    
    const offsetX = (canvas.width - 800 * scale) / 2;
    const offsetY = (canvas.height - 600 * scale) / 2;
    
    drawStickman(ctx, pose, { 
      scale: scale, 
      offsetX: offsetX, 
      offsetY: offsetY,
      isPreview: true
    });
  }
};

// 监听frameGroup变化，更新预览
watch(() => props.frameGroup, () => {
  nextTick(() => {
    setTimeout(updatePreview, 50);
  });
}, { deep: true });

// 组件挂载后更新预览
onMounted(() => {
  setTimeout(updatePreview, 100);
});
</script>

<style scoped>
.frame-preview-container {
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;
  position: relative;
  border: 1px solid #eee;
  border-radius: 4px;
  background: white;
  padding: 2px;
  flex-shrink: 0; /* 防止被压缩 */
}

.frame-preview-canvas {
  border: 1px solid #ddd;
  border-radius: 3px;
  background: white;
  display: block;
}
</style>