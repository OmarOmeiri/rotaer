import Config from '@/config';

const { colors } = Config.get('styles');

export const TABLE_OPTIONS_BG = colors.darklight;
export const TABLE_OPTIONS_BG_HOVER = 'rgba(255, 255, 255, 0.2)';
export const TABLE_OPTIONS_FONT_COLOR = colors.white;

export enum TableOptionsMenuNames {
  settings = 'settings',
  columns = 'columns',
  columnPresets = 'columnPresets',
  timeFrames = 'timeFrames'
}
