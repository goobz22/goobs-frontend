import { ConfirmationCodeInputsProps } from './../../components/ConfirmationCodeInput'
import { LinkProps } from './link'
import { ImageProps } from './image'
import { CustomGridProps } from 'goobs-repo'
import {
  TypographyProps as BaseTypographyProps,
  columnconfig,
  cellconfig,
} from 'goobs-repo'
import { RadioGroupProps } from './../../components/RadioGroup'
import { CustomButtonProps as BaseCustomButtonProps } from 'goobs-repo'
import { StyledComponentProps as BaseStyledComponentProps } from 'goobs-repo'

export interface TypographyProps extends BaseTypographyProps {
  cellconfig?: cellconfig
  columnconfig?: columnconfig
}

export interface CustomButtonProps extends BaseCustomButtonProps {
  cellconfig?: cellconfig
  columnconfig?: columnconfig
}

export interface StyledComponentProps extends BaseStyledComponentProps {
  cellconfig?: cellconfig
  columnconfig?: columnconfig
}

export interface ContentSectionProps {
  grids: Array<{
    grid: Omit<CustomGridProps, 'children'>
    button?: CustomButtonProps | CustomButtonProps[]
    image?: ImageProps | ImageProps[]
    link?: LinkProps | LinkProps[]
    styledcomponent?: StyledComponentProps | StyledComponentProps[]
    confirmationcodeinput?:
      | ConfirmationCodeInputsProps
      | ConfirmationCodeInputsProps[]
    title?: TypographyProps | TypographyProps[]
    subtitle?: TypographyProps | TypographyProps[]
    paragraph?: TypographyProps | TypographyProps[]
    bodytitle?: TypographyProps | TypographyProps[]
    helperfooter?: TypographyProps | TypographyProps[]
    radiogroup?: RadioGroupProps | RadioGroupProps[]
  }>
}
