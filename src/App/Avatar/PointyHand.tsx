import { Props } from "./type";

export const PointyHand = ({ colorDark }: Props) => (
  <path
    transform="rotate(90) scale(-1,1) translate( -200,-170) scale(3)"
    fill={colorDark}
    stroke={"#333"}
    d="m 53.427092,57.105423 q -1.051638,-2.261796 -1.154121,-3.46466 -0.185925,-2.460266 1.092704,-3.921249 1.289624,-1.460835 3.579588,-2.112531 0.567477,-0.148966 3.792828,-0.255909 3.273688,-0.112825 9.75912,-0.339286 6.484914,-0.223941 7.495806,1.088975 0.999922,1.324465 1.003416,2.645995 -0.0079,1.320064 0.196505,7.404673 0.193454,5.464757 -0.1204,6.749466 -0.167443,0.659173 -1.268486,1.185857 -0.532508,0.261625 -1.88568,0.685795 -0.860737,0.250719 -3.370581,-1.671802 -1.77959,-1.380508 -3.372946,-2.968561 -1.165258,-1.164878 -1.612458,-1.406976 -0.819358,-0.459711 -2.275448,-0.352618 -1.625214,0.112661 -5.196713,0.0206 -4.421098,-0.106017 -4.972273,-0.549101 -0.657204,-0.538428 -1.690861,-2.738669 z"
  />
);
