import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        done: "Done",
        themeLight: "Switch to light mode",
        themeDark: "Switch to dark mode"
      },
      lang: {
        english: "English",
        chinese: "Chinese"
      },
      search: {
        jobs: "Search jobs, companies, or skills",
        location: "Location"
      },
      period: {
        startTime: "Start Time",
        endTime: "End Time"
      }
    }
  },
  zh: {
    translation: {
      common: {
        done: "完成",
        themeLight: "切换到浅色模式",
        themeDark: "切换到深色模式"
      },
      lang: {
        english: "英文",
        chinese: "中文"
      },
      search: {
        jobs: "搜索职位、公司或技能",
        location: "地点"
      },
      period: {
        startTime: "开始时间",
        endTime: "结束时间"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
