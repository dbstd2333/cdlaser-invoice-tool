import type { App } from 'vue';
import {
  Box,
  Document,
  Download,
  Expand,
  Fold,
  List,
  Notebook,
  Plus,
  Setting,
  Ticket,
  Upload,
  User,
  WarningFilled,
} from '@element-plus/icons-vue';

const elementPlusIcons = {
  Box,
  Document,
  Download,
  Expand,
  Fold,
  List,
  Notebook,
  Plus,
  Setting,
  Ticket,
  Upload,
  User,
  WarningFilled,
};

/** 注册模板中使用的 Element Plus 图标组件。 */
export function registerElementPlusIcons(app: App): void {
  Object.entries(elementPlusIcons).forEach(([name, component]) => {
    app.component(name, component);
  });
}
