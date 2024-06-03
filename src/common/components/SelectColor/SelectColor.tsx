import React, { useState } from 'react';
import s from './SelectColor.module.scss';

function SelectColor({ onChange }: { onChange: (color: React.SetStateAction<string>) => void }): JSX.Element {
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const handleColorChange = (event: { target: { value: React.SetStateAction<string> } }): void => {
    const newColor = event.target.value;
    setSelectedColor(newColor);
    onChange(newColor);
  };

  return (
    <div className={s.body}>
      <label htmlFor="colorPicker">
        Виберіть
        <br />
        колір для дошки:
      </label>
      <input
        className={s.inputForColor}
        type="color"
        id="colorPicker"
        value={selectedColor}
        onChange={handleColorChange}
      />
    </div>
  );
}

export default SelectColor;
