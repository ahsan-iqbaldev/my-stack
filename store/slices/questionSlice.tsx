import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../../config/firebase";

interface addQuestion {
  payload: any;
  onSuccess: any;
}

// export const addQuestion = createAsyncThunk(
//   "question/addQuestion",
//   async ({ payload, onSuccess }: addQuestion, { rejectWithValue }) => {
//     try {
//       const createdAt = firebase.firestore.FieldValue.serverTimestamp();
//       payload.createdAt = createdAt;
//       await firebase
//         .firestore()
//         .collection("questions")
//         .add(payload)
//         .then((docRef) => {
//           console.log(docRef.id, "Document written with ID: ", docRef.id);
//         });
//       console.log(payload, "payload");
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const addQuestion = createAsyncThunk(
  "question/addQuestion",
  async (
    { payload, onSuccess }: { payload: any; onSuccess: () => void },
    { rejectWithValue }
  ) => {
    try {
      console.log(payload, "payload");
      const createdAt = firebase.firestore.FieldValue.serverTimestamp();
      payload.createdAt = createdAt;

      const questionRef = await firebase
        .firestore()
        .collection("questions")
        .add(payload);
      console.log(questionRef.id, "Document written with ID: ", questionRef.id);

      const tagsToUpdate = payload.tags || [];

      for (const tag of tagsToUpdate) {
        const batch = firebase.firestore().batch();

        const tagQuerySnapshot = await firebase
          .firestore()
          .collection("tags")
          .where("name", "==", tag)
          .get();
        tagQuerySnapshot.forEach((tagDoc) => {
          const tagRef = firebase.firestore().collection("tags").doc(tagDoc.id);
          batch.update(tagRef, {
            questions: firebase.firestore.FieldValue.arrayUnion(questionRef.id),
          });
        });

        await batch.commit();
      }

      onSuccess();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getTags = createAsyncThunk(
  "question/getTags",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await firebase.firestore().collection("tags").get();
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
  tags: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  tags: null,
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(getTags.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default questionSlice.reducer;
