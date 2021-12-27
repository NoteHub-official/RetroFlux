import produce from "immer";

interface TestState {
  test: string;
}

const initialState: TestState = {
  test: "test",
};

const reducer = produce(
  (state: TestState = initialState, action: any): TestState => {
    switch (action.type) {
      case "TEST":
        return {
          test: "test",
        };
      default:
        return state;
    }
  },
  initialState
);

export default reducer;
