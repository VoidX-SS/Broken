import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="StyleAI Logo"
      width="120"
      height="30"
      viewBox="0 0 120 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M23.333 21.037V9.5h3.334v10.518c0 .593.481 1.019 1.018 1.019h5.185v2.815H24.352c-.593 0-1.019-.482-1.019-1.019v-.796Z"
        fill="hsl(var(--primary))"
      />
      <path
        d="M37.351 24.352h3.334V6.667h-3.334v17.685Z"
        fill="hsl(var(--primary))"
      />
      <path
        d="M48.277 24.352h3.334V9.5h-3.334v14.852Z"
        fill="hsl(var(--primary))"
      />
      <rect
        x="6"
        y="6"
        width="10"
        height="18"
        rx="2"
        fill="hsl(var(--foreground))"
      />
      <path
        d="M59.43 15.258c0-2.015 1.63-3.645 3.645-3.645s3.645 1.63 3.645 3.645-1.63 3.645-3.645 3.645-3.645-1.63-3.645-3.645Zm10.126 8.528h2.95V6.667h-2.95l-3.357 5.163v.163h3.407c2.95 0 5.343 2.392 5.343 5.342s-2.393 5.342-5.343 5.342h-3.407v-2.814h3.357Z"
        fill="hsl(var(--foreground))"
      />
      <path
        d="M78.69 23.786h8.214v-2.814H81.6V17.9h4.429v-2.815h-4.43V9.482h5.303V6.667H78.69v17.12Z"
        fill="hsl(var(--foreground))"
      />
      <path
        d="M93.308 23.786h3.018l5.25-17.12h-3.134l-3.84 12.353-3.84-12.353h-3.133l5.25 17.12Z"
        fill="hsl(var(--foreground))"
      />
      <path
        d="M104.912 6.667h3.018v17.12h-3.018v-17.12Z"
        fill="hsl(var(--foreground))"
      />
    </svg>
  );
}
