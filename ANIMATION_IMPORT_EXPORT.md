# 动画导入导出功能指南

## 📋 功能概述

本功能允许您将制作的动画导出为 JSON 文件，也可以导入之前保存的 JSON 动画文件。导出的 JSON 文件包含：

- **动画帧数据**：所有帧的姿势信息
- **动画设置**：拍子数（beats）、帧率（fps）、画布尺寸
- **自定义动作**：您保存的所有自定义动作库

## 🎯 使用场景

- **备份动画**：将您的作品保存为 JSON 文件，防止数据丢失
- **分享动画**：将 JSON 文件发送给其他人，分享您的创作
- **跨设备同步**：在不同设备上继续编辑同一个动画
- **复用动作库**：导入包含自定义动作的 JSON 文件，快速复用动作

## 📤 导出动画为 JSON

### 操作步骤

1. 在主界面完成动画制作
2. 点击 **"📤 导出动画 (JSON)"** 按钮
3. 浏览器会自动下载 JSON 文件

### 文件命名

导出的文件名为 `animation_时间戳.json`，例如：
```
animation_1710316800000.json
```

### JSON 文件格式

```json
{
  "version": "1.0",
  "name": "线条人物动画",
  "createdAt": "2026-03-13T05:00:00.000Z",
  "settings": {
    "beats": 4,
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
        "rightShoulder": { "x": 430, "y": 200 },
        "rightElbow": { "x": 460, "y": 250 },
        "rightWrist": { "x": 480, "y": 290 },
        "hips": { "x": 400, "y": 300 },
        "leftHip": { "x": 380, "y": 310 },
        "leftKnee": { "x": 370, "y": 400 },
        "leftAnkle": { "x": 365, "y": 490 },
        "rightHip": { "x": 420, "y": 310 },
        "rightKnee": { "x": 430, "y": 400 },
        "rightAnkle": { "x": 435, "y": 490 }
      }
    }
    // ... 更多帧
  ],
  "customActions": {
    "我的招牌动作": {
      "leftElbow": { "x": 320, "y": 280 },
      "leftWrist": { "x": 350, "y": 310 }
    }
    // ... 更多自定义动作
  }
}
```

## 📥 导入 JSON 动画

### 操作步骤

1. 点击 **"📥 导入动画 (JSON)"** 按钮
2. 在文件选择对话框中选择要导入的 JSON 文件
3. 系统会自动验证并加载动画数据
4. 导入成功后会显示详细信息

### 导入内容

导入 JSON 文件后，以下内容会被恢复：

| 内容 | 说明 |
|------|------|
| 帧数据 | 替换当前所有帧 |
| 拍子数 | 更新为文件中的设置 |
| 帧率 | 更新为文件中的设置 |
| 自定义动作 | **合并**到现有动作库（同名动作会覆盖） |

### 数据验证

系统会在导入时验证以下内容：

- ✅ JSON 格式是否正确
- ✅ 是否包含 `version` 字段
- ✅ 是否包含 `frames` 数组
- ✅ 每帧是否包含 `pose` 对象
- ✅ 关键关节点（head、neck、chest、hips 等）是否有有效坐标

如果验证失败，会显示具体的错误信息。

## ⚠️ 注意事项

1. **导入会覆盖当前动画**：导入 JSON 文件会替换当前的所有帧数据，请先保存当前作品
2. **自定义动作合并**：导入的自定义动作会合并到现有动作库，不会删除已有动作
3. **版本兼容性**：目前支持 version 1.0 格式的 JSON 文件
4. **文件大小**：帧数较多的动画文件会比较大，请耐心等待加载

## 💡 使用技巧

### 分享动画给他人

1. 导出您的动画为 JSON 文件
2. 将文件发送给朋友
3. 朋友导入后即可在本地编辑和播放您的动画

### 备份与恢复

1. 定期导出动画 JSON 文件进行备份
2. 需要时导入备份文件恢复作品

### 动作库管理

1. 创建一个专门包含自定义动作的 JSON 文件（可以只有一帧）
2. 在新项目中导入该文件，快速复用动作库

## 🔧 技术细节

### 数据结构

```typescript
interface AnimationData {
  version: string;           // 格式版本
  name: string;              // 动画名称
  createdAt: string;         // ISO 8601 时间戳
  settings: {
    beats: number;           // 拍子数
    fps: number;             // 帧率
    canvasWidth: number;     // 画布宽度
    canvasHeight: number;    // 画布高度
  };
  frames: Frame[];           // 帧数组
  customActions?: {          // 自定义动作（可选）
    [name: string]: {
      [jointId: string]: { x: number; y: number }
    }
  };
}

interface Frame {
  pose: {
    [jointId: string]: { x: number; y: number }
  };
}
```

### 关节点列表

| 关节点 ID | 说明 |
|----------|------|
| head | 头部 |
| neck | 颈部 |
| chest | 胸部 |
| hips | 臀部 |
| leftShoulder | 左肩 |
| leftElbow | 左肘 |
| leftWrist | 左手腕 |
| rightShoulder | 右肩 |
| rightElbow | 右肘 |
| rightWrist | 右手腕 |
| leftHip | 左胯 |
| leftKnee | 左膝 |
| leftAnkle | 左脚踝 |
| rightHip | 右胯 |
| rightKnee | 右膝 |
| rightAnkle | 右脚踝 |

## 📝 更新日志

### v1.0
- 初始版本
- 支持导出动画为 JSON
- 支持导入 JSON 动画
- 支持同时导入自定义动作

---

*让动画创作更加便捷，随时保存和分享您的作品！*
