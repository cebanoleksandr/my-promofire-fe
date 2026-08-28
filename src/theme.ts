import type { CSSProperties } from 'react';
import { createTheme } from '@mui/material/styles';

/**
 * Токены цвета из Figma (Promofire-App → node 2653:56011).
 * Имена сохранены как в Figma-переменных, приведены к camelCase.
 */
export const colors = {
  interface: {
    main: '#EB2A41', // Interface/Main — акцентный красный интерфейса
    black: '#120C0E', // Interface/black
    black2: '#3A3A42', // Interface/black-2
    grey: '#7A7B8D', // Interface/grey
    grey2: '#9798AF', // Interface/grey-2
    grey3: '#DCDDE4', // Interface/grey-3
    grey4: '#F5F7FA', // Interface/grey-4
    white: '#FFFFFF', // Interface/White
    white2: '#FBFBFB', // Interface/White-2
    overlay: '#120C0F', // Interface/overlayer-background
  },
  /** Основной бренд-оранжевый */
  brand: {
    main: '#FE650D', // Main
    action: '#F1562D', // Main-action (hover/pressed)
    second: '#F5896C', // Main-second (light)
  },
  supportive: {
    red: '#D73B2A', // Supportive/red
    redAction: '#F6BBB4', // Supportive/red-action
    red10: '#FBEBEA', // Supportive/red-10
    green: '#5E9B19', // Supportive/green
    green10: '#EFF5E8', // Supportive/green-10
    blue: '#2196F3', // Supportive/blue
    blueAction: '#0B81DF', // Supportive/blue-action
    blue60: '#73B9F1', // Supportive/blue-60
    blue10: '#E9F4FE', // Supportive/blue-10
  },
} as const;

/**
 * Тени из Figma (node 2653:56099). Цвет #484F5D, альфа как в макете.
 *  - soft:    #484F5D 6%,  0 4 blur 4  spread 0
 *  - contour: #484F5D 6%,  0 4 blur 6  spread -4
 *           + #484F5D 25%, 0 0 blur 2  spread 0
 */
export const customShadows = {
  soft: '0px 4px 4px 0px rgba(72, 79, 93, 0.06)',
  contour:
    '0px 4px 6px -4px rgba(72, 79, 93, 0.06), 0px 0px 2px 0px rgba(72, 79, 93, 0.25)',
} as const;

// ── Типографика ────────────────────────────────────────────────────────
export const fontFamily =
  '"Fixel Display", "Inter", "Helvetica", "Arial", sans-serif';

export const fontWeights = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;

/**
 * Текстовые стили из Figma (node 2653:56012). Имена — как в Figma
 * ("App/M/[SB]" → mSB). Значения в px, готовы к использованию в `sx`.
 */
export const fontStyles = {
  xxl: { fontFamily, fontWeight: 700, fontSize: 44, lineHeight: '56px', letterSpacing: 0 }, // App/XXL [B]
  xl: { fontFamily, fontWeight: 700, fontSize: 30, lineHeight: '36px', letterSpacing: 0 }, // App/XL [B]
  l: { fontFamily, fontWeight: 600, fontSize: 20, lineHeight: '28px', letterSpacing: 0 }, // App/L [SB]
  mR: { fontFamily, fontWeight: 400, fontSize: 16, lineHeight: '26px', letterSpacing: 0 }, // App/M/[R]
  mM: { fontFamily, fontWeight: 500, fontSize: 16, lineHeight: '26px', letterSpacing: 0 }, // App/M/[M]
  mSB: { fontFamily, fontWeight: 600, fontSize: 16, lineHeight: '26px', letterSpacing: 0 }, // App/M/[SB]
  smR: { fontFamily, fontWeight: 400, fontSize: 14, lineHeight: '22px', letterSpacing: 0 }, // App/SM/[R]
  smSB: { fontFamily, fontWeight: 600, fontSize: 14, lineHeight: '22px', letterSpacing: 0 }, // App/SM/[SB]
  sM: { fontFamily, fontWeight: 500, fontSize: 14, lineHeight: '18px', letterSpacing: 0 }, // App/S [M]
} as const;

// ── MUI module augmentation ─────────────────────────────────────────────
declare module '@mui/material/styles' {
  interface Palette {
    interface: Palette['primary'] & Record<keyof typeof colors.interface, string>;
    brand: { main: string; action: string; second: string };
    supportive: Record<keyof typeof colors.supportive, string>;
  }
  interface PaletteOptions {
    interface?: Record<string, string>;
    brand?: { main: string; action: string; second: string };
    supportive?: Record<string, string>;
  }
  interface Theme {
    customShadows: typeof customShadows;
  }
  interface ThemeOptions {
    customShadows?: typeof customShadows;
  }

  interface TypographyVariants {
    appXXL: CSSProperties;
    appXL: CSSProperties;
    appL: CSSProperties;
    appMR: CSSProperties;
    appMM: CSSProperties;
    appMSB: CSSProperties;
    appSMR: CSSProperties;
    appSMSB: CSSProperties;
    appSM: CSSProperties;
  }
  interface TypographyVariantsOptions {
    appXXL?: CSSProperties;
    appXL?: CSSProperties;
    appL?: CSSProperties;
    appMR?: CSSProperties;
    appMM?: CSSProperties;
    appMSB?: CSSProperties;
    appSMR?: CSSProperties;
    appSMSB?: CSSProperties;
    appSM?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    appXXL: true;
    appXL: true;
    appL: true;
    appMR: true;
    appMM: true;
    appMSB: true;
    appSMR: true;
    appSMSB: true;
    appSM: true;
  }
}

const theme = createTheme({
  customShadows,
  palette: {
    mode: 'light',
    primary: {
      main: colors.brand.main,
      dark: colors.brand.action,
      light: colors.brand.second,
      contrastText: colors.interface.white,
    },
    secondary: {
      main: colors.interface.black2,
      light: colors.interface.grey,
      dark: colors.interface.black,
      contrastText: colors.interface.white,
    },
    error: {
      main: colors.supportive.red,
      light: colors.supportive.redAction,
      contrastText: colors.interface.white,
    },
    success: {
      main: colors.supportive.green,
      light: colors.supportive.green10,
      contrastText: colors.interface.white,
    },
    info: {
      main: colors.supportive.blue,
      dark: colors.supportive.blueAction,
      light: colors.supportive.blue60,
      contrastText: colors.interface.white,
    },
    text: {
      primary: colors.interface.black,
      secondary: colors.interface.grey,
      disabled: colors.interface.grey2,
    },
    background: {
      default: colors.interface.grey4,
      paper: colors.interface.white,
    },
    divider: colors.interface.grey3,
    common: {
      black: colors.interface.black,
      white: colors.interface.white,
    },
    interface: { ...colors.interface },
    brand: { ...colors.brand },
    supportive: { ...colors.supportive },
  },
  typography: {
    fontFamily,
    fontWeightRegular: fontWeights.regular,
    fontWeightMedium: fontWeights.medium,
    fontWeightBold: fontWeights.bold,

    // Стандартные MUI-варианты, замаппленные на токены Figma
    h1: fontStyles.xxl,
    h2: fontStyles.xl,
    h3: fontStyles.l,
    h4: fontStyles.l,
    subtitle1: fontStyles.mSB,
    subtitle2: fontStyles.smSB,
    body1: fontStyles.mR,
    body2: fontStyles.smR,
    button: { ...fontStyles.mM, textTransform: 'none' },
    caption: fontStyles.sM,

    // Кастомные варианты с точными именами из Figma
    appXXL: fontStyles.xxl,
    appXL: fontStyles.xl,
    appL: fontStyles.l,
    appMR: fontStyles.mR,
    appMM: fontStyles.mM,
    appMSB: fontStyles.mSB,
    appSMR: fontStyles.smR,
    appSMSB: fontStyles.smSB,
    appSM: fontStyles.sM,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          appXXL: 'h1',
          appXL: 'h2',
          appL: 'h3',
          appMR: 'p',
          appMM: 'p',
          appMSB: 'p',
          appSMR: 'p',
          appSMSB: 'p',
          appSM: 'span',
        },
      },
    },
  },
});

export default theme;
