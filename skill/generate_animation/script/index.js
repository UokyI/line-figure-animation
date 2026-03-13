#!/usr/bin/env node
/**
 * generate_animation Skill Script
 * 
 * 生成线条小人动画 JSON 数据
 */

// 默认姿势
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

// 深拷贝姿势
const clonePose = () => JSON.parse(JSON.stringify(defaultPose));

// 姿势插值
const interpolatePose = (fromPose, toPose, progress) => {
  const newPose = {};
  for (let jointId in fromPose) {
    newPose[jointId] = { ...fromPose[jointId] };
  }
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

// 生成过渡帧
const generateTransition = (fromPose, toPose, framesCount) => {
  const frames = [];
  for (let i = 0; i <= framesCount; i++) {
    const progress = i / framesCount;
    frames.push({ pose: interpolatePose(fromPose, toPose, progress) });
  }
  return frames;
};

// 根据描述生成关键帧
const generateKeyframesFromDescription = (description) => {
  const keyframes = [clonePose()];
  const desc = description.toLowerCase();
  
  // 挥手
  if (desc.includes('挥手') || desc.includes('wave')) {
    const raisePose = clonePose();
    if (desc.includes('左手') || desc.includes('left')) {
      raisePose.leftShoulder = { x: 370, y: 180 };
      raisePose.leftElbow = { x: 340, y: 150 };
      raisePose.leftWrist = { x: 320, y: 120 };
    } else {
      raisePose.rightShoulder = { x: 430, y: 180 };
      raisePose.rightElbow = { x: 460, y: 150 };
      raisePose.rightWrist = { x: 480, y: 120 };
    }
    keyframes.push(raisePose);
    keyframes.push(raisePose);
    keyframes.push(clonePose());
  }
  // 跳跃
  else if (desc.includes('跳跃') || desc.includes('jump')) {
    const jumpPose = clonePose();
    jumpPose.head = { x: 400, y: 100 };
    jumpPose.neck = { x: 400, y: 130 };
    jumpPose.chest = { x: 400, y: 170 };
    jumpPose.leftShoulder = { x: 370, y: 140 };
    jumpPose.leftElbow = { x: 350, y: 110 };
    jumpPose.leftWrist = { x: 340, y: 80 };
    jumpPose.rightShoulder = { x: 430, y: 140 };
    jumpPose.rightElbow = { x: 450, y: 110 };
    jumpPose.rightWrist = { x: 460, y: 80 };
    jumpPose.hips = { x: 400, y: 210 };
    jumpPose.leftHip = { x: 390, y: 220 };
    jumpPose.leftKnee = { x: 380, y: 260 };
    jumpPose.leftAnkle = { x: 375, y: 290 };
    jumpPose.rightHip = { x: 410, y: 220 };
    jumpPose.rightKnee = { x: 420, y: 260 };
    jumpPose.rightAnkle = { x: 425, y: 290 };
    keyframes.push(jumpPose);
    keyframes.push(clonePose());
  }
  // 跑步
  else if (desc.includes('跑步') || desc.includes('run')) {
    const runPose1 = clonePose();
    runPose1.leftKnee = { x: 360, y: 380 };
    runPose1.leftAnkle = { x: 350, y: 450 };
    runPose1.rightKnee = { x: 450, y: 410 };
    runPose1.rightAnkle = { x: 460, y: 480 };
    keyframes.push(runPose1);
    
    const runPose2 = clonePose();
    runPose2.leftKnee = { x: 450, y: 410 };
    runPose2.leftAnkle = { x: 460, y: 480 };
    runPose2.rightKnee = { x: 360, y: 380 };
    runPose2.rightAnkle = { x: 350, y: 450 };
    keyframes.push(runPose2);
    keyframes.push(clonePose());
  }
  // 打招呼
  else if (desc.includes('打招呼') || desc.includes('greet')) {
    const greetPose = clonePose();
    greetPose.rightShoulder = { x: 430, y: 180 };
    greetPose.rightElbow = { x: 460, y: 150 };
    greetPose.rightWrist = { x: 480, y: 120 };
    keyframes.push(greetPose);
    keyframes.push(greetPose);
    keyframes.push(clonePose());
  }
  // 默认：简单挥手
  else {
    const wavePose = clonePose();
    wavePose.rightShoulder = { x: 430, y: 180 };
    wavePose.rightElbow = { x: 460, y: 150 };
    wavePose.rightWrist = { x: 480, y: 120 };
    keyframes.push(wavePose);
    keyframes.push(clonePose());
  }
  
  return keyframes;
};

// 生成动画主函数
const generateAnimation = (name, description, beats = 4, fps = 12) => {
  const keyframes = generateKeyframesFromDescription(description);
  const totalFrames = beats * fps;
  const framesPerTransition = Math.floor(totalFrames / keyframes.length);
  
  const frames = [];
  let currentPose = clonePose();
  
  for (let i = 0; i < keyframes.length; i++) {
    const targetPose = keyframes[i];
    const transitionFrames = generateTransition(currentPose, targetPose, framesPerTransition);
    
    if (i > 0) {
      frames.push(...transitionFrames.slice(1));
    } else {
      frames.push(...transitionFrames);
    }
    
    currentPose = JSON.parse(JSON.stringify(targetPose));
  }
  
  while (frames.length < totalFrames) {
    frames.push({ pose: JSON.parse(JSON.stringify(currentPose)) });
  }
  
  while (frames.length > totalFrames) {
    frames.pop();
  }
  
  return {
    version: '1.0',
    name: name,
    createdAt: new Date().toISOString(),
    settings: {
      beats: beats,
      fps: fps,
      canvasWidth: 800,
      canvasHeight: 600
    },
    frames: frames,
    customActions: {}
  };
};

// 导出函数
export { generateAnimation, defaultPose };

// 如果是命令行执行
if (typeof process !== 'undefined' && process.argv[1] && process.argv[1].includes('index.js')) {
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const name = args[0];
    const description = args[1];
    const beats = parseInt(args[2]) || 4;
    const fps = parseInt(args[3]) || 12;
    
    const result = generateAnimation(name, description, beats, fps);
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('Usage: node index.js <name> <description> [beats] [fps]');
    console.log('Example: node index.js "挥手" "右手举起挥手打招呼" 2 12');
  }
}
