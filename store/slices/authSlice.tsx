import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../../config/firebase";

interface HandleUser {
  formData: any;
  onSuccess: any;
}
interface Logout {
  onSuccess: any;
}

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(color, "colorAhsan");
  return color;
};

const generateDefaultImageUrl = (name: string) => {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const avatarStyles = {
    "background-color": getRandomColor(),
    color: "#ffffff",
    "font-size": "28px",
    width: "100px",
    height: "100px",
    "border-radius": "50%",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    "font-family": "'Baloo Bhai 2', cursive",
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100%" height="100%" rx="50%" fill="${avatarStyles["background-color"]}"/>
      <text x="50%" y="50%" font-size="${avatarStyles["font-size"]}" fill="${avatarStyles["color"]}" text-anchor="middle" dominant-baseline="central">
        ${initials}
      </text>
    </svg>
  `;

  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
};

export const sigUpUser = createAsyncThunk(
  "auth/sigUpUser",
  async ({ formData, onSuccess }: HandleUser, { rejectWithValue }) => {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(formData?.email, formData?.password);
      const { user } = userCredential;
      const createdAt = firebase.firestore.FieldValue.serverTimestamp();
      const defaultImageUrl = generateDefaultImageUrl(formData?.name);
      formData.profileImage = defaultImageUrl;
      formData.createdAt = createdAt;
      delete formData.password;

      await firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .set(formData);

      const payload = {
        ...formData,
        userId: user?.uid,
      };

      onSuccess();
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const sigInUser = createAsyncThunk(
  "auth/sigInUser",
  async ({ formData, onSuccess }: HandleUser, { rejectWithValue }) => {
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(formData?.email, formData?.password);
      const { user } = userCredential;

      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .get();

      const userData = userDoc.data();

      const payload = {
        ...userData,
        userId: user?.uid,
      };

      onSuccess();
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const sigOutUser = createAsyncThunk(
  "auth/sigOutUser",
  async ({ onSuccess }: Logout, { rejectWithValue }) => {
    try {
      const payload = null;
      onSuccess();
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// export const getProfile = createAsyncThunk(
//   "auth/getProfile",
//   async ({ userId }: any, { rejectWithValue }) => {
//     try {
//       alert("Hello Ahsan Iqbal");
//       const snapshot = await firebase
//         .firestore()
//         .collection("users")
//         .doc(userId)
//         .get();
//       const users = snapshot?.data();
//       return users;
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

interface AuthState {
  user: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sigUpUser.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(sigUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(sigUpUser.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      })
      .addCase(sigInUser.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(sigInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(sigInUser.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      })
      .addCase(sigOutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
