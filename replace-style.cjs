const fs = require('fs');
const path = require('path');

// 读取App.vue文件
const appVuePath = path.join(__dirname, 'src', 'App.vue');
let content = fs.readFileSync(appVuePath, 'utf8');

// 使用正则表达式替换<style>标签内的内容
const styleRegex = /(<style scoped>)[\s\S]*?(<\/style>)/;
const replacement = '$1@import \'./styles/app.css\';$2';

content = content.replace(styleRegex, replacement);

// 写回文件
fs.writeFileSync(appVuePath, content, 'utf8');

console.log('CSS import added successfully!');