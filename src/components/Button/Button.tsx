import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

type ButtonBaseProps = Omit<MuiButtonProps, 'disableRipple'>;

export interface ButtonProps extends ButtonBaseProps {
  label?: string;
}

const Button = ({ label, ...rest }: ButtonProps) => <MuiButton {...rest}>{label}</MuiButton>;

export default Button;