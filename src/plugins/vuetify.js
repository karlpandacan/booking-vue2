import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: {
          base: '#990000',
        },
        accent: '#000000',
        secondary: '#00B4EE',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252',
        bannercolor: '#FFFFFF'
      },
      dark: {
        primary: {
          base: '#990000',
        },
        secondary: '#00B4EE',
      }
    },
  },
  icons: {
    iconfont: 'mdiSvg',
  },
});
