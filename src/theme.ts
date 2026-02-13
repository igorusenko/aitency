import {definePreset} from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const CustomPreset = definePreset(Aura, {
  components: {
    datatable: {
      headerCell: {
        background: 'transparent',
        borderColor: 'rgba(255,255,255,.08)',
        color: 'white',
        hoverBackground: '#21213e',
        hoverColor: 'white',
      },
      row: {
        background: 'transparent',
        color: 'white',
        hoverBackground: '#21213e',
        hoverColor: 'white',
      },
      bodyCell: {
        borderColor: 'rgba(255,255,255,.08)',
      }
    },
    paginator: {
      root: {
        background: 'transparent',
        borderRadius: '0'
      }
    },
    panel: {
      root: {
        background: '#1b1b3a'
      }
    },
    tabs: {
      tabpanel: {
        background: 'transparent',
      },
      tablist: {
        background: 'transparent',
      }
    }
  }
});
