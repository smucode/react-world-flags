import { ImgHTMLAttributes } from 'react';
import { ReactNode } from 'react';

declare const Flag: ({ code, fallback, ...rest }: FlagProps) => ReactNode;
export default Flag;

export declare interface FlagProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    code: string;
    fallback?: ReactNode;
}

export { }
