import { styled, Tooltip, tooltipClasses, TooltipProps, Zoom } from '@mui/material';
import { themeVars } from '@sensearena/ui';
import type { ComponentType } from 'react';

export const FormTooltip: ComponentType<TooltipProps> = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} slots={{ transition: Zoom }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: themeVars.colors.white,
    color: themeVars.colors.text,
    maxWidth: 220,
    border: `1px solid ${themeVars.colors.grey}`,
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: themeVars.colors.white,
  },
}));
