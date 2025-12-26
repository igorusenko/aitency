import {definePreset} from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const CustomPreset = definePreset(Aura, {
  components: {
    inputtext: {
      colorScheme: {
        light: {
          root: {
            background: 'radial-gradient(1000px 600px at 10% 10%, rgba(124,92,255,.18), transparent 60%),\n' +
              '      radial-gradient(900px 500px at 90% 30%, rgba(34,197,94,.10), transparent 55%),\n' +
              '      #0b0f17',
            borderColor: 'transparent'
          }
        }
      }
    },
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: 'transparent linear-gradient(180deg, #7A5AF8 0%, #4A1FB8 100%)',
              color: 'white',
              borderColor: '#5d5d63',
              hoverBorderColor: '#5d5d63',
              hoverBackground: 'transparent linear-gradient(180deg, #543eb8 0%, #4A1FB8 100%)',
              hoverColor: 'white'
            }
          }
        }
      }
    }
  }
});
