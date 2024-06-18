import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../../config/firebase";

interface udpateProfile {
  values: any;
  userId: string;
  onSuccess: () => void;
}

interface getProfile {
  userId: string;
}

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ values, userId, onSuccess }: udpateProfile, { rejectWithValue }) => {
    try {
      firebase.firestore().collection("users").doc(userId).update(values);

      onSuccess();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async ({ userId }: getProfile, { rejectWithValue }) => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      const users = snapshot?.data();
      return users;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface AuthState {
  profile: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default profileSlice.reducer;
