import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../../config/firebase";

export const getMyQuestions = createAsyncThunk(
  "collection/getMyQuestions",
  async ({ userId }: any, { rejectWithValue }) => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("questions")
        .where("author", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      if (snapshot.empty) {
        console.log("No matching documents.");
        return [];
      }

      const questions: any[] = [];

      for (const doc of snapshot.docs) {
        let questionData: any = {
          id: doc.id,
          ...doc.data(),
        };

        if (questionData.author) {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(questionData.author)
            .get();

          if (userDoc.exists) {
            questionData.author = userDoc.data();
          } else {
            questionData.author = null;
          }
        } else {
          questionData.author = null;
        }

        questions.push(questionData);
      }

      console.log(questions, "questions");

      return questions;
    } catch (err: any) {
      console.error("Error in getMyQuestions thunk:", err);
      return rejectWithValue(err.message);
    }
  }
);

interface AuthState {
  questions: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  questions: [],
  loading: false,
  error: null,
};

const collectionSlice = createSlice({
  name: "collection",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyQuestions.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyQuestions.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "payload");
        state.questions = action.payload;
      })
      .addCase(getMyQuestions.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default collectionSlice.reducer;
