# generate_animation Skill

## 描述

生成线条小人动画 JSON 数据。根据用户提供的动作描述，生成一个包含完整帧数据的 JSON 动画文件。

## 版本

1.0.0

## 参数

| 参数名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
| name | string | 是 | - | 动画名称 |
| description | string | 是 | - | 动作描述（如"挥手"、"跳跃"、"跑步"） |
| beats | number | 否 | 4 | 时长（拍子数） |
| fps | number | 否 | 12 | 帧率 |

## 返回值

JSON 对象，包含以下字段：
- `version`: 格式版本（"1.0"）
- `name`: 动画名称
- `settings`: 动画设置（beats, fps, canvasWidth, canvasHeight）
- `frames`: 帧数组，每帧包含 pose 对象
- `customActions`: 自定义动作（空对象）

## 示例

### 请求
```json
{
  "name": "挥手",
  "description": "右手举起挥手打招呼",
  "beats": 2,
  "fps": 12
}
```

### 返回
```json
{
  "version": "1.0",
  "name": "挥手",
  "settings": {
    "beats": 2,
    "fps": 12,
    "canvasWidth": 800,
    "canvasHeight": 600
  },
  "frames": [
    {
      "pose": {
        "head": { "x": 400, "y": 150 },
        "neck": { "x": 400, "y": 190 },
        "chest": { "x": 400, "y": 240 },
        "leftShoulder": { "x": 370, "y": 200 },
        "leftElbow": { "x": 340, "y": 250 },
        "leftWrist": { "x": 320, "y": 290 },
        "rightShoulder": { "x": 430, "y": 180 },
        "rightElbow": { "x": 460, "y": 150 },
        "rightWrist": { "x": 480, "y": 120 },
        "hips": { "x": 400, "y": 300 },
        "leftHip": { "x": 380, "y": 310 },
        "leftKnee": { "x": 370, "y": 400 },
        "leftAnkle": { "x": 365, "y": 490 },
        "rightHip": { "x": 420, "y": 310 },
        "rightKnee": { "x": 430, "y": 400 },
        "rightAnkle": { "x": 435, "y": 490 }
      }
    }
  ],
  "customActions": {}
}
```

## 支持的动作

- 挥手（左手/右手）
- 跳跃
- 跑步
- 打招呼
- 举手
- 叉腰
- 弯腰
- 舞蹈动作

## 注意事项

1. 所有坐标值必须在合理范围内（x: 0-800, y: 0-600）
2. 相邻帧之间的变化不应太大，以确保动作流畅
3. 生成的 JSON 格式必须与应用导入格式完全一致
