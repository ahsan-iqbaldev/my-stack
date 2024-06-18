import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../../config/firebase";

export const getQuestions = createAsyncThunk(
  "home/getQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await firebase.firestore().collection("questions").get();

      const questions: Promise<any>[] = snapshot.docs.map(async (doc) => {
        console.log(doc.data(), "docdocdocdocdocahsan");
        const questionData: any = {
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

        return questionData;
      });

      // Resolve all promises in parallel
      const resolvedQuestions = await Promise.all(questions);

      return resolvedQuestions;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// export const getSingleQuestion = createAsyncThunk(
//   "home/getSingleQuestion",
//   async ({ docId, userId }: any, { rejectWithValue }) => {
//     try {
//       const docSnapshot = await firebase
//         .firestore()
//         .collection("questions")
//         .doc(docId)
//         .get();

//       if (docSnapshot.exists) {
//         const questionData: any = {
//           id: docSnapshot.id,
//           ...docSnapshot.data(),
//         };

//         // Fetch author data from users collection based on authorId
//         if (questionData?.author) {
//           const userDoc = await firebase
//             .firestore()
//             .collection("users")
//             .doc(questionData?.author)
//             .get();
//           if (userDoc.exists) {
//             questionData.author = userDoc.data();
//           } else {
//             questionData.author = null; // Handle case where author is not found
//           }
//         } else {
//           questionData.author = null; // Handle case where authorId is missing
//         }

//         return questionData;
//       } else {
//         return null; // Handle case where the document does not exist
//       }
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const getSingleQuestion = createAsyncThunk(
  "home/getSingleQuestion",
  async ({ docId, userId }: any, { rejectWithValue }) => {
    try {
      // Fetch question data from 'questions' collection
      const questionDoc = await firebase
        .firestore()
        .collection("questions")
        .doc(docId)
        .get();

      if (questionDoc.exists) {
        let questionData: any = {
          id: questionDoc.id,
          ...questionDoc.data(),
        };

        // Fetch author data from 'users' collection based on authorId
        if (questionData?.author) {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(questionData?.author)
            .get();
          questionData.author = userDoc.exists ? userDoc.data() : null;
        } else {
          questionData.author = null;
        }

        // Fetch statistics from 'votes' collection based on docId and userId
        const votesQuerySnapshot = await firebase
          .firestore()
          .collection("votes")
          .where("docId", "==", docId)
          .where("userId", "==", userId)
          .get();

        if (!votesQuerySnapshot.empty) {
          const votesData = votesQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          questionData.stats = votesData;
        } else {
          questionData.stats = null;
        }

        return questionData;
      } else {
        return null;
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const handleVotes = createAsyncThunk(
  "home/handleVotes",
  async ({ payload }: any, { rejectWithValue }) => {
    console.log(payload, "payload");
    try {
      await firebase
        .firestore()
        .collection("votes")
        .add(payload)
        .then((docRef) => {
          firebase
            .firestore()
            .collection("questions")
            .doc(payload?.docId)
            .update({
              upvotes: firebase.firestore.FieldValue.increment(1),
            });
        });
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface AuthState {
  allQuestions: any;
  sinleQuestion: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  allQuestions: [],
  sinleQuestion: null,
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuestions.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.allQuestions = action.payload;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getSingleQuestion.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleQuestion.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "Updated question data:");
        state.sinleQuestion = action.payload;
      })
      .addCase(getSingleQuestion.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default homeSlice.reducer;
