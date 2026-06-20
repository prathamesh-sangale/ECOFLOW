import * as React from 'react';

export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button {...props}>{children}</button>;
};

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input {...props} />;
};

export const Card = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export const Modal = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export const Badge = ({ children }: { children: React.ReactNode }) => {
  return <span>{children}</span>;
};

export const Loader = () => {
  return <div>Loading...</div>;
};
