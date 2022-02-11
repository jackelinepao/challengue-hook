import { createContext, useContext, useReducer } from "react";

interface ITheme {
  bg: string;
  text: string;
}

interface IProps {
  children?: any;
}

interface IState {
  isLightMode: boolean;
  light: ITheme;
  dark: ITheme;
}

interface IContext {
  isLightMode: boolean;
  light: ITheme;
  dark: ITheme;
  toggleTheme: () => void;
}

type ReducerAction = {
  type: ReducerActionType;
  payload?: any;
};

enum ReducerActionType {
  TOGGLE_THEME
}

export const ThemeContext = createContext<IContext | null>(null);

const initialState = {
  isLightMode: true,
  light: { bg: "white", text: "black" },
  dark: { bg: "black", text: "white" }
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw "You can't use the themecontext outside of the provider";
  }
  return context;
};

const themeReducer = (state: IState, action: ReducerAction): IState => {
  switch (action.type) {
    case ReducerActionType.TOGGLE_THEME:
      return { ...state, isLightMode: !state.isLightMode }

    default:
      return state
  }
}

const ThemeContextProvider = (props: IProps) => {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  const toggleTheme = () => {
    dispatch({ type: ReducerActionType.TOGGLE_THEME });
  };

  return (
    <ThemeContext.Provider value={{ ...state, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
