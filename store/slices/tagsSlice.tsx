import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../../config/firebase";

interface getProfile {
  userId: string;
}

export const getTags = createAsyncThunk(
  "tags/getTags",
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

export const getSingleTag = createAsyncThunk(
  "tags/getSingleTag",
  async (
    { tagId, onSuccess }: { tagId: string; onSuccess: any },
    { rejectWithValue }
  ) => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("tags")
        .doc(tagId)
        .get();
      const users = { ...snapshot?.data(), id: snapshot?.id };
      onSuccess(users);
      return users;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getTagQuestions = createAsyncThunk(
  "tags/getTagQuestions",
  async ({ questionIds }: { questionIds: string[] }, { rejectWithValue }) => {
    try {
      console.log(questionIds, "questionIdsquestionIds");
      const fetchedQuestions = [];

      for (const questionId of questionIds) {
        const questionDocRef = await firebase
          .firestore()
          .collection("questions")
          .doc(questionId)
          .get();

        if (questionDocRef.exists) {
          let questionData = questionDocRef.data() || {};
          questionData.id = questionDocRef.id;
          const authorId = questionData?.author;
          if (authorId) {
            const userDocRef = await firebase
              .firestore()
              .collection("users")
              .doc(authorId)
              .get();

            if (userDocRef.exists) {
              const userData = userDocRef.data();
              questionData.author = userData;
            } else {
              console.error(`Author with ID ${authorId} not found`);
            }
          } else {
            console.error(
              `Author ID not found in question data for question ID ${questionId}`
            );
          }

          fetchedQuestions.push(questionData);
        } else {
          console.error(`Question with ID ${questionId} not found`);
        }
      }
      console.log(fetchedQuestions, "fetchedQuestionsfetchedQuestions");

      return fetchedQuestions;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface AuthState {
  tags: any;
  questions: any;
  singleTag: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  tags: [],
  questions: [],
  singleTag: null,
  loading: false,
  error: null,
};

const tagsSlice = createSlice({
  name: "tags",
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
      })
      .addCase(getSingleTag.pending, (state) => {
        console.log("Running");
        // state.loading = true;
        state.error = null;
      })
      .addCase(getSingleTag.fulfilled, (state, action) => {
        // state.loading = false;
        state.singleTag = action.payload;
      })
      .addCase(getSingleTag.rejected, (state, action) => {
        console.log("Error");
        // state.loading = false;
        state.error = action.error;
      })
      .addCase(getTagQuestions.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getTagQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(getTagQuestions.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default tagsSlice.reducer;
