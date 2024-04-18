// views页面文件按照模板创建工具

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  // eslint-disable-next-line n/prefer-global/process
  input: process.stdin,
  // eslint-disable-next-line n/prefer-global/process
  output: process.stdout
});

function askForDirectories() {
  rl.question(
    '请输入要创建的目录名称（如 Home 或 User/Profile，多个目录请用逗号隔开），输入 q 结束：',
    // eslint-disable-next-line func-names
    function (input) {
      if (input.trim().toLowerCase() === 'q') {
        console.log('退出程序。');
        rl.close();
        return;
      }

      const folderNames = input.split(',').map(name => name.trim());
      folderNames.forEach(folderName => {
        if (folderName) {
          createViewStructure(folderName);
          console.log(`创建的目录路径：${path.join(__dirname, 'src', 'views', folderName)}`);
        }
      });

      // 继续询问
      askForDirectories();
    }
  );
}

function createViewStructure(folderName) {
  const baseDir = path.join(__dirname, 'src', 'views', folderName);
  if (fs.existsSync(baseDir)) {
    console.log(`目录 ${baseDir} 已存在，跳过创建。`);
    return;
  }
  // 需要创建的目录列表
  const directories = ['components', 'composables', 'api', 'store', 'types', 'i18n'];

  // 确保基目录存在
  fs.mkdirSync(baseDir, { recursive: true });

  // 创建子目录
  directories.forEach(dir => {
    fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
  });

  const filesWithContent = {
    [`${folderName.split('/').pop()}.vue`]: `<template>\n</template>\n\n<script setup lang="ts">\n// 页面主组件\nimport { use${folderName.split('/').pop()}Store } from './store/${folderName.split('/').pop()}Store';\nconst store = use${folderName.split('/').pop()}Store();\n</script>\n\n<style scoped>\n</style>\n`,
    [`${folderName.split('/').pop()}.module.scss`]: '/* 页面专用样式 */\n',
    [`api/${folderName.split('/').pop()}Api.ts`]: '// 页面专用API接口\n',
    [`store/${folderName.split('/').pop()}Store.ts`]: `import { defineStore } from 'pinia';\n\nexport const use${folderName.split('/').pop()}Store = defineStore('${folderName.split('/').pop()}', {\n  state: () => ({\n    /* 状态定义 */\n  }),\n  actions: {\n    /* 动作方法 */\n  },\n});\n`,
    [`types/${folderName.split('/').pop()}Types.ts`]: '// 页面专用类型定义\n',
    [`composables/use${folderName.split('/').pop().charAt(0).toUpperCase() + folderName.split('/').pop().slice(1)}Data.ts`]:
      '// 页面专用Composition API函数\n',
    [`i18n/index.ts`]: `import type {uiui88} from './types';\n export const enUs:${folderName.split('/').pop()} = {};\nexport const zhCn:${folderName.split('/').pop()} = {${folderName.split('/').pop()}:{}};\n`, // 国际化文件
    [`i18n/types.ts`]: `export interface ${folderName.split('/').pop()} {}\n` // 国际化类型文件
  };

  // 创建文件并写入内容
  Object.entries(filesWithContent).forEach(([fileName, content]) => {
    const filePath = path.join(baseDir, fileName);
    if (fs.existsSync(filePath)) {
      console.log(`文件 ${filePath} 已存在，跳过创建。`);
      return;
    }
    fs.writeFileSync(path.join(baseDir, fileName), content);
  });
}

// 开始询问用户输入
askForDirectories();
