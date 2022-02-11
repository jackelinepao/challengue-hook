import { createContext, useContext, useReducer } from "react";

interface ICar {
  id: string,
  brand: string,
  color: string
}

interface IState {
  name: string;
  lastName: string;
  isLoggedIn: boolean,
  cars: ICar[],
}

interface IContext {
  name: string;
  lastName: string;
  isLoggedIn: boolean,
  cars: ICar[],
  toggleLogin: () => void,
  addCar: (e: React.SyntheticEvent) => void;
  deleteCar: (id: string) => void;
  editCar: (e: React.SyntheticEvent) => void;
}

interface IProps {
  children: React.ReactChild;
}

type IReducerAction = {
  type: ReducerActionType.ADD_CAR;
  data: ICar;
} | {
  type: ReducerActionType.DELETE_CAR;
  data: string;
} | {
  type: ReducerActionType.EDIT_CAR;
  data: ICar;
} | {
  type: ReducerActionType.LOGGED;
};

enum ReducerActionType {
  ADD_CAR,
  DELETE_CAR,
  EDIT_CAR,
  LOGGED,
}

export const UserContext = createContext<IContext | null>(null);

const initialState: IState = {
  name: "Gerardo",
  lastName: "Estrada",
  isLoggedIn: false,
  cars: [
    {
      id: "1",
      brand: "Toyota",
      color: "Blue"
    },
    {
      id: "2",
      brand: "Nissan",
      color: "Red"
    }
  ]
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw "You can't use the userContext outside of the provider";
  }
  return context;
};

const reducerCars = (state: IState, action: IReducerAction): IState => {
  switch (action.type) {
    case ReducerActionType.ADD_CAR:
      return { ...state, cars: [...state.cars, action.data] };

    case ReducerActionType.EDIT_CAR:
      const updateCar = () => {
        const newData: ICar[] = new Array(state.cars.length)

        for (let i = 0; i < newData.length; i++) {
          state.cars[i].id === action.data.id ? newData[i] = action.data : newData[i] = state.cars[i]
        }

        return newData
      }

      return { ...state, cars: updateCar() }

    case ReducerActionType.DELETE_CAR:
      return { ...state, cars: [...state.cars.filter((car) => car.id !== action.data)] };

    default:
      return state;
  }
};


const UserContextProvider = (props: IProps) => {
  const [state, dispatch] = useReducer(reducerCars, initialState);

  const toggleLogin = () => {
    dispatch({ type: ReducerActionType.LOGGED })
  };

  const addCar = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      brand: { value: string };
      color: { value: string };
    };
    const newCar = {
      id: Date.now().toString(),
      brand: target.brand.value,
      color: target.color.value

    }

    dispatch({ type: ReducerActionType.ADD_CAR, data: newCar })
  }

  const deleteCar = (id: string) => {
    dispatch({ type: ReducerActionType.DELETE_CAR, data: id })
  }

  const editCar = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      id: { value: string }
      editBrand: { value: string };
      editColor: { value: string };
    };
    const editedCar = {
      id: target.id.value,
      brand: target.editBrand.value,
      color: target.editColor.value

    }

    dispatch({ type: ReducerActionType.EDIT_CAR, data: editedCar })
  }
  // Agregar un carro mas al array
  // Actualizar un carro existente
  // Eliminar un carro del array de carros

  return (
    <UserContext.Provider value={{ ...state, toggleLogin, addCar, deleteCar, editCar }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
