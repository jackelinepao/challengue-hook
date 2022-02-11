import React, { useState } from 'react';

import './App.css';
import ThemeContextProvider, { useThemeContext } from './Context/ThemeToggle';
import UserContextProvider, { useUserContext } from './Context/UserInfo';

interface ICar {
  id: string,
  brand: string,
  color: string
}

function App() {
  return (
    <div>
      <ThemeContextProvider>
        <ThemeSwitcher />
        <UserContextProvider>
          <MainLayout />
        </UserContextProvider>
      </ThemeContextProvider>
    </div>
  );
}

export default App;

const ThemeSwitcher = () => {
  const { toggleTheme } = useThemeContext();

  return <button onClick={toggleTheme}>Change theme</button>;
};

const MainLayout = () => {
  const { isLightMode, light, dark } = useThemeContext();
  const { name, cars, addCar, deleteCar, editCar } = useUserContext();
  const [edit, setEdit] = useState<ICar>(
    {
      id: "",
      brand: "",
      color: ""
    }
  )


  const theme = isLightMode ? light : dark;

  return (
    <div className="main" style={{ background: theme.bg }}>
      <div style={{ color: theme.text }}>{`Hello ${name}`}</div>
      <div>
        <h4 style={{ background: theme.bg }}>Add Car</h4>
        <form onSubmit={addCar}>
          <input placeholder='Add brand' name='brand' id="brand"/><br />
          <input placeholder='Add color' name='color' /><br />
          <button type="submit">ADD</button>
        </form>
        {
          cars && (
            <div>
              <ul>
                {cars.map((item: any) => (
                  <li key={item.id}>
                    <ul style={{ display: "flex" }}>
                      <li style={{ listStyle: "none", width: 120, color: theme.text }}>{item.brand}</li>
                      <li style={{ listStyle: "none", width: 100, color: theme.text }}>{item.color}</li>
                      <li style={{ listStyle: "none", width: 50, color: theme.text }}><button onClick={() => setEdit(item)}>Edit</button></li>
                      <li style={{ listStyle: "none", width: 50, color: theme.text }}><button onClick={() => deleteCar(item.id)}>Delete</button></li>
                    </ul>
                  </li>))}
              </ul>
              {
                  <div>
                    <h4 style={{ background: theme.bg }}>Edit Car</h4>
                    <form onSubmit={editCar}>
                      <input name='id' placeholder={edit.id} defaultValue={edit.id} disabled /><br />
                      <input name='editBrand' placeholder='Edit brand' disabled={edit.brand?false: true} defaultValue={edit.brand} /><br />
                      <input name='editColor' placeholder='Edit color' disabled={edit.color?false: true} defaultValue={edit.color} /><br />
                      <button type="submit">ADD EDITED CART</button>
                    </form>
                  </div>
              }
            </div>
          )
        }
      </div>
    </div>
  );
};
