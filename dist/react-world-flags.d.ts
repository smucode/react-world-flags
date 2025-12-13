import { ImgHTMLAttributes } from 'react';
import { ReactNode } from 'react';

export declare const countries: Country[];

export declare type Country = {
    alpha2: string;
    alpha3?: string;
    numeric?: string;
    name: string;
};

declare const Flag: ({ code, fallback, ...rest }: FlagProps) => ReactNode;
export { Flag }
export default Flag;

export declare interface FlagProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    code: string;
    fallback?: ReactNode;
}

export { }
