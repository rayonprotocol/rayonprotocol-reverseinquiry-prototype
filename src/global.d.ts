interface Window {
  Intl: typeof Intl;
}

declare module '*.css' {
  const classes: { [index: string]: string };
  export default classes;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare const BUILD_ENV: 'development' | 'production';
declare const EMAIL_SUB_API_ROOT: string;