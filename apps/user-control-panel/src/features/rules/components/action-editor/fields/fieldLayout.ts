import { COMPACT_FIELD, FIELD_LABEL } from '../../../../../shared/ui/styles';

export const FIELD_ROW = 'flex flex-col md:flex-row gap-3 md:items-center mb-3';
export const FIELD_ROW_LABEL = `${FIELD_LABEL} md:w-32 shrink-0`;
export const FIELD_STACK = 'flex flex-col gap-2 mb-3';

export const selectClassName = (readOnly: boolean) =>
  `${COMPACT_FIELD} flex-1 ${readOnly ? 'appearance-none cursor-default' : 'cursor-pointer'}`;
