import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../../config/firebase";

export const getUsers = createAsyncThunk(
  "community/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await firebase.firestore().collection("users").get();
      const users = snapshot?.docs?.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return users;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface AuthState {
  users: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  users: null,
  loading: false,
  error: null,
};

const communitySlice = createSlice({
  name: "community",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default communitySlice.reducer;
