import React from 'react';

type ColorPickerContext = {
  show: boolean;
  setShow: SetState<boolean>,
}

const ColorPickerContextInitial: ColorPickerContext = {
  show: false,
  setShow: () => {},
};

export const ColorPickerContext = React.createContext<ColorPickerContext>(ColorPickerContextInitial);

export const ColorPickerContextProvider = ({ children }: {children: React.ReactNode}) => {
  const [show, setShow] = React.useState(false);

  const ctxValue: ColorPickerContext = {
    show,
    setShow,
  };

  return (
    <ColorPickerContext.Provider value={ctxValue}>
      {children}
    </ColorPickerContext.Provider>
  );
};
