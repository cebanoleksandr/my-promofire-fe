import type { CSSProperties } from 'react';
import { createTheme } from '@mui/material/styles';

/**
 * Токены цвета из Figma (Promofire-App → node 2653:56011).
 * Имена сохранены как в Figma-переменных, приведены к camelCase.
 */
export const lightColors = {
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

type ColorPalette = {
  interface: Record<keyof typeof lightColors.interface, string>;
  brand: Record<keyof typeof lightColors.brand, string>;
  supportive: Record<keyof typeof lightColors.supportive, string>;
};

/**
 * Тёмная тема — те же роли токенов, что и в lightColors, инвертированные
 * под тёмный фон. Бренд/supportive-акценты слегка осветлены для контраста
 * на тёмном фоне.
 */
export const darkColors: ColorPalette = {
  interface: {
    main: '#FF5C6E',
    black: '#F5F6FA', // используется как основной текст — теперь светлый
    black2: '#D7D8E2',
    grey: '#9A9BB0',
    grey2: '#7A7B8D',
    grey3: '#3A3A42',
    grey4: '#201A1D', // used as subtle surface/hover background
    white: '#17151A', // "white" surfaces become the dark card background
    white2: '#1D1A20',
    overlay: '#000000',
  },
  brand: {
    main: '#FE7A34',
    action: '#FF8A52',
    second: '#F5896C',
  },
  supportive: {
    red: '#F16A5B',
    redAction: '#7A2E27',
    red10: '#2E1917',
    green: '#8BC24A',
    green10: '#1E2A14',
    blue: '#4DA9F5',
    blueAction: '#3D8FD1',
    blue60: '#73B9F1',
    blue10: '#132433',
  },
};

export type ThemeMode = 'light' | 'dark';

/** Текущая цветовая палитра — переключается через `setThemeColors`. Живая
 * ES-module привязка: все модули, импортирующие `colors` по имени, видят
 * актуальное значение сразу после переключения, без дополнительной логики. */
export let colors: ColorPalette = lightColors;

export function setThemeColors(mode: ThemeMode) {
  colors = mode === 'dark' ? darkColors : lightColors;
}

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

export function getTheme(mode: ThemeMode) {
  const palette = mode === 'dark' ? darkColors : lightColors;

  return createTheme({
  customShadows,
  palette: {
    mode,
    primary: {
      main: palette.brand.main,
      dark: palette.brand.action,
      light: palette.brand.second,
      contrastText: palette.interface.white,
    },
    secondary: {
      main: palette.interface.black2,
      light: palette.interface.grey,
      dark: palette.interface.black,
      contrastText: palette.interface.white,
    },
    error: {
      main: palette.supportive.red,
      light: palette.supportive.redAction,
      contrastText: palette.interface.white,
    },
    success: {
      main: palette.supportive.green,
      light: palette.supportive.green10,
      contrastText: palette.interface.white,
    },
    info: {
      main: palette.supportive.blue,
      dark: palette.supportive.blueAction,
      light: palette.supportive.blue60,
      contrastText: palette.interface.white,
    },
    text: {
      primary: palette.interface.black,
      secondary: palette.interface.grey,
      disabled: palette.interface.grey2,
    },
    background: {
      default: mode === 'dark' ? '#121013' : palette.interface.grey4,
      paper: palette.interface.white,
    },
    divider: palette.interface.grey3,
    common: {
      black: palette.interface.black,
      white: palette.interface.white,
    },
    interface: { ...palette.interface },
    brand: { ...palette.brand },
    supportive: { ...palette.supportive },
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
}

const theme = getTheme('light');

export default theme;
